import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const staff = await db.staff.findMany({
      where: { institutionId },
      select: { id: true, name: true, email: true, role: true, phone: true, active: true, lastLogin: true, createdAt: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ staff })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { name, email, password, role, phone } = body

    if (!institutionId || !name || !email || !password || !role) {
      return NextResponse.json({ error: 'Todos los campos requeridos' }, { status: 400 })
    }

    const existing = await db.staff.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 })

    const hashedPassword = await bcrypt.hash(password, 10)
    const staff = await db.staff.create({
      data: { institutionId, name, email, password: hashedPassword, role, phone }
    })

    return NextResponse.json({ success: true, staff: { id: staff.id, name: staff.name, email: staff.email, role: staff.role } })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, phone, role, active, newPassword } = body
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    const data: any = { name, phone, role, active }
    if (newPassword) data.password = await bcrypt.hash(newPassword, 10)

    await db.staff.update({ where: { id }, data })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    await db.staff.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
