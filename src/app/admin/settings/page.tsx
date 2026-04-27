'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Palette, Bell, Clock, Mail, MessageSquare, Phone } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    institutionId: '',
    name: '', logo: '', brandColor: '#3b82f6',
    secondaryColor: '#64748b', accentColor: '#22c55e',
    email: '', phone: '', address: '', slogan: '', educationLevel: '',
    telegramToken: '', telegramChatId: '',
    callmebotKey: '',
    callmebotKeyParents: '',
    directorWhatsappPhone: '',
    smtpHost: '', smtpUser: '', smtpPassword: '', smtpPort: '587', smtpFrom: '',
    timezone: 'America/Caracas', defaultTheme: 'dark', graceMinutes: '15'
  })

  useEffect(() => { loadConfig() }, [])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.institution) {
        setConfig({
          institutionId: data.institution.id,
          name: data.institution.name || '',
          logo: data.institution.logo || '',
          brandColor: data.institution.brandColor || '#3b82f6',
          secondaryColor: data.institution.secondaryColor || '#64748b',
          accentColor: data.institution.accentColor || '#22c55e',
          email: data.institution.email || '',
          phone: data.institution.phone || '',
          address: data.institution.address || '',
          slogan: data.institution.slogan || '',
          educationLevel: data.institution.educationLevel || '',
          telegramToken: data.institution.telegramToken || '',
          telegramChatId: data.institution.telegramChatId || '',
          callmebotKey: data.institution.callmebotKey || '',
          callmebotKeyParents: data.institution.callmebotKeyParents || '',
          directorWhatsappPhone: data.institution.directorWhatsappPhone || '',
          smtpHost: data.institution.smtpHost || '',
          smtpUser: data.institution.smtpUser || '',
          smtpPassword: data.institution.smtpPassword || '',
          smtpPort: String(data.institution.smtpPort || '587'),
          smtpFrom: data.institution.smtpFrom || '',
          timezone: data.institution.timezone || 'America/Caracas',
          defaultTheme: data.institution.defaultTheme || 'dark',
          graceMinutes: String(data.institution.graceMinutes || '15')
        })
      }
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const body = {
        institutionId: config.institutionId,
        name: config.name,
        logo: config.logo,
        brandColor: config.brandColor,
        secondaryColor: config.secondaryColor,
        accentColor: config.accentColor,
        address: config.address,
        email: config.email,
        phone: config.phone,
        slogan: config.slogan,
        educationLevel: config.educationLevel,
        timezone: config.timezone,
        defaultTheme: config.defaultTheme,
        graceMinutes: parseInt(config.graceMinutes) || 15,
        telegramToken: config.telegramToken,
        telegramChatId: config.telegramChatId,
        smtpHost: config.smtpHost,
        smtpPort: parseInt(config.smtpPort) || 587,
        smtpUser: config.smtpUser,
        smtpFrom: config.smtpFrom,
        callmebotKey: config.callmebotKey,
        callmebotKeyParents: config.callmebotKeyParents,
        directorWhatsappPhone: config.directorWhatsappPhone,
        smtpPassword: (config.smtpPassword && config.smtpPassword.trim() !== '') ? config.smtpPassword : undefined
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        alert('Error: ' + (data.error || 'No se pudo guardar'))
      }
    } catch (e) {
      console.error(e)
      alert('Error de red')
    } finally {
      setSaving(false)
    }
  }

  const testTelegram = async () => {
    if (!config.telegramToken || !config.telegramChatId) return alert('Complete token y chat ID')
    try {
      await fetch('/api/settings/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'telegram', token: config.telegramToken, chatId: config.telegramChatId })
      })
      alert('✅ Telegram enviado')
    } catch (e) {
      alert('❌ Error')
    }
  }

  const testWA = async (parent: boolean) => {
    const key = parent ? config.callmebotKeyParents : config.callmebotKey
    const phone = parent ? '' : config.directorWhatsappPhone
    if (!key) return alert('CallMeBot Key faltante')
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=Test+OK&apikey=${key}`
      await fetch(url)
      alert('✅ WhatsApp enviado')
    } catch (e) {
      alert('❌ Error')
    }
  }

  const testEmail = async () => {
    // TODO
    alert('Email test')
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Configuración</h1>
          <Button onClick={saveConfig} disabled={saving} className="bg-green-500">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar'}
          </Button>
        </div>

        {/* Información del Instituto */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Información del Instituto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Nombre</label>
                <Input
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <Input
                  type="email"
                  value={config.email}
                  onChange={(e) => setConfig({...config, email: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Teléfono</label>
                <Input
                  value={config.phone}
                  onChange={(e) => setConfig({...config, phone: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Dirección</label>
                <Input
                  value={config.address}
                  onChange={(e) => setConfig({...config, address: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Logo URL (imagen del instituto)</label>
                <Input
                  value={config.logo}
                  onChange={(e) => setConfig({...config, logo: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Slogan</label>
                <Input
                  value={config.slogan || ''}
                  onChange={(e) => setConfig({...config, slogan: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Tu lema institucional"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Nivel Educativo (ej: Primaria, Bachillerato)</label>
                <Input
                  value={config.educationLevel || ''}
                  onChange={(e) => setConfig({...config, educationLevel: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Ej: Primaria"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Color Principal</label>
                <Input
                  type="color"
                  value={config.brandColor}
                  onChange={(e) => setConfig({...config, brandColor: e.target.value})}
                  className="h-10 bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Color Secundario</label>
                <Input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                  className="h-10 bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Color Acento</label>
                <Input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => setConfig({...config, accentColor: e.target.value})}
                  className="h-10 bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Telegram */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Telegram Bot
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Bot Token</label>
                <Input
                  value={config.telegramToken}
                  onChange={(e) => setConfig({...config, telegramToken: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="123456:ABC-DEF..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Chat ID</label>
                <Input
                  value={config.telegramChatId}
                  onChange={(e) => setConfig({...config, telegramChatId: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <Button variant="outline" onClick={testTelegram} className="w-auto">
              Probar Telegram
            </Button>
          </CardContent>
        </Card>

        {/* WhatsApp Director */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              WhatsApp Director
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Número WhatsApp Director (con código país, ej: 584123456789)</label>
              <Input
                value={config.directorWhatsappPhone}
                onChange={(e) => setConfig({...config, directorWhatsappPhone: e.target.value})}
                className="bg-slate-700 border-slate-600"
                placeholder="584123456789"
              />
            </div>
            <Button variant="outline" onClick={() => testWA(false)} className="w-auto">
              Probar WhatsApp Director
            </Button>
          </CardContent>
        </Card>

        {/* WhatsApp Apoderados */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              WhatsApp Apoderados (CallMeBot)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">CallMeBot API Key (para apoderados)</label>
              <Input
                value={config.callmebotKeyParents}
                onChange={(e) => setConfig({...config, callmebotKeyParents: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button variant="outline" onClick={() => testWA(true)} className="w-auto">
              Probar WhatsApp Apoderados
            </Button>
          </CardContent>
        </Card>

        {/* Email SMTP */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email (SMTP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">SMTP Host</label>
                <Input
                  value={config.smtpHost}
                  onChange={(e) => setConfig({...config, smtpHost: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">SMTP Puerto</label>
                <Input
                  value={config.smtpPort}
                  onChange={(e) => setConfig({...config, smtpPort: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">SMTP Usuario</label>
                <Input
                  value={config.smtpUser}
                  onChange={(e) => setConfig({...config, smtpUser: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">SMTP Password</label>
                <Input
                  type="password"
                  value={config.smtpPassword}
                  onChange={(e) => setConfig({...config, smtpPassword: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">SMTP From (email remitente)</label>
                <Input
                  type="email"
                  value={config.smtpFrom}
                  onChange={(e) => setConfig({...config, smtpFrom: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="nombre@instituto.edu.ve"
                />
              </div>
            </div>
            <Button variant="outline" onClick={testEmail} className="w-auto">
              Probar Email
            </Button>
          </CardContent>
        </Card>

        {/* Time Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Configuración de Tiempo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Zona Horaria</label>
                <Input
                  value={config.timezone}
                  onChange={(e) => setConfig({...config, timezone: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Minutos de Gracia</label>
                <Input
                  type="number"
                  value={config.graceMinutes}
                  onChange={(e) => setConfig({...config, graceMinutes: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}