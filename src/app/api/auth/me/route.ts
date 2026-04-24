import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check for session cookie
    const sessionCookie = request.cookies.get('session')

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // In a real app, verify the JWT token
    // For now, return the session data
    try {
      const sessionData = JSON.parse(atob(sessionCookie.value))
      return NextResponse.json({ user: sessionData })
    } catch {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
