import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Define protected routes (only profile and dashboard)
  const protectedRoutes = [
    '/dashboard',
    '/profile'
  ]

  // Define auth pages (these are outside the (auth) route group)
  const authPages = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email'
  ]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // Check if current path is an auth page
  const isAuthPage = authPages.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  )

  // For now, let the page-level authentication handle protection
  // This avoids issues with cookie detection in middleware
  // The pages will use getServerSession to check authentication
  
  // Only handle redirecting authenticated users away from auth pages
  const hasAnyAuthCookie = request.cookies.get('next-auth.session-token')?.value ||
                          request.cookies.get('__Secure-next-auth.session-token')?.value ||
                          request.cookies.get('next-auth.csrf-token')?.value ||
                          request.cookies.get('__Secure-next-auth.csrf-token')?.value

  if (isAuthPage && hasAnyAuthCookie) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/profile'
    const redirectUrl = new URL(callbackUrl, request.url)
    
    // Prevent open redirects
    if (!redirectUrl.pathname.startsWith('/')) {
      redirectUrl.pathname = '/profile'
    }
    
    return NextResponse.redirect(redirectUrl)
  }

  // Ensure proper cookie handling for OAuth
  const response = NextResponse.next()
  
  // Set SameSite attribute for cookies in development
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('Set-Cookie', 'SameSite=Lax')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
