import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!institutionId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const todayAttendances = await db.attendance.findMany({
      where: { institutionId, date }
    })

    const present = new Set(todayAttendances.filter(a => a.type === 'in').map(a => a.studentId)).size
    const late = todayAttendances.filter(a => a.status === 'late').length
    const out = todayAttendances.filter(a => a.type === 'out').length
    const totalScans = todayAttendances.length

    const totalStudents = await db.student.count({
      where: { institutionId, active: true }
    })

    const absent = Math.max(0, totalStudents - present)

    // Weekly stats
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyAttendances = await db.attendance.findMany({
      where: { institutionId, scanTime: { gte: weekAgo } }
    })

    const weeklyByDay: Record<string, { present: number; late: number }> = {}
    for (const att of weeklyAttendances) {
      if (!weeklyByDay[att.date]) weeklyByDay[att.date] = { present: 0, late: 0 }
      if (att.type === 'in') {
        weeklyByDay[att.date].present++
        if (att.status === 'late') weeklyByDay[att.date].late++
      }
    }

    // Recent activity
    const recentActivity = await db.attendance.findMany({
      where: { institutionId },
      orderBy: { scanTime: 'desc' },
      take: 10,
      include: { student: { select: { name: true, photo: true } } }
    })

    return NextResponse.json({
      today: {
        date,
        present,
        absent,
        late,
        out,
        totalScans,
        percentage: totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0
      },
      weekly: weeklyByDay,
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        type: a.type,
        status: a.status,
        time: a.scanTime,
        student: a.student.name,
        photo: a.student.photo
      })),
      stats: {
        totalStudents,
        averageAttendance: totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
