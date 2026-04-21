import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Export students
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const format = searchParams.get('format') || 'csv'

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    const students = await db.student.findMany({
      where: { institutionId },
      include: { level: true, group: true },
      orderBy: { name: 'asc' }
    })

    if (format === 'json') {
      return NextResponse.json({ students })
    }

    // CSV export
    const headers = ['Código', 'Nombre', 'Cédula', 'Nivel', 'Grupo', 'Teléfono', 'Email Apoderado', 'Teléfono Apoderado', 'Asistencias', 'Faltas', 'Tarde']
    const rows = students.map(s => [
      s.code,
      s.name,
      s.cedula || '',
      s.level?.name || '',
      s.group?.name || '',
      s.phone || '',
      s.guardianEmail || '',
      s.guardianPhone || '',
      s.totalAttendances,
      s.totalAbsences,
      s.totalLates
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="estudiantes-${institutionId}.csv"`
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 })
  }
}