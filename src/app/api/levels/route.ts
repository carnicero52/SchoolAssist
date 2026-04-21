import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - List levels
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId')
  
  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
  }

  const levels = await db.level.findMany({
    where: { institutionId, active: true },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { groups: true } }
    }
  })

  return NextResponse.json({ levels })
}

// POST - Create level
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, name, order } = body

    if (!institutionId || !name) {
      return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })
    }

    const level = await db.level.create({
      data: { institutionId, name, order: order || 0 }
    })

    return NextResponse.json({ success: true, level })
  } catch (error) {
    console.error('Create level error:', error)
    return NextResponse.json({ error: 'Error al crear nivel' }, { status: 500 })
  }
}

// DELETE - Delete level
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  await db.level.delete({ where: { id } })

  return NextResponse.json({ success: true })
}