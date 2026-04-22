import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmailNotification } from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const institutionId = request.headers.get('x-institution-id')

    const student = await db.student.findUnique({
      where: { id },
      include: { institution: true, qrCode: true, level: true, group: true }
    })

    if (!student || student.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
    }

    if (!student.guardianEmail && !student.email) {
      return NextResponse.json({ error: 'Sin email de contacto' }, { status: 400 })
    }

    const institution = student.institution
    if (institution.smtpHost) {
      const message = `Hola,\n\nSe ha generado la credencial del estudiante ${student.name}.\nCódigo: ${student.code}\nNivel: ${student.level?.name || 'N/A'}\nGrupo: ${student.group?.name || 'N/A'}\n\nCódigo QR: ${student.qrCode?.code || student.code}\n\nSaludos,\n${institution.name}`
      
      await sendEmailNotification(
        student.guardianEmail || student.email || '',
        `Credencial - ${student.name}`,
        message,
        {
          host: institution.smtpHost,
          port: institution.smtpPort || 587,
          user: institution.smtpUser || '',
          password: institution.smtpPassword || '',
          from: institution.smtpFrom || undefined
        }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Credential error:', error)
    return NextResponse.json({ error: 'Error al enviar credencial' }, { status: 500 })
  }
}
