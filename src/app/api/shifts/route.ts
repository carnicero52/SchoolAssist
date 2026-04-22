import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const shifts = await db.shift.findMany({
      where: { institutionId, active: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ shifts })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { name, startTime, endTime, graceMinutes } = body

    if (!institutionId || !name || !startTime || !endTime) {
      return NextResponse.json({ error: 'institutionId, name, startTime y endTime requeridos' }, { status: 400 })
    }

    const shift = await db.shift.create({
      data: { institutionId, name, startTime, endTime, graceMinutes: graceMinutes || 15 }
    })
    return NextResponse.json({ success: true, shift })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear turno' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    await db.shift.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
