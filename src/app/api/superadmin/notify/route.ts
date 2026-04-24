import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/notifications'
import { isSuperAdminAuthenticated } from '@/lib/superadmin-auth'

// POST - Send notification to institute director
export async function POST(request: NextRequest) {
  // Verify super admin auth
  if (!isSuperAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { institutionId, type, message } = body

    if (!institutionId || !message) {
      return NextResponse.json({ error: 'institutionId y message requeridos' }, { status: 400 })
    }

    // Get institution
    const institution = await db.institution.findUnique({
      where: { id: institutionId }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Instituto no encontrado' }, { status: 404 })
    }

    // Get director(s)
    const directors = await db.staff.findMany({
      where: { institutionId, role: 'director', active: true }
    })

    // Get Super Admin telegram config
    const adminToken = process.env.SUPERADMIN_TELEGRAM_TOKEN
    const adminChatId = process.env.SUPERADMIN_TELEGRAM_CHAT_ID

    if (!adminToken || !adminChatId) {
      return NextResponse.json({ error: 'Configuración de Super Admin no disponible' }, { status: 500 })
    }

    // Send notification to Super Admin
    let sent = false

    if (type === 'payment_reminder') {
      const msg = `💰 RECORDATORIO DE PAGO\n\nInstituto: ${institution.name}\n\n${message}`
      sent = await sendTelegramNotification(adminChatId, msg, adminToken)
    } else if (type === 'cutoff_alert') {
      const msg = `⚠️ ALERTA DE CORTE\n\nInstituto: ${institution.name}\n\n${message}`
      sent = await sendTelegramNotification(adminChatId, msg, adminToken)
    } else {
      const msg = `📢 NOTIFICACIÓN\n\nInstituto: ${institution.name}\n\n${message}`
      sent = await sendTelegramNotification(adminChatId, msg, adminToken)
    }

    return NextResponse.json({ success: sent })
  } catch (error) {
    console.error('Super admin notification error:', error)
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}
