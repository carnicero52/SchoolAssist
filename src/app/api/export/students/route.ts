import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const students = await db.student.findMany({
      where: { institutionId },
      include: { level: true, group: true },
      orderBy: { name: 'asc' }
    })

    if (format === 'json') return NextResponse.json({ students })

    const escape = (val: any) => {
      const str = String(val ?? '')
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }

    const headers = ['Código', 'Nombre', 'Cédula', 'Nivel', 'Grupo', 'Teléfono', 'Email Apoderado', 'Teléfono Apoderado', 'Asistencias', 'Faltas', 'Tarde']
    const rows = students.map(s => [
      escape(s.code), escape(s.name), escape(s.cedula || ''),
      escape(s.level?.name || ''), escape(s.group?.name || ''),
      escape(s.phone || ''), escape(s.guardianEmail || ''),
      escape(s.guardianPhone || ''), s.totalAttendances, s.totalAbsences, s.totalLates
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="estudiantes.csv"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 })
  }
}
