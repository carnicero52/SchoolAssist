import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppNotification } from '@/lib/notifications'

// POST /api/daily-summary - Send daily attendance summary to director via WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { institutionId, date } = body

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    // Get institution
    const institution = await db.institution.findUnique({
      where: { id: institutionId }
    })

    if (!institution) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 })
    }

    // Check director WhatsApp
    const directorPhone = institution.directorWhatsappPhone
    if (!directorPhone) {
      return NextResponse.json({ error: 'No hay WhatsApp del director configurado en Ajustes' }, { status: 400 })
    }

    // Determine date (today if not provided)
    const targetDate = date || new Date().toISOString().split('T')[0]

    // Get stats
    const [total, present, absent, late] = await Promise.all([
      db.attendance.count({ where: { institutionId, date: targetDate } }),
      db.attendance.count({ where: { institutionId, date: targetDate, status: 'on_time' } }),
      db.attendance.count({ where: { institutionId, date: targetDate, status: 'absent' } }),
      db.attendance.count({ where: { institutionId, date: targetDate, status: 'late' } })
    ])

    // Build message
    const message = `📊 *Resumen Diario - ${institution.name}*\n` +
      `📅 Fecha: ${targetDate}\n` +
      `📋 Total registrados: ${total}\n` +
      `✅ Presentes: ${present}\n` +
      `❌ Faltas: ${absent}\n` +
      `⏰ Tarde: ${late}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `SchoolAssist ✅`

    // Send via WhatsApp using callmebotKey (fallback to parents key)
    const apiKey = institution.callmebotKey || institution.callmebotKeyParents
    if (!apiKey) {
      return NextResponse.json({ error: 'CallMeBot API Key no configurada' }, { status: 400 })
    }

    const sent = await sendWhatsAppNotification(directorPhone, message, apiKey)

    if (!sent) {
      return NextResponse.json({ error: 'Error al enviar WhatsApp' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Resumen enviado por WhatsApp',
      stats: { total, present, absent, late, date: targetDate }
    })
  } catch (error) {
    console.error('Daily summary error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// GET - Get daily summary data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    const [total, present, absent, late] = await Promise.all([
      db.attendance.count({ where: { institutionId, date } }),
      db.attendance.count({ where: { institutionId, date, status: 'on_time' } }),
      db.attendance.count({ where: { institutionId, date, status: 'absent' } }),
      db.attendance.count({ where: { institutionId, date, status: 'late' } })
    ])

    return NextResponse.json({ date, total, present, absent, late })
  } catch (error) {
    console.error('Get daily summary error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}