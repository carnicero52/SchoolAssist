'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Palette, Bell, Clock, Mail, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    name: '', logo: '', brandColor: '#d97706', secondaryColor: '#64748b', accentColor: '#22c55e',
    email: '', phone: '', address: '', telegramToken: '', telegramChatId: '', callmebotKey: '',
    smtpHost: '', smtpUser: '', smtpPort: '587', smtpPassword: '',
    timezone: 'America/Caracas', defaultTheme: 'dark', graceMinutes: '15'
  })

  useEffect(() => { setLoading(false) }, [])

  const saveConfig = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId: 'demo', ...config })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Configuración</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Personaliza tu institución</p>
        </div>
        <Button onClick={saveConfig} disabled={saving} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
          {saving ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : saved ? (
            <CheckCircle className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
        </Button>
      </div>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-5 w-5 text-amber-400" />Información del Instituto</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Nombre</label><Input value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Email</label><Input type="email" value={config.email} onChange={(e) => setConfig({...config, email: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Teléfono</label><Input value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Dirección</label><Input value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Color Principal</label><Input type="color" value={config.brandColor} onChange={(e) => setConfig({...config, brandColor: e.target.value})} className="h-10 bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Color Secundario</label><Input type="color" value={config.secondaryColor} onChange={(e) => setConfig({...config, secondaryColor: e.target.value})} className="h-10 bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Color Acento</label><Input type="color" value={config.accentColor} onChange={(e) => setConfig({...config, accentColor: e.target.value})} className="h-10 bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-5 w-5 text-amber-400" />Notificaciones</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Telegram Bot Token</label><Input value={config.telegramToken} onChange={(e) => setConfig({...config, telegramToken: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" placeholder="123456:ABC-DEF..." /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Telegram Chat ID</label><Input value={config.telegramChatId} onChange={(e) => setConfig({...config, telegramChatId: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">CallMeBot API Key</label><Input value={config.callmebotKey} onChange={(e) => setConfig({...config, callmebotKey: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Mail className="h-5 w-5 text-amber-400" />Configuración Email (SMTP)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[hsl(28,10%,55%)]">SMTP Host</label><Input value={config.smtpHost} onChange={(e) => setConfig({...config, smtpHost: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" placeholder="smtp.gmail.com" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">SMTP Puerto</label><Input value={config.smtpPort} onChange={(e) => setConfig({...config, smtpPort: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">SMTP Usuario</label><Input value={config.smtpUser} onChange={(e) => setConfig({...config, smtpUser: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">SMTP Contraseña</label><Input type="password" value={config.smtpPassword} onChange={(e) => setConfig({...config, smtpPassword: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock className="h-5 w-5 text-amber-400" />Configuración de Tiempo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Zona Horaria</label><Input value={config.timezone} onChange={(e) => setConfig({...config, timezone: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
            <div><label className="text-sm text-[hsl(28,10%,55%)]">Minutos de Gracia</label><Input type="number" value={config.graceMinutes} onChange={(e) => setConfig({...config, graceMinutes: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" /></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
