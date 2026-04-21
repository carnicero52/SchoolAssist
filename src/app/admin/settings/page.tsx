'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, Palette, Bell, Clock, Mail, MessageSquare } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    name: '',
    logo: '',
    brandColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#22c55e',
    email: '',
    phone: '',
    address: '',
    telegramToken: '',
    telegramChatId: '',
    callmebotKey: '',
    smtpHost: '',
    smtpUser: '',
    smtpPort: '587',
    timezone: 'America/Caracas',
    defaultTheme: 'dark',
    graceMinutes: '15'
  })

  useEffect(() => { loadConfig() }, [])

  const loadConfig = async () => {
    try {
      // In a real app, fetch from API
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // Save to API
      await new Promise(r => setTimeout(r, 1000))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
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

        {/* Basic Info */}
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

        {/* Notifications */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400">Telegram Bot Token</label>
                <Input
                  value={config.telegramToken}
                  onChange={(e) => setConfig({...config, telegramToken: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="123456:ABC-DEF..."
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Telegram Chat ID</label>
                <Input
                  value={config.telegramChatId}
                  onChange={(e) => setConfig({...config, telegramChatId: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">CallMeBot API Key</label>
                <Input
                  value={config.callmebotKey}
                  onChange={(e) => setConfig({...config, callmebotKey: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configuración Email (SMTP)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
            </div>
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
                <label className="text-sm text-slate-400">Minutos de Gracia (para считаr tarde)</label>
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