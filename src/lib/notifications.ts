// Telegram/CallMeBot notification utility
const CALLMEBOT_API = 'https://api.callmebot.com'

export async function sendTelegramNotification(chatId: string, message: string, botToken?: string): Promise<boolean> {
  if (!botToken || !chatId) return false

  try {
    const response = await fetch(`${CALLMEBOT_API}/text.php?user=${chatId}&text=${encodeURIComponent(message)}&token=${botToken}`, {
      method: 'GET'
    })
    return response.ok
  } catch (error) {
    console.error('Telegram notification error:', error)
    return false
  }
}

export async function sendWhatsAppNotification(phone: string, message: string, apiKey?: string): Promise<boolean> {
  if (!apiKey || !phone) return false

  try {
    // CallMeBot WhatsApp format
    const response = await fetch(`${CALLMEBOT_API}/whatsapp.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phone.replace('+', ''),
        text: message,
        authorize: apiKey
      })
    })
    return response.ok
  } catch (error) {
    console.error('WhatsApp notification error:', error)
    return false
  }
}

import nodemailer from 'nodemailer'

export async function sendEmailNotification(to: string, subject: string, text: string, smtpConfig?: {
  host: string
  port: number
  user: string
  password: string
  from?: string
}): Promise<boolean> {
  if (!smtpConfig?.host || !to) return false

  try {
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: false,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password
      }
    })

    await transporter.sendMail({
      from: smtpConfig.from || smtpConfig.user,
      to,
      subject,
      text
    })
    return true
  } catch (error) {
    console.error('Email notification error:', error)
    return false
  }
}

export function buildAttendanceMessage(data: {
  studentName: string
  type: 'in' | 'out'
  time: string
  schoolName: string
}): string {
  const action = data.type === 'in' ? 'ha INGRESADO' : 'ha SALIDO'
  return `🚸 ALERTA: ${data.studentName} ${action} a las ${data.time} en ${data.schoolName}`
}

export function buildSummaryMessage(data: {
  schoolName: string
  date: string
  total: number
  present: number
  absent: number
  late: number
}): string {
  return `📊 Resumen ${data.schoolName} - ${data.date}
✅ Asistieron: ${data.present}
❌ Faltaron: ${data.absent}
⏰ Tarde: ${data.late}

Total registrado: ${data.total}`
}
