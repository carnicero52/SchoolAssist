import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// POST - Clear attendance history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, type, startDate, endDate } = body

    if (!institutionId || !type) {
      return NextResponse.json({ error: 'institutionId y type requeridos' }, { status: 400 })
    }

    let deleted = 0

    if (type === 'attendance') {
      const where: any = { institutionId }
      
      if (startDate && endDate) {
        where.scanTime = {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }

      const result = await db.attendance.deleteMany({ where })
      deleted = result.count
    }

    if (type === 'notifications') {
      const result = await db.notification.deleteMany({ 
        where: { institutionId } 
      })
      deleted = result.count
    }

    // Log action
    await db.actionLog.create({
      data: {
        userId: 'system',
        institutionId,
        action: `clear_${type}`,
        details: `Deleted ${deleted} records`
      }
    })

    return NextResponse.json({ success: true, deleted })
  } catch (error) {
    console.error('Clear error:', error)
    return NextResponse.json({ error: 'Error al clear' }, { status: 500 })
  }
}