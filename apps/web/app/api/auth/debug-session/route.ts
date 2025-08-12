import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, getCurrentSessionInfo, getCurrentSessionToken } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Get session token from cookies
    const cookieToken = getCurrentSessionToken(request)
    
    // Get current session from database
    const dbSession = await getCurrentSessionInfo(session.user.id)
    
    // Get all sessions for user
    const allSessions = await prisma.session.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
        updatedAt: true,
        ipAddress: true,
        userAgent: true,
        deviceType: true,
        deviceModel: true,
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email
      },
      cookieToken,
      dbSession: dbSession ? {
        id: dbSession.id,
        sessionToken: dbSession.sessionToken,
        expires: dbSession.expires,
        updatedAt: dbSession.updatedAt,
        ipAddress: dbSession.ipAddress,
        userAgent: dbSession.userAgent,
        deviceType: dbSession.deviceType,
        deviceModel: dbSession.deviceModel,
      } : null,
      allSessions,
      tokenMatch: cookieToken === dbSession?.sessionToken,
      headers: {
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                   request.headers.get('x-real-ip') ||
                   request.headers.get('cf-connecting-ip') ||
                   request.headers.get('x-client-ip') ||
                   (request as any).ip
      }
    })
  } catch (error) {
    console.error('Error in debug session:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 