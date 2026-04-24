import { NextRequest, NextResponse } from 'next/server'

const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || 'schoolassist-superadmin-2026'

export async function POST(request: NextRequest) {
  try {
    const { secretKey } = await request.json()

    if (!secretKey) {
      return NextResponse.json({ error: 'Clave requerida' }, { status: 400 })
    }

    if (secretKey !== SUPERADMIN_SECRET) {
      return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set('schoolassist-superadmin', SUPERADMIN_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
