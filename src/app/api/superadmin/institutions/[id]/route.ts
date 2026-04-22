import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { active } = await request.json()

    const institution = await db.institution.update({
      where: { id }, data: { active }
    })

    return NextResponse.json({ success: true, institution: { id: institution.id, active: institution.active } })
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
