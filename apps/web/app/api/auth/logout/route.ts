import { NextRequest, NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth/auth'
import { getCurrentSessionInfo } from '@/lib/auth/session-manager'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions())
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'No active session' }), {
        status: 401,
      })
    }

    // Get current session info
    const currentSession = await getCurrentSessionInfo(session.user.id)
    
    if (currentSession) {
      // Delete the current session
      await prisma.session.delete({
        where: { id: currentSession.id }
      })
    }

    // Create response with cleared cookies
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })

    // Clear ALL NextAuth.js cookies - both secure and non-secure versions
    const cookiesToDelete = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      'next-auth.pkce.code-verifier',
      '__Secure-next-auth.pkce.code-verifier',
      'next-auth.state',
      '__Secure-next-auth.state',
      'next-auth.nonce',
      '__Secure-next-auth.nonce',
      'next-auth.provider',
      '__Secure-next-auth.provider'
    ]

    // Get the host to determine the domain for cookie clearing
    const host = request.headers.get('host') || 'localhost'
    const domain = host.includes(':') ? host.split(':')[0] : host

    // Delete each cookie with multiple strategies
    cookiesToDelete.forEach(cookieName => {
      // Strategy 1: Delete the cookie
      response.cookies.delete(cookieName)
      
      // Strategy 2: Set cookie to expire immediately with root path
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      // Strategy 3: Set cookie to expire immediately with domain
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        domain: domain,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      // Strategy 4: Set cookie to expire immediately without domain (for localhost)
      if (domain === 'localhost') {
        response.cookies.set(cookieName, '', {
          expires: new Date(0),
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'lax'
        })
      }
    })

    // Also clear any other potential auth-related cookies
    const additionalCookies = [
      'auth-token',
      'session-token',
      'user-token',
      'access-token',
      'refresh-token'
    ]

    additionalCookies.forEach(cookieName => {
      response.cookies.delete(cookieName)
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    // Set cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"')

    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 