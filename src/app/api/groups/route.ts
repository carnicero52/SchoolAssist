import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - List groups
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const levelId = searchParams.get('levelId')
  const institutionId = searchParams.get('institutionId')

  if (!institutionId || !levelId) {
    return NextResponse.json({ error: 'institutionId y levelId requeridos' }, { status: 400 })
  }

  const groups = await db.group.findMany({
    where: { levelId, active: true },
    orderBy: { order: 'asc' },
    include: {
      _count: { select: { students: true } }
    }
  })

  return NextResponse.json({ groups })
}

// POST - Create group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { levelId, name, order } = body

    if (!levelId || !name) {
      return NextResponse.json({ error: 'levelId y name requeridos' }, { status: 400 })
    }

    const group = await db.group.create({
      data: { levelId, name, order: order || 0 }
    })

    return NextResponse.json({ success: true, group })
  } catch (error) {
    console.error('Create group error:', error)
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 })
  }
}

// DELETE - Delete group
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  await db.group.delete({ where: { id } })

  return NextResponse.json({ success: true })
}