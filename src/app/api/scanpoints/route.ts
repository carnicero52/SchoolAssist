import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const scanPoints = await db.scanPoint.findMany({ where: { institutionId, active: true } })
    return NextResponse.json({ scanPoints })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { name, location } = body

    if (!institutionId || !name) return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })

    const scanPoint = await db.scanPoint.create({ data: { institutionId, name, location } })
    return NextResponse.json({ success: true, scanPoint })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear punto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })

    await db.scanPoint.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
