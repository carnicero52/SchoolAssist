import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification, sendWhatsAppNotification, sendEmailNotification } from '@/lib/notifications'

// POST - Register attendance via QR scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { qrCode, type = 'in', institutionId, scanPointId, staffId, location } = body

    if (!qrCode || !institutionId) {
      return NextResponse.json({ error: 'QR code e institutionId requeridos' }, { status: 400 })
    }

    // Find student by QR code
    const qr = await db.qRCode.findUnique({
      where: { code: qrCode },
      include: { 
        student: { 
          include: { institution: true, level: true, group: true }
        } 
      }
    })

    if (!qr || !qr.active) {
      return NextResponse.json({ error: 'Código QR inválido' }, { status: 400 })
    }

    if (qr.student.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Estudiante no pertenece a este instituto' }, { status: 400 })
    }

    const student = qr.student
    const now = new Date()
    const today = now.toISOString().split('T')[0]

    // Check if already scanned today (for this type)
    const existingToday = await db.attendance.findFirst({
      where: {
        studentId: student.id,
        type,
        date: today
      }
    })

    if (existingToday) {
      return NextResponse.json({ 
        error: `Ya se registró ${type === 'in' ? 'entrada' : 'salida'} hoy`,
        code: 'ALREADY_SCANNED'
      }, { status: 400 })
    }

    // Get shift and determine if late
    const shifts = await db.shift.findMany({
      where: { institutionId }
    })
    
    let status = 'on_time'
    let shiftId = null
    
    // Simple logic - can be improved
    for (const shift of shifts) {
      const shiftStart = parseInt(shift.startTime.split(':')[0])
      const currentHour = now.getHours()
      
      if (currentHour > shiftStart + (shift.graceMinutes / 60)) {
        status = 'late'
      }
      shiftId = shift.id
      break
    }

    // Create attendance record
    const attendance = await db.attendance.create({
      data: {
        studentId: student.id,
        institutionId,
        type,
        status,
        scanTime: now,
        date: today,
        scanPointId,
        location
      }
    })

    // Update student stats
    if (status === 'late') {
      await db.student.update({
        where: { id: student.id },
        data: { totalLates: { increment: 1 } }
      })
    }

    // Send notifications to guardians
    const notifyEnabled = student.institution.callmebotKey || student.institution.telegramToken
    
    if (notifyEnabled && (student.guardianPhone || student.guardianEmail || student.telegramChatId)) {
      const message = type === 'in' 
        ? `🚸 ALERTA: ${student.name} ha INGRESADO a las ${now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}`
        : `🚸 ALERTA: ${student.name} ha SALIDO a las ${now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}`

      // Send to guardian
      if (student.telegramChatId && student.institution.telegramToken) {
        await sendTelegramNotification(student.telegramChatId, message, student.institution.telegramToken)
      }
      
      if (student.whatsappPhone && student.institution.callmebotKey) {
        await sendWhatsAppNotification(student.whatsappPhone, message, student.institution.callmebotKey)
      }
      
      if (student.guardianEmail && student.institution.smtpHost) {
        await sendEmailNotification(student.guardianEmail, type === 'in' ? 'Entrada registrada' : 'Salida registrada', message)
      }
    }

    return NextResponse.json({
      success: true,
      attendance: {
        id: attendance.id,
        type: attendance.type,
        status: attendance.status,
        time: attendance.scanTime,
        student: {
          id: student.id,
          name: student.name,
          photo: student.photo,
          level: student.level?.name,
          group: student.group?.name
        }
      }
    })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 })
  }
}