import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const { searchParams } = new URL(request.url)
    const levelId = searchParams.get('levelId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!institutionId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
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
        gender: s.gender,
        email: s.email,
        phone: s.phone,
        guardianName: s.guardianName,
        guardianPhone: s.guardianPhone,
        guardianEmail: s.guardianEmail,
        level: s.level?.name,
        levelId: s.levelId,
        group: s.group?.name,
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

export async function POST(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const body = await request.json()
    const {
      name, cedula, birthDate, photo, gender,
      email, phone, guardianName, guardianPhone, guardianEmail,
      telegramChatId, whatsappPhone, levelId, groupId
    } = body

    if (!institutionId || !name) {
      return NextResponse.json({ error: 'institutionId y name requeridos' }, { status: 400 })
    }

    const code = `EST-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`

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
          create: { code, active: true }
        }
      }
    })

    return NextResponse.json({ success: true, student: { ...student, code } })
  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: 'Error al crear estudiante' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id || !institutionId) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 })
    }

    const student = await db.student.findUnique({ where: { id } })
    if (!student || student.institutionId !== institutionId) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
    }

    await db.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete student error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
