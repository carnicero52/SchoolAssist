import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /superadmin route (but not /superadmin-login)
  if (pathname === '/superadmin' || pathname.startsWith('/superadmin/')) {
    if (pathname === '/superadmin-login') {
      return NextResponse.next()
    }

    const authCookie = request.cookies.get('superadmin_auth')
    if (authCookie?.value !== 'authenticated') {
      return NextResponse.redirect(new URL('/superadmin-login', request.url))
    }
  }

  // Add anti-cache headers for authenticated pages
  const response = NextResponse.next()
  if (pathname.startsWith('/admin') || pathname.startsWith('/superadmin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: ['/superadmin/:path*', '/admin/:path*']
}
