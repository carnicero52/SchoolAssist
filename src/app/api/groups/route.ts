import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get('levelId')
    if (!levelId) return NextResponse.json({ error: 'levelId requerido' }, { status: 400 })

    const groups = await db.group.findMany({
      where: { levelId, active: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { students: true } } }
    })
    return NextResponse.json({ groups })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { levelId, name, order } = body
    if (!levelId || !name) return NextResponse.json({ error: 'levelId y name requeridos' }, { status: 400 })

    const group = await db.group.create({ data: { levelId, name, order: order || 0 } })
    return NextResponse.json({ success: true, group })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    await db.group.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
