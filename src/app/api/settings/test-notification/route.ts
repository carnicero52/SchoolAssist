import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification, sendWhatsAppNotification, sendEmailNotification } from '@/lib/notifications'

// POST - Test notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, type, token, chatId, phone, recipient, subject, message } = body

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    const institution = await db.institution.findUnique({
      where: { id: institutionId }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Instituto no encontrado' }, { status: 404 })
    }

    let sent = false

    if (type === 'telegram' && token && chatId) {
      sent = await sendTelegramNotification(chatId, '✅ Test de Telegram desde SchoolAssist', token)
    } else if (type === 'whatsapp' && phone) {
      const key = institution.callmebotKeyParents || institution.callmebotKey
      if (!key) {
        return NextResponse.json({ error: 'CallMeBot Key no configurada' }, { status: 400 })
      }
      sent = await sendWhatsAppNotification(phone, '✅ Test de WhatsApp desde SchoolAssist', key)
    } else if (type === 'email' && recipient && subject && message) {
      if (!institution.smtpHost || !institution.smtpUser || !institution.smtpPassword) {
        return NextResponse.json({ error: 'SMTP no configurado' }, { status: 400 })
      }
      sent = await sendEmailNotification(recipient, subject, message, {
        host: institution.smtpHost,
        port: institution.smtpPort || 587,
        user: institution.smtpUser,
        password: institution.smtpPassword,
        from: institution.smtpFrom || institution.smtpUser
      })
    }

    return NextResponse.json({ success: sent, sent })
  } catch (error) {
    console.error('Test notification error:', error)
    return NextResponse.json({ error: 'Error al enviar test' }, { status: 500 })
  }
}
