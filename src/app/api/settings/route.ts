import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const institution = await db.institution.findUnique({
      where: { id: institutionId },
      include: { settings: true }
    })

    if (!institution) return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 })

    return NextResponse.json({
      institution: {
        id: institution.id,
        name: institution.name,
        logo: institution.logo,
        brandColor: institution.brandColor,
        secondaryColor: institution.secondaryColor,
        accentColor: institution.accentColor,
        address: institution.address,
        email: institution.email,
        phone: institution.phone,
        slogan: institution.slogan,
        educationLevel: institution.educationLevel,
        timezone: institution.timezone,
        defaultTheme: institution.defaultTheme,
        graceMinutes: institution.graceMinutes,
        telegramToken: institution.telegramToken || '',
        telegramChatId: institution.telegramChatId || '',
        smtpHost: institution.smtpHost || '',
        smtpPort: institution.smtpPort,
        smtpUser: institution.smtpUser || '',
        callmebotKey: institution.callmebotKey || ''
      },
      settings: institution.settings
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const institutionId = request.headers.get('x-institution-id')
    if (!institutionId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const body = await request.json()
    const {
      name, logo, brandColor, secondaryColor, accentColor,
      address, email, phone, slogan, educationLevel, timezone, defaultTheme,
      graceMinutes, telegramToken, telegramChatId, smtpHost, smtpPort, smtpUser,
      smtpPassword, smtpFrom, callmebotKey, callmebotKeyParents
    } = body

    // Only include non-undefined fields
    const data: any = {}
    if (name !== undefined) data.name = name
    if (logo !== undefined) data.logo = logo
    if (brandColor !== undefined) data.brandColor = brandColor
    if (secondaryColor !== undefined) data.secondaryColor = secondaryColor
    if (accentColor !== undefined) data.accentColor = accentColor
    if (address !== undefined) data.address = address
    if (email !== undefined) data.email = email
    if (phone !== undefined) data.phone = phone
    if (slogan !== undefined) data.slogan = slogan
    if (educationLevel !== undefined) data.educationLevel = educationLevel
    if (timezone !== undefined) data.timezone = timezone
    if (defaultTheme !== undefined) data.defaultTheme = defaultTheme
    if (graceMinutes !== undefined) data.graceMinutes = graceMinutes
    if (telegramToken !== undefined) data.telegramToken = telegramToken || null
    if (telegramChatId !== undefined) data.telegramChatId = telegramChatId || null
    if (smtpHost !== undefined) data.smtpHost = smtpHost || null
    if (smtpPort !== undefined) data.smtpPort = smtpPort || null
    if (smtpUser !== undefined) data.smtpUser = smtpUser || null
    if (smtpPassword !== undefined) data.smtpPassword = smtpPassword || null
    if (smtpFrom !== undefined) data.smtpFrom = smtpFrom || null
    if (callmebotKey !== undefined) data.callmebotKey = callmebotKey || null
    if (callmebotKeyParents !== undefined) data.callmebotKeyParents = callmebotKeyParents || null

    const institution = await db.institution.update({ where: { id: institutionId }, data })
    return NextResponse.json({ success: true, institution })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
