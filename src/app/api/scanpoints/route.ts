import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - List scan points
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId')

  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
  }

  const scanPoints = await db.scanPoint.findMany({
    where: { institutionId, active: true }
  })

  return NextResponse.json({ scanPoints })
}

// POST - Create scan point
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, name, location } = body

    if (!institutionId || !name) {
      return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })
    }

    const scanPoint = await db.scanPoint.create({
      data: { institutionId, name, location }
    })

    return NextResponse.json({ success: true, scanPoint })
  } catch (error) {
    console.error('Create scan point error:', error)
    return NextResponse.json({ error: 'Error al crear punto' }, { status: 500 })
  }
}

// DELETE - Delete scan point
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  await db.scanPoint.delete({ where: { id } })

  return NextResponse.json({ success: true })
}