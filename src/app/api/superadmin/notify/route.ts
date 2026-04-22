import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, type, message } = body

    if (!institutionId || !message) return NextResponse.json({ error: 'institutionId y message requeridos' }, { status: 400 })

    const institution = await db.institution.findUnique({ where: { id: institutionId } })
    if (!institution) return NextResponse.json({ error: 'Instituto no encontrado' }, { status: 404 })

    const adminToken = process.env.SUPERADMIN_TELEGRAM_TOKEN
    const adminChatId = process.env.SUPERADMIN_TELEGRAM_CHAT_ID

    if (!adminToken || !adminChatId) {
      return NextResponse.json({ error: 'Configuración de Super Admin no disponible' }, { status: 500 })
    }

    let msg = ''
    if (type === 'payment_reminder') msg = `RECORDATORIO DE PAGO\n\nInstituto: ${institution.name}\n\n${message}`
    else if (type === 'cutoff_alert') msg = `ALERTA DE CORTE\n\nInstituto: ${institution.name}\n\n${message}`
    else msg = `NOTIFICACION\n\nInstituto: ${institution.name}\n\n${message}`

    const sent = await sendTelegramNotification(adminChatId, msg, adminToken)
    return NextResponse.json({ success: sent })
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}
