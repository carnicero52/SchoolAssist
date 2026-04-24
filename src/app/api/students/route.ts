import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

// GET - List students
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const levelId = searchParams.get('levelId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    const where: any = { institutionId }

    if (levelId) where.levelId = levelId
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { cedula: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [students, total] = await Promise.all([
      db.student.findMany({
        where,
        include: { level: true, group: true },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.student.count({ where })
    ])

    return NextResponse.json({
      students: students.map(s => ({
        id: s.id,
        code: s.code,
        name: s.name,
        cedula: s.cedula,
        photo: s.photo,
        email: s.email,
        phone: s.phone,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianEmail: s.guardianEmail,
        telegramChatId: s.telegramChatId,
        whatsappPhone: s.whatsappPhone,
        level: s.level?.name,
        group: s.group?.name,
        levelId: s.levelId,
        groupId: s.groupId,
        totalAttendances: s.totalAttendances,
        totalAbsences: s.totalAbsences,
        totalLates: s.totalLates,
        active: s.active
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// POST - Create student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      institutionId, name, cedula, birthDate, photo, gender,
      email, phone, guardianName, guardianPhone, guardianEmail,
      telegramChatId, whatsappPhone, levelId, groupId
    } = body

    if (!institutionId || !name) {
      return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })
    }

    // Generate unique code
    const code = `EST-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`

    // Create student with QR code
    const student = await db.student.create({
      data: {
        institutionId,
        code,
        name,
        cedula,
        birthDate: birthDate ? new Date(birthDate) : null,
        photo,
        gender,
        email,
        phone,
        guardianName,
        guardianPhone,
        guardianEmail,
        telegramChatId,
        whatsappPhone,
        levelId,
        groupId,
        qrCode: {
          create: {
            code: code,
            active: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      student: { ...student, code }
    })
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: 'Error al crear estudiante' }, { status: 500 })
  }
}

// PUT - Update student
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    const body = await request.json()
    const {
      name, cedula, birthDate, photo, gender,
      email, phone, guardianName, guardianPhone, guardianEmail,
      telegramChatId, whatsappPhone, levelId, groupId
    } = body

    const student = await db.student.update({
      where: { id },
      data: {
        name,
        cedula,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        photo,
        gender,
        email,
        phone,
        guardianName,
        guardianPhone,
        guardianEmail,
        telegramChatId,
        whatsappPhone,
        levelId,
        groupId
      }
    })

    return NextResponse.json({ success: true, student })
  } catch (error) {
    console.error('Update student error:', error)
    return NextResponse.json({ error: 'Error al actualizar estudiante' }, { status: 500 })
  }
}

// DELETE - Delete student
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    // Delete QR code first (if exists)
    await db.qRCode.deleteMany({ where: { studentId: id } })

    // Delete attendance records
    await db.attendance.deleteMany({ where: { studentId: id } })

    // Delete student
    await db.student.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json({ error: 'Error al eliminar estudiante' }, { status: 500 })
  }
}
