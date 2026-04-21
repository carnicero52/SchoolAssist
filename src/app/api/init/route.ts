import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// POST - Create initial Super Admin (only works if no users exist)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, secret } = body

    // Verify secret
    if (secret !== process.env.SUPERADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    // Check if any users exist
    const userCount = await db.staff.count()
    if (userCount > 0) {
      return NextResponse.json({ error: 'Users already exist' }, { status: 400 })
    }

    // Check if any institutions exist
    const institutionCount = await db.institution.count()
    
    // Create default institution if none exists
    let institutionId
    if (institutionCount === 0) {
      const institution = await db.institution.create({
        data: {
          name: 'Mi Instituto',
          slug: 'mi-instituto',
          brandColor: '#3b82f6'
        }
      })
      institutionId = institution.id
    } else {
      const institution = await db.institution.findFirst()
      institutionId = institution!.id
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    const admin = await db.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'director',
        institutionId
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: { email: admin.email, role: admin.role }
    })
  } catch (error) {
    console.error('Init error:', error)
    return NextResponse.json({ error: 'Error al inicializar' }, { status: 500 })
  }
}