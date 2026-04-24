import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    // Find staff member
    const staff = await db.staff.findUnique({
      where: { email },
      include: { institution: true }
    })

    if (!staff) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, staff.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    if (!staff.active) {
      return NextResponse.json({ error: 'Cuenta desactivada' }, { status: 401 })
    }

    // Update last login
    await db.staff.update({
      where: { id: staff.id },
      data: { lastLogin: new Date() }
    })

    // Create session data
    const sessionData = {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      institutionId: staff.institutionId,
      institutionName: staff.institution.name
    }

    // Return user info and set session cookie
    const response = NextResponse.json({
      user: sessionData
    })

    // Set session cookie (base64 encoded)
    response.cookies.set('session', btoa(JSON.stringify(sessionData)), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
