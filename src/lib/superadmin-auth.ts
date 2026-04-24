import { NextRequest, NextResponse } from 'next/server'

const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || 'schoolassist-superadmin-2026'

export function verifySuperadmin(request: NextRequest): NextResponse | null {
  const cookie = request.cookies.get('schoolassist-superadmin')?.value

  if (!cookie || cookie !== SUPERADMIN_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  return null // No error, user is authenticated
}
