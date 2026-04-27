import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// PUT - Update institution (full or partial)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { 
      name, slug, email, phone, address, logo,
      brandColor, secondaryColor, accentColor,
      educationLevel, active, 
      telegramToken, telegramChatId, callmebotKey, callmebotKeyParents,
      directorWhatsappPhone, smtpHost, smtpPort, smtpUser, smtpPassword, smtpFrom,
      timezone, defaultTheme, graceMinutes
    } = body

    // Update institution
    const institution = await db.institution.update({
      where: { id },
      data: {
        name,
        slug,
        email,
        phone,
        address,
        logo,
        brandColor,
        secondaryColor,
        accentColor,
        educationLevel,
        active,
        telegramToken,
        telegramChatId,
        callmebotKey,
        callmebotKeyParents,
        directorWhatsappPhone,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpFrom,
        timezone,
        defaultTheme,
        graceMinutes
      }
    })

    // Cascade: if active changed to false, deactivate all staff and students
    if (active === false) {
      await db.staff.updateMany({
        where: { institutionId: id },
        data: { active: false }
      })
      await db.student.updateMany({
        where: { institutionId: id },
        data: { active: false }
      })
    }

    return NextResponse.json({ 
      success: true,
      institution
    })
  } catch (error) {
    console.error('Update institution error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

// DELETE - Delete institution (full cascade delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete cascade: all related data will be deleted via ON DELETE CASCADE in Prisma schema
    await db.institution.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete institution error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
