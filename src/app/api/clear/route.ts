import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { type, startDate, endDate } = body

    if (!institutionId || !type) return NextResponse.json({ error: 'institutionId y type requeridos' }, { status: 400 })

    let deleted = 0

    if (type === 'attendance') {
      const where: any = { institutionId }
      if (startDate && endDate) where.scanTime = { gte: new Date(startDate), lte: new Date(endDate) }
      const result = await db.attendance.deleteMany({ where })
      deleted = result.count
    }

    if (type === 'notifications') {
      const result = await db.notification.deleteMany({ where: { institutionId } })
      deleted = result.count
    }

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    return NextResponse.json({ error: 'Error al limpiar' }, { status: 500 })
  }
}
