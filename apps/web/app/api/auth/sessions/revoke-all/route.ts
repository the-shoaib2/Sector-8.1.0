import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/auth'
import { revokeAllSessions } from '@/lib/auth/session-manager'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Revoke all sessions for the user
    const deletedCount = await revokeAllSessions(session.user.id)

    if (deletedCount === 0) {
      return new NextResponse(JSON.stringify({ error: 'No sessions were found to revoke' }), {
        status: 404,
      })
    }

    // Since we're revoking all sessions, the current session is included
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Successfully revoked all ${deletedCount} session(s)`,
      logoutRequired: true,
      reason: 'All sessions were revoked'
    })
  } catch (error) {
    console.error('Error revoking all sessions:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 