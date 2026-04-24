import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, COOKIE_NAME_EXPORT } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const staff = await db.staff.findUnique({
      where: { email },
      include: { institution: true }
    })

    if (!staff) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const validPassword = await bcrypt.compare(password, staff.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    if (!staff.active) {
      return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 401 })
    }

    if (!staff.institution.active) {
      return NextResponse.json({ error: 'Institución suspendida' }, { status: 401 })
    }

    await db.staff.update({
      where: { id: staff.id },
      data: { lastLogin: new Date() }
    })

    const token = await signToken({
      userId: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      institutionId: staff.institutionId,
      institutionName: staff.institution.name
    })

    const response = NextResponse.json({
      user: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        institutionId: staff.institutionId,
        institutionName: staff.institution.name
      }
    })

    response.cookies.set(COOKIE_NAME_EXPORT, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
