import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions, getCurrentSessionInfo } from '@/lib/auth/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
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

    // Clear session cookies
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('__Secure-next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    response.cookies.delete('__Secure-next-auth.csrf-token')
    response.cookies.delete('next-auth.callback-url')
    response.cookies.delete('__Secure-next-auth.callback-url')

    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 