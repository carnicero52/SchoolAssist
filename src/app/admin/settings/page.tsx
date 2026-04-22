'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Save, Palette, Bell, Mail, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Config {
  name: string
  logo: string
  brandColor: string
  secondaryColor: string
  accentColor: string
  email: string
  phone: string
  address: string
  slogan: string
  educationLevel: string
  telegramToken: string
  telegramChatId: string
  callmebotKey: string
  callmebotKeyParents: string
  smtpHost: string
  smtpUser: string
  smtpPassword: string
  smtpPort: string
  smtpFrom: string
  timezone: string
  defaultTheme: string
  graceMinutes: string
}

const defaultConfig: Config = {
  name: '',
  logo: '',
  brandColor: '#0d9488',
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  email: '',
  phone: '',
  address: '',
  slogan: '',
  educationLevel: '',
  telegramToken: '',
  telegramChatId: '',
  callmebotKey: '',
  callmebotKeyParents: '',
  smtpHost: '',
  smtpUser: '',
  smtpPassword: '',
  smtpPort: '587',
  smtpFrom: '',
  timezone: 'America/Caracas',
  defaultTheme: 'system',
  graceMinutes: '15'
}

export default function SettingsPage() {
  const { institutionId } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState<Config>(defaultConfig)
  const [originalConfig, setOriginalConfig] = useState<Config>(defaultConfig)

  useEffect(() => {
    if (institutionId) loadConfig()
  }, [institutionId])

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.institution) {
          const inst = data.institution
          const loaded: Config = {
            name: inst.name || '',
            logo: inst.logo || '',
            brandColor: inst.brandColor || '#0d9488',
            secondaryColor: inst.secondaryColor || '#64748b',
            accentColor: inst.accentColor || '#f59e0b',
            email: inst.email || '',
            phone: inst.phone || '',
            address: inst.address || '',
            slogan: inst.slogan || '',
            educationLevel: inst.educationLevel || '',
            telegramToken: inst.telegramToken || '',
            telegramChatId: inst.telegramChatId || '',
            callmebotKey: inst.callmebotKey || '',
            callmebotKeyParents: inst.callmebotKeyParents || '',
            smtpHost: inst.smtpHost || '',
            smtpUser: inst.smtpUser || '',
            smtpPassword: inst.smtpPassword || '',
            smtpPort: String(inst.smtpPort || 587),
            smtpFrom: inst.smtpFrom || '',
            timezone: inst.timezone || 'America/Caracas',
            defaultTheme: inst.defaultTheme || 'system',
            graceMinutes: String(inst.graceMinutes || 15)
          }
          setConfig(loaded)
          setOriginalConfig(loaded)
        }
      } else {
        toast.error('Error cargando configuracion')
      }
    } catch {
      toast.error('Error de conexion al cargar configuracion')
    }
    setLoading(false)
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          graceMinutes: parseInt(config.graceMinutes) || 15,
          smtpPort: parseInt(config.smtpPort) || 587
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Configuracion guardada exitosamente')
        setOriginalConfig({ ...config })
      } else {
        toast.error(data.error || 'Error al guardar configuracion')
      }
    } catch {
      toast.error('Error de conexion al guardar')
    } finally {
      setSaving(false)
    }
  }

  const updateField = <K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig)

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configuracion</h1>
          <p className="text-sm text-muted-foreground">Ajustes generales de la institucion</p>
        </div>
        <Button
          onClick={saveConfig}
          disabled={saving || !hasChanges}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {hasChanges && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-200">
          Hay cambios sin guardar. Haz clic en &quot;Guardar Cambios&quot; para aplicarlos.
        </div>
      )}

      {/* Institution Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="h-5 w-5 text-teal-600" />
            Informacion del Instituto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inst-name">Nombre</Label>
              <Input
                id="inst-name"
                value={config.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Nombre de la institucion"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-email">Email</Label>
              <Input
                id="inst-email"
                type="email"
                value={config.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="correo@institucion.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-phone">Telefono</Label>
              <Input
                id="inst-phone"
                value={config.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+58 212 1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inst-level">Nivel Educativo</Label>
              <Input
                id="inst-level"
                value={config.educationLevel}
                onChange={(e) => updateField('educationLevel', e.target.value)}
                placeholder="ej: Primaria, Secundaria, Universitario"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inst-address">Direccion</Label>
            <Textarea
              id="inst-address"
              value={config.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="Direccion completa"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inst-slogan">Lema</Label>
            <Input
              id="inst-slogan"
              value={config.slogan}
              onChange={(e) => updateField('slogan', e.target.value)}
              placeholder="Lema del instituto"
            />
          </div>

          <Separator />

          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium mb-3">Colores de Marca</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color-brand">Color Principal</Label>
                <div className="flex gap-2 items-center">
                  <input
                    id="color-brand"
                    type="color"
                    value={config.brandColor}
                    onChange={(e) => updateField('brandColor', e.target.value)}
                    className="h-10 w-12 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={config.brandColor}
                    onChange={(e) => updateField('brandColor', e.target.value)}
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-secondary">Color Secundario</Label>
                <div className="flex gap-2 items-center">
                  <input
                    id="color-secondary"
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="h-10 w-12 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-accent">Color Acento</Label>
                <div className="flex gap-2 items-center">
                  <input
                    id="color-accent"
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="h-10 w-12 rounded border border-input cursor-pointer"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => updateField('accentColor', e.target.value)}
                    className="flex-1 font-mono text-sm"
                    maxLength={7}
                  />
                </div>
              </div>
            </div>
            {/* Color Preview */}
            <div className="flex gap-2 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: config.brandColor }} />
                Principal
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: config.secondaryColor }} />
                Secundario
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: config.accentColor }} />
                Acento
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-amber-500" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            Configura los canales de notificacion para alertas de asistencia.
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tg-token">Telegram Bot Token</Label>
              <Input
                id="tg-token"
                value={config.telegramToken}
                onChange={(e) => updateField('telegramToken', e.target.value)}
                placeholder="123456:ABC-DEF..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tg-chat">Telegram Chat ID</Label>
              <Input
                id="tg-chat"
                value={config.telegramChatId}
                onChange={(e) => updateField('telegramChatId', e.target.value)}
                placeholder="-1001234567890"
              />
            </div>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cmb-key">CallMeBot API Key (Admin)</Label>
              <Input
                id="cmb-key"
                value={config.callmebotKey}
                onChange={(e) => updateField('callmebotKey', e.target.value)}
                placeholder="Clave API de CallMeBot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmb-parents">CallMeBot API Key (Padres)</Label>
              <Input
                id="cmb-parents"
                value={config.callmebotKeyParents}
                onChange={(e) => updateField('callmebotKeyParents', e.target.value)}
                placeholder="Clave API para notificar padres"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5 text-emerald-600" />
            Configuracion Email (SMTP)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
            Configura el servidor SMTP para enviar correos y reportes.
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={config.smtpHost}
                onChange={(e) => updateField('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Puerto</Label>
              <Input
                id="smtp-port"
                type="number"
                value={config.smtpPort}
                onChange={(e) => updateField('smtpPort', e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">SMTP Usuario</Label>
              <Input
                id="smtp-user"
                value={config.smtpUser}
                onChange={(e) => updateField('smtpUser', e.target.value)}
                placeholder="usuario@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-pass">SMTP Contrasena</Label>
              <Input
                id="smtp-pass"
                type="password"
                value={config.smtpPassword}
                onChange={(e) => updateField('smtpPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="smtp-from">Remitente (From)</Label>
              <Input
                id="smtp-from"
                value={config.smtpFrom}
                onChange={(e) => updateField('smtpFrom', e.target.value)}
                placeholder="notificaciones@institucion.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-orange-500" />
            Configuracion de Tiempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tz">Zona Horaria</Label>
              <Input
                id="tz"
                value={config.timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
                placeholder="America/Caracas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grace">Minutos de Gracia (global)</Label>
              <Input
                id="grace"
                type="number"
                min="0"
                max="60"
                value={config.graceMinutes}
                onChange={(e) => updateField('graceMinutes', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tiempo de tolerancia despues de la hora de inicio para marcar como tarde
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button (bottom) */}
      <div className="flex justify-end pb-6">
        <Button
          onClick={saveConfig}
          disabled={saving || !hasChanges}
          className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 min-w-[200px]"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  )
}
