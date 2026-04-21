import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification, sendWhatsAppNotification, sendEmailNotification } from '@/lib/notifications'

// POST - Send manual notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, type, channel, recipient, subject, message } = body

    if (!institutionId || !type || !message) {
      return NextResponse.json({ error: 'institutionId, type y message requeridos' }, { status: 400 })
    }

    // Get institution config
    const institution = await db.institution.findUnique({
      where: { id: institutionId }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Instituto no encontrado' }, { status: 404 })
    }

    let sent = false

    // Send based on channel
    if (channel === 'telegram' && recipient && institution.telegramToken) {
      sent = await sendTelegramNotification(recipient, message, institution.telegramToken)
    } else if (channel === 'whatsapp' && recipient && institution.callmebotKey) {
      sent = await sendWhatsAppNotification(recipient, message, institution.callmebotKey)
    } else if (channel === 'email' && recipient && institution.smtpHost) {
      sent = await sendEmailNotification(recipient, subject || 'Notificación', message, {
        host: institution.smtpHost,
        port: institution.smtpPort || 587,
        user: institution.smtpUser || '',
        password: institution.smtpPassword || '',
        from: institution.smtpFrom || undefined
      })
    } else if (!channel) {
      // Broadcast - send to all with notifications enabled
      if (institution.telegramToken || institution.callmebotKey) {
        const students = await db.student.findMany({
          where: { 
            institutionId,
            OR: [
              { telegramChatId: { not: null } },
              { whatsappPhone: { not: null } }
            ]
          }
        })

        for (const student of students) {
          if (student.telegramChatId && institution.telegramToken) {
            await sendTelegramNotification(student.telegramChatId, message, institution.telegramToken)
          }
          if (student.whatsappPhone && institution.callmebotKey) {
            await sendWhatsAppNotification(student.whatsappPhone, message, institution.callmebotKey)
          }
        }
        sent = true
      }
    }

    // Log notification
    await db.notification.create({
      data: {
        institutionId,
        type: 'manual',
        channel: channel || 'broadcast',
        recipient: recipient || 'all',
        subject,
        message,
        status: sent ? 'sent' : 'failed',
        sentAt: sent ? new Date() : null
      }
    })

    return NextResponse.json({ success: true, sent })
  } catch (error) {
    console.error('Notification error:', error)
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}

// GET - Get notification history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId')

  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
  }

  const notifications = await db.notification.findMany({
    where: { institutionId },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return NextResponse.json({ notifications })
}