import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const levels = await db.level.findMany({
      where: { institutionId, active: true },
      orderBy: { order: 'asc' },
      include: { _count: { select: { groups: true } } }
    })
    return NextResponse.json({ levels })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { name, order } = body

    if (!institutionId || !name) return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })

    const level = await db.level.create({ data: { institutionId, name, order: order || 0 } })
    return NextResponse.json({ success: true, level })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear nivel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    await db.level.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
