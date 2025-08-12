import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, updateSessionInfo, getCurrentSessionInfo } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'
import { getLocationFromIP } from '@/lib/location-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Get user agent and IP from request headers
    const userAgent = request.headers.get('user-agent') || ''
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') || // Cloudflare
      request.headers.get('x-client-ip') ||
      (request as any).ip || // Next.js edge runtime may provide this
      ''

    // Get current session info more reliably
    const currentSession = await getCurrentSessionInfo(session.user.id)

    if (!currentSession) {
      return new NextResponse(JSON.stringify({ error: 'No active session found' }), {
        status: 404,
      })
    }

    // Get location data if we have an IP address
    let locationData = {}
    if (ipAddress) {
      try {
        locationData = await getLocationFromIP(ipAddress)
      } catch (error) {
        console.error('Error getting location data:', error)
        // Provide fallback location data
        locationData = {
          ipAddress,
          city: 'Unknown Location',
          country: 'Unknown'
        }
      }
    }

    // Update session info with location data
    const success = await updateSessionInfo(
      currentSession.sessionToken, 
      userAgent, 
      ipAddress, 
      session.user.id,
      locationData
    )

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Session updated successfully',
        deviceInfo: {
          userAgent: userAgent || 'unknown',
          ipAddress: ipAddress || 'unknown',
          location: locationData
        }
      })
    } else {
      return new NextResponse(JSON.stringify({ error: 'Failed to update session' }), {
        status: 500,
      })
    }
  } catch (error) {
    // console.error('Error updating session:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 