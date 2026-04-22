import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'schoolassist-secret-key-2026')

const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout', '/api/init', '/api/route', '/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public paths
  if (publicPaths.some(p => pathname === p) || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }
  
  // Allow superadmin path (has its own auth check)
  if (pathname.startsWith('/superadmin')) {
    return NextResponse.next()
  }
  
  const token = request.cookies.get('schoolassist-token')?.value
  
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    const { payload } = await jwtVerify(token, SECRET)
    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.userId as string)
    requestHeaders.set('x-user-email', payload.email as string)
    requestHeaders.set('x-user-role', payload.role as string)
    requestHeaders.set('x-institution-id', payload.institutionId as string)
    requestHeaders.set('x-institution-name', payload.institutionName as string)
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    })
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('schoolassist-token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}
