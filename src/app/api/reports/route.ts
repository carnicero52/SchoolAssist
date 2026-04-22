import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week'

    if (!institutionId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now)
        startDate.setDate(startDate.getDate() - 7)
    }

    const attendances = await db.attendance.findMany({
      where: {
        institutionId,
        scanTime: { gte: startDate }
      },
      include: {
        student: { select: { name: true, level: true, group: true } }
      },
      orderBy: { scanTime: 'desc' }
    })

    const totalStudents = await db.student.count({
      where: { institutionId, active: true }
    })

    const totalScans = attendances.length
    const present = new Set(attendances.filter(a => a.type === 'in').map(a => a.studentId)).size
    const late = attendances.filter(a => a.status === 'late').length
    const absent = Math.max(0, totalStudents - present)
    const percentage = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0

    // Group by date for chart
    const byDate: Record<string, { present: number; late: number; absent: number }> = {}
    for (const att of attendances) {
      if (!byDate[att.date]) {
        byDate[att.date] = { present: 0, late: 0, absent: 0 }
      }
      if (att.type === 'in') {
        byDate[att.date].present++
        if (att.status === 'late') byDate[att.date].late++
      }
    }

    return NextResponse.json({
      total: totalScans,
      present,
      absent,
      late,
      percentage,
      totalStudents,
      byDate,
      period
    })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
