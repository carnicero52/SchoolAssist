import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - List shifts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId')

  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
  }

  const shifts = await db.shift.findMany({
    where: { institutionId, active: true },
    orderBy: { name: 'asc' }
  })

  return NextResponse.json({ shifts })
}

// POST - Create shift
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, name, startTime, endTime, graceMinutes } = body

    if (!institutionId || !name || !startTime || !endTime) {
      return NextResponse.json({ error: 'institutionId, name, startTime y endTime requeridos' }, { status: 400 })
    }

    const shift = await db.shift.create({
      data: { 
        institutionId, 
        name, 
        startTime, 
        endTime,
        graceMinutes: graceMinutes || 15
      }
    })

    return NextResponse.json({ success: true, shift })
  } catch (error) {
    console.error('Create shift error:', error)
    return NextResponse.json({ error: 'Error al crear turno' }, { status: 500 })
  }
}

// DELETE - Delete shift
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id requerido' }, { status: 400 })
  }

  await db.shift.delete({ where: { id } })

  return NextResponse.json({ success: true })
}