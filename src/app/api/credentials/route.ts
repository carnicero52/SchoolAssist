import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmailNotification } from '@/lib/notifications'

// POST /api/credentials - Send student credential email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentId, institutionId } = body

    if (!studentId || !institutionId) {
      return NextResponse.json({ error: 'studentId e institutionId requeridos' }, { status: 400 })
    }

    // Get student with institution, level and group
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: { institution: true, level: true, group: true }
    })

    if (!student || student.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
    }

    // Determine recipient: guardian (minors) or student (adults)
    const recipientEmail = student.guardianEmail || student.email

    if (!recipientEmail) {
      return NextResponse.json({ 
        error: 'No hay email configurado. Agregue email del apoderado o del estudiante.' 
      }, { status: 400 })
    }

    // Check SMTP config
    const inst = student.institution
    if (!inst.smtpHost || !inst.smtpUser || !inst.smtpPassword) {
      return NextResponse.json({ error: 'Configuración SMTP incompleta' }, { status: 400 })
    }

    // Build credential message
    const credentialUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://school-assist-lfo2.vercel.app'}/admin/credentials?code=${student.code}`
    const subject = `Credencial Escolar - ${student.name}`
    const levelName = student.level ? student.level.name : ''
    const groupName = student.group ? student.group.name : ''
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${inst.brandColor || '#3b82f6'}">Credencial Escolar</h2>
        <p>Estimado/a ${student.guardianName || student.name},</p>
        <p>Adjunto los datos de la credencial escolar de <strong>${student.name}</strong>:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Código:</strong> ${student.code}</p>
          <p><strong>Nombre:</strong> ${student.name}</p>
          ${levelName ? `<p><strong>Nivel:</strong> ${levelName}</p>` : ''}
          ${groupName ? `<p><strong>Grupo:</strong> ${groupName}</p>` : ''}
        </div>
        <p>Puede ver/descargar la credencial con foto aquí: <a href="${credentialUrl}">${credentialUrl}</a></p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #6b7280;">Instituto: ${inst.name}</p>
      </div>
    `

    // Send email
    const sent = await sendEmailNotification(recipientEmail, subject, html, {
      host: inst.smtpHost,
      port: inst.smtpPort || 587,
      user: inst.smtpUser,
      password: inst.smtpPassword,
      from: inst.smtpFrom || inst.smtpUser
    })

    if (!sent) {
      return NextResponse.json({ error: 'Error al enviar email' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Credencial enviada por email',
      to: recipientEmail 
    })
  } catch (error) {
    console.error('Credential email error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}