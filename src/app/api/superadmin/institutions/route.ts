import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdminAuthenticated } from '@/lib/superadmin-auth'

// GET - List all institutions (for Super Admin)
export async function GET(request: NextRequest) {
  // Verify super admin auth
  if (!isSuperAdminAuthenticated(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

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
    console.error('SuperAdmin institutions error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
