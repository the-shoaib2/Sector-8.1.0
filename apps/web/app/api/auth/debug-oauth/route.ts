import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/auth'

export async function GET(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse(JSON.stringify({ error: 'Debug endpoint only available in development' }), {
        status: 403,
      })
    }

    const googleProvider = authOptions.providers.find(p => p.id === 'google')
    
    const debugInfo = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      },
      googleProvider: googleProvider ? {
        id: googleProvider.id,
        clientId: (googleProvider as any).clientId ? 'SET' : 'NOT SET',
        clientSecret: (googleProvider as any).clientSecret ? 'SET' : 'NOT SET',
        authorization: (googleProvider as any).authorization,
      } : null,
      callbackUrls: {
        baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        callbackUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
      },
      pages: authOptions.pages,
      request: {
        url: request.url,
        headers: {
          host: request.headers.get('host'),
          'user-agent': request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
        }
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error('Error in debug OAuth:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
} 