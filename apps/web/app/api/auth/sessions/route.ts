import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { getAuthOptions } from '@/lib/auth/auth'
import { updateSessionInfo, getCurrentSessionInfo, revokeMultipleSessions } from '@/lib/auth/session-manager'
import { getLocationFromIP } from '@/lib/location-utils'
import { parseDeviceInfo, capitalizeDeviceType } from '@/lib/auth/utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions())
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Get user agent and IP from request headers with better detection
    const userAgent = request.headers.get('user-agent') || ''
    
    // Enhanced IP address detection
    let ipAddress = ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    const xClientIp = request.headers.get('x-client-ip')
    
    if (forwardedFor) {
      ipAddress = forwardedFor.split(',')[0].trim()
    } else if (realIp) {
      ipAddress = realIp
    } else if (cfConnectingIp) {
      ipAddress = cfConnectingIp
    } else if (xClientIp) {
      ipAddress = xClientIp
    } else if ((request as any).ip) {
      ipAddress = (request as any).ip
    }

    // Clean up IP address (remove IPv6 prefix if present)
    if (ipAddress && ipAddress.startsWith('::ffff:')) {
      ipAddress = ipAddress.substring(7)
    }

    // Get current session token from cookies
    const currentSessionToken = request.cookies.get('next-auth.session-token')?.value ||
                               request.cookies.get('__Secure-next-auth.session-token')?.value

    // Update the current session with device information if we have it
    if (currentSessionToken && userAgent && ipAddress) {
      try {
        // Get location data for the IP address
        let locationData: any = {}
        if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== 'localhost' && ipAddress !== '::1') {
          locationData = await getLocationFromIP(ipAddress)
        } else {
          locationData = {
            city: 'Localhost',
            country: 'Development',
            latitude: null,
            longitude: null
          }
        }

        // Update session with device and location info
        await updateSessionInfo(
          currentSessionToken,
          userAgent,
          ipAddress,
          session.user.id,
          locationData
        )
      } catch (updateError) {
        // console.error('Error updating session info:', updateError)
      }
    } else {
      // If no session token or device info, try to create/update a session
      try {
        // Find the most recent session for this user
        const recentSession = await prisma.session.findFirst({
          where: {
            userId: session.user.id,
            expires: { gt: new Date() }
          },
          orderBy: { createdAt: 'desc' }
        })

        if (recentSession && userAgent && ipAddress) {
          // Get location data for the IP address
          let locationData: any = {}
          if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== 'localhost' && ipAddress !== '::1') {
            locationData = await getLocationFromIP(ipAddress)
          } else {
            locationData = {
              city: 'Localhost',
              country: 'Development',
              latitude: null,
              longitude: null
            }
          }

          // Parse device info using utility functions
          const deviceInfo = parseDeviceInfo(userAgent)
          
          // Update the session with device and location info
          await prisma.session.update({
            where: { id: recentSession.id },
            data: {
              userAgent: userAgent,
              ipAddress: ipAddress,
              deviceType: capitalizeDeviceType(deviceInfo.deviceType),
              deviceModel: deviceInfo.deviceModel || 'Unknown Device',
              city: locationData.city || null,
              country: locationData.country || null,
              latitude: locationData.latitude || null,
              longitude: locationData.longitude || null,
              updatedAt: new Date()
            }
          })
        }
      } catch (updateError) {
        // console.error('Error updating session info:', updateError)
      }
    }

    // Get all active sessions for the user
    const allSessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expires: { gt: new Date() }
      },
      select: {
        id: true,
        sessionToken: true,
        userId: true,
        expires: true,
        ipAddress: true,
        userAgent: true,
        deviceType: true,
        deviceModel: true,
        city: true,
        country: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' }
    })



    return NextResponse.json(allSessions)
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions())
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    let ids: string[] = []
    
    try {
      const body = await request.json()
      ids = body?.ids || []
    } catch (parseError) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request body format' }), {
        status: 400,
      })
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Session IDs array is required and must not be empty' }), {
        status: 400,
      })
    }

    // Validate that all IDs are valid ObjectId format
    const validIds = ids.filter(id => /^[0-9a-fA-F]{24}$/.test(id))
    
    if (validIds.length !== ids.length) {
      return new NextResponse(JSON.stringify({ error: 'Some session IDs are invalid' }), {
        status: 400,
      })
    }

    // Check if current session is being deleted
    const currentSession = await getCurrentSessionInfo(session.user.id)
    const isCurrentSessionDeleted = currentSession && validIds.includes(currentSession.id)

    // Revoke the sessions using the session manager
    if (isCurrentSessionDeleted) {
      // If current session is being deleted, revoke it and return logout required
      const deleteResult = await prisma.session.deleteMany({
        where: {
          id: { in: validIds },
          userId: session.user.id
        }
      })
      
      return NextResponse.json({ 
        success: true, 
        deletedCount: deleteResult.count,
        message: `Successfully deleted ${deleteResult.count} session(s)`,
        logoutRequired: true,
        reason: 'Current session was revoked'
      })
    }

    // If current session was not deleted, proceed with deleting other sessions
    const deletedCount = await revokeMultipleSessions(validIds, session.user.id)
    
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Successfully deleted ${deletedCount} session(s)`
    })
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

// Frontend usage: Call fetch('/api/auth/sessions') after login or on first page load after authentication to ensure device info is updated.
