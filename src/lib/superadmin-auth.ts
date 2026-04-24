import { NextRequest } from 'next/server'

export function isSuperAdminAuthenticated(request: NextRequest): boolean {
  const authCookie = request.cookies.get('superadmin_auth')
  return authCookie?.value === 'authenticated'
}
