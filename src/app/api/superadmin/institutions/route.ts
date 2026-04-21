import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'crypto'

// GET - List all institutions (for Super Admin)
export async function GET(request: Request) {
  try {
    const institutions = await db.institution.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        active: true,
        educationLevel: true,
        createdAt: true,
        _count: { select: { students: true, admins: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalStudents = institutions.reduce((sum, i) => sum + i._count.students, 0)
    const totalStaff = institutions.reduce((sum, i) => sum + i._count.admins, 0)

    return NextResponse.json({
      institutions: institutions.map(i => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        email: i.email,
        phone: i.phone,
        active: i.active,
        educationLevel: i.educationLevel,
        students: i._count.students,
        staff: i._count.admins,
        createdAt: i.createdAt.toISOString()
      })),
      stats: {
        totalInstitutions: institutions.length,
        activeInstitutions: institutions.filter(i => i.active).length,
        totalStudents,
        totalStaff
      }
    })
  } catch (error) {
    console.error('Super admin error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// PUT - Toggle institution active status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { active } = await request.json()

    const institution = await db.institution.update({
      where: { id },
      data: { active }
    })

    return NextResponse.json({ 
      success: true,
      institution: { id: institution.id, active: institution.active }
    })
  } catch (error) {
    console.error('Error toggling:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}