import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  const email = request.headers.get('x-user-email')
  const role = request.headers.get('x-user-role')
  const institutionId = request.headers.get('x-institution-id')
  const institutionName = request.headers.get('x-institution-name')

  if (!userId || !email) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      userId,
      email,
      role,
      institutionId,
      institutionName
    }
  })
}
