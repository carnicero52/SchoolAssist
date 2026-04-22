import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification, sendWhatsAppNotification, sendEmailNotification } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const { qrCode, type = 'in', scanPointId, location } = body

    if (!qrCode || !institutionId) {
      return NextResponse.json({ error: 'QR code e institutionId requeridos' }, { status: 400 })
    }

    const qr = await db.qRCode.findUnique({
      where: { code: qrCode },
      include: { student: { include: { institution: true, level: true, group: true } } }
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

    const existingToday = await db.attendance.findFirst({
      where: { studentId: student.id, type, date: today }
    })

    if (existingToday) {
      return NextResponse.json({
        error: `Ya se registró ${type === 'in' ? 'entrada' : 'salida'} hoy`,
        code: 'ALREADY_SCANNED'
      }, { status: 400 })
    }

    // Determine if late based on shift times
    const shifts = await db.shift.findMany({
      where: { institutionId, active: true }
    })

    let status = 'on_time'
    let shiftId: string | null = null

    if (type === 'in' && shifts.length > 0) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      for (const shift of shifts) {
        const [sh, sm] = shift.startTime.split(':').map(Number)
        const [eh, em] = shift.endTime.split(':').map(Number)
        const shiftStartMinutes = sh * 60 + sm
        const shiftEndMinutes = eh * 60 + em

        if (currentMinutes >= shiftStartMinutes && currentMinutes <= shiftEndMinutes) {
          shiftId = shift.id
          const deadlineMinutes = shiftStartMinutes + shift.graceMinutes
          if (currentMinutes > deadlineMinutes) {
            status = 'late'
          }
          break
        }
      }

      // If no shift matched current time, use first shift
      if (!shiftId && shifts.length > 0) {
        shiftId = shifts[0].id
        const [sh, sm] = shifts[0].startTime.split(':').map(Number)
        const deadlineMinutes = sh * 60 + sm + shifts[0].graceMinutes
        if (currentMinutes > deadlineMinutes) {
          status = 'late'
        }
      }
    } else if (shifts.length > 0) {
      shiftId = shifts[0].id
    }

    const attendance = await db.attendance.create({
      data: {
        studentId: student.id,
        institutionId,
        type,
        status,
        scanTime: now,
        date: today,
        shiftId,
        scanPointId,
        location
      }
    })

    // Update student stats
    if (type === 'in') {
      await db.student.update({
        where: { id: student.id },
        data: {
          totalAttendances: { increment: 1 },
          ...(status === 'late' ? { totalLates: { increment: 1 } } : {})
        }
      })
    }

    // Send notifications
    const timeStr = now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })

    if (student.guardianPhone || student.guardianEmail || student.telegramChatId) {
      const message = type === 'in'
        ? `${student.name} ha INGRESADO a las ${timeStr} en ${student.institution.name}`
        : `${student.name} ha SALIDO a las ${timeStr} en ${student.institution.name}`

      if (student.telegramChatId && student.institution.telegramToken) {
        await sendTelegramNotification(student.telegramChatId, message, student.institution.telegramToken)
      }
      if (student.whatsappPhone && student.institution.callmebotKey) {
        await sendWhatsAppNotification(student.whatsappPhone, message, student.institution.callmebotKey)
      }
      if (student.guardianEmail && student.institution.smtpHost) {
        await sendEmailNotification(
          student.guardianEmail,
          type === 'in' ? 'Entrada registrada' : 'Salida registrada',
          message,
          {
            host: student.institution.smtpHost,
            port: student.institution.smtpPort || 587,
            user: student.institution.smtpUser || '',
            password: student.institution.smtpPassword || '',
            from: student.institution.smtpFrom || undefined
          }
        )
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
