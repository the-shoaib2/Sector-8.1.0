import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/auth'
import { 
  updateSessionInfo, 
  getCurrentSessionInfo, 
  getAllActiveSessions,
  revokeMultipleSessions
} from '@/lib/auth/session-manager'
import { getLocationFromIP } from '@/lib/location-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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

    // Get all active sessions for the user
    const allSessions = await getAllActiveSessions(session.user.id)

    // Update the current session with the latest device info and location
    if (currentSessionToken && (userAgent || ipAddress)) {
      try {
        // Get location data if we have an IP address
        let locationData = {}
        if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== 'localhost' && ipAddress !== '::1') {
          locationData = await getLocationFromIP(ipAddress)
        } else if (ipAddress) {
          locationData = {
            city: 'Localhost',
            country: 'Development',
            latitude: null,
            longitude: null
          }
        }

        const updateResult = await updateSessionInfo(
          currentSessionToken, 
          userAgent, 
          ipAddress, 
          session.user.id,
          locationData
        )
        

      } catch (error) {
        // Continue with fetching sessions even if update fails
      }
    }

    // Re-fetch sessions to get updated info
    const updatedSessions = await prisma.session.findMany({
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



    return NextResponse.json(updatedSessions)
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
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
    const deletedCount = await revokeMultipleSessions(validIds, session.user.id)

    if (deletedCount === 0) {
      return new NextResponse(JSON.stringify({ error: 'No sessions were deleted' }), {
        status: 404,
      })
    }

    // If current session was deleted, return special response to trigger logout
    if (isCurrentSessionDeleted) {
      return NextResponse.json({ 
        success: true, 
        deletedCount,
        message: `Successfully deleted ${deletedCount} session(s)`,
        logoutRequired: true,
        reason: 'Current session was revoked'
      })
    }

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
