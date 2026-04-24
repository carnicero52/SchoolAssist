import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Dashboard stats
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    // Get today's attendance stats
    const todayAttendances = await db.attendance.findMany({
      where: { institutionId, date }
    })

    const totalScans = todayAttendances.length
    const present = todayAttendances.filter(a => a.type === 'in').length
    const late = todayAttendances.filter(a => a.status === 'late').length
    const out = todayAttendances.filter(a => a.type === 'out').length

    // Get total students
    const totalStudents = await db.student.count({
      where: { institutionId, active: true }
    })

    const absent = totalStudents - present

    // Get weekly stats (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weeklyAttendances = await db.attendance.findMany({
      where: {
        institutionId,
        scanTime: { gte: weekAgo }
      }
    })

    const weeklyByDay: Record<string, { present: number; late: number }> = {}
    
    for (const att of weeklyAttendances) {
      const day = att.date
      if (!weeklyByDay[day]) {
        weeklyByDay[day] = { present: 0, late: 0 }
      }
      if (att.type === 'in') {
        weeklyByDay[day].present++
        if (att.status === 'late') {
          weeklyByDay[day].late++
        }
      }
    }

    // Get recent activity
    const recentActivity = await db.attendance.findMany({
      where: { institutionId },
      orderBy: { scanTime: 'desc' },
      take: 10,
      include: {
        student: { select: { name: true, photo: true } }
      }
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