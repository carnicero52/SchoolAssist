import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all institutions (for Super Admin)
export async function GET(request: Request) {
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
}