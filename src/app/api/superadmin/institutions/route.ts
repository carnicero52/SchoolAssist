import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// GET - List all institutions (for Super Admin)
export async function GET(request: Request) {
  const institutions = await db.institution.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      logo: true,
      brandColor: true,
      secondaryColor: true,
      accentColor: true,
      email: true,
      phone: true,
      address: true,
      educationLevel: true,
      active: true,
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
      logo: i.logo,
      brandColor: i.brandColor,
      secondaryColor: i.secondaryColor,
      accentColor: i.accentColor,
      email: i.email,
      phone: i.phone,
      address: i.address,
      educationLevel: i.educationLevel,
      active: i.active,
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

// POST - Create new institution with default admin user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, email, phone, address, logo, brandColor, secondaryColor, accentColor, educationLevel } = body

    if (!name || !slug || !email) {
      return NextResponse.json({ error: 'name, slug y email requeridos' }, { status: 400 })
    }

    // Check slug unique
    const existing = await db.institution.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
    }

    // Generate random password for admin
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Create institution + admin staff in a transaction
    const institution = await db.institution.create({
      data: {
        name,
        slug,
        email,
        phone,
        address,
        logo,
        brandColor: brandColor || '#3b82f6',
        secondaryColor: secondaryColor || '#64748b',
        accentColor: accentColor || '#22c55e',
        educationLevel,
        active: true,
        graceMinutes: 15,
        timezone: 'America/Caracas',
        defaultTheme: 'system'
      }
    })

    // Create default admin user for this institution
    const adminEmail = `admin@${slug}.com`
    await db.staff.create({
      data: {
        institutionId: institution.id,
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: phone || ''
      }
    })

    return NextResponse.json({ 
      success: true, 
      institution,
      adminCredentials: {
        email: adminEmail,
        password: tempPassword
      }
    })
  } catch (error) {
    console.error('Create institution error:', error)
    return NextResponse.json({ error: 'Error al crear instituto' }, { status: 500 })
  }
}