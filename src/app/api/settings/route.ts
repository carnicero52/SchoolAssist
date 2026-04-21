import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET - Get institution settings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const institutionId = searchParams.get('institutionId')

  if (!institutionId) {
    return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
  }

  const institution = await db.institution.findUnique({
    where: { id: institutionId },
    include: { settings: true }
  })

  return NextResponse.json({
    institution: {
      id: institution?.id,
      name: institution?.name,
      logo: institution?.logo,
      brandColor: institution?.brandColor,
      secondaryColor: institution?.secondaryColor,
      accentColor: institution?.accentColor,
      address: institution?.address,
      email: institution?.email,
      phone: institution?.phone,
      slogan: institution?.slogan,
      educationLevel: institution?.educationLevel,
      timezone: institution?.timezone,
      defaultTheme: institution?.defaultTheme,
      graceMinutes: institution?.graceMinutes,
      telegramToken: !!institution?.telegramToken,
      telegramChatId: !!institution?.telegramChatId,
      smtpHost: !!institution?.smtpHost,
      callmebotKey: !!institution?.callmebotKey
    },
    settings: institution?.settings
  })
}

// PUT - Update institution settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      institutionId, name, logo, brandColor, secondaryColor, accentColor,
      address, email, phone, slogan, educationLevel, timezone, defaultTheme,
      graceMinutes, telegramToken, telegramChatId, smtpHost, smtpPort, smtpUser, 
      smtpPassword, smtpFrom, callmebotKey, callmebotKeyParents
    } = body

    if (!institutionId) {
      return NextResponse.json({ error: 'institutionId requerido' }, { status: 400 })
    }

    const institution = await db.institution.update({
      where: { id: institutionId },
      data: {
        name,
        logo,
        brandColor,
        secondaryColor,
        accentColor,
        address,
        email,
        phone,
        slogan,
        educationLevel,
        timezone,
        defaultTheme,
        graceMinutes,
        telegramToken,
        telegramChatId,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpFrom,
        callmebotKey,
        callmebotKeyParents
      }
    })

    return NextResponse.json({ success: true, institution })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}