import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const institutionId = request.headers.get('x-institution-id')

    if (!institutionId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const student = await db.student.findUnique({
      where: { id },
      include: { qrCode: true }
    })

    if (!student || student.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      code: student.qrCode?.code || student.code,
      active: student.qrCode?.active ?? true
    })
  } catch (error) {
    console.error('QR fetch error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
