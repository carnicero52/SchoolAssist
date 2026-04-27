'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { School, Users, QrCode, BarChart3, Shield, Bell, Settings, LogIn, GraduationCap, Clock, CheckCircle, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', email: '', phone: '', address: '', logo: '',
    brandColor: '#3b82f6', secondaryColor: '#64748b', accentColor: '#22c55e',
    educationLevel: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.slug) {
      setMessage('Nombre, email y slug son obligatorios')
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/superadmin/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setStatus('success')
        if (data.adminCredentials) {
          setMessage(
            `✅ Instituto creado: ${data.institution.name}\n` +
            `👤 Admin: ${data.adminCredentials.email}\n` +
            `🔐 Contraseña temporal: ${data.adminCredentials.password}\n` +
            `⚠️ Cambia la contraseña al iniciar sesión.`
          )
        } else {
          setMessage(`✅ Instituto creado: ${data.institution.name}.`)
        }
        setForm({ name: '', slug: '', email: '', phone: '', address: '', logo: '', brandColor: '#3b82f6', secondaryColor: '#64748b', accentColor: '#22c55e', educationLevel: '' })
      } else {
        setStatus('error')
        setMessage(data.error || 'Error al crear instituto')
      }
    } catch (e) {
      setStatus('error')
      setMessage('Error de conexión')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900">
      {/* Hero */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-white/10 backdrop-blur rounded-full border border-white/20">
              <GraduationCap className="h-16 w-16 text-cyan-400" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SchoolAssist
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Sistema de asistencia escolar con códigos QR, notificaciones en tiempo real 
            y dashboard en vivo. Multi-instituto con control total.
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                <LogIn className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
            <Button 
              size="lg" 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Registrar Instituto
            </Button>
          </div>

          {/* Status Message */}
          {status !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg max-w-md mx-auto ${
              status === 'success' ? 'bg-green-500/20 border border-green-500 text-green-200' :
              status === 'error' ? 'bg-red-500/20 border border-red-500 text-red-200' :
              'bg-blue-500/20 border border-blue-500 text-blue-200'
            }`}>
              {message}
            </div>
          )}
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <FeatureCard 
            icon={<QrCode className="h-8 w-8 text-cyan-400" />}
            title="Escaneo QR"
            description="Escanea la credencial del estudiante para registrar asistencia"
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-purple-400" />}
            title="Multi-Rol"
            description="Director, Administración y Portero con permisos específicos"
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8 text-pink-400" />}
            title="Dashboard en Vivo"
            description="Métricas en tiempo real: asistieron, faltaron, tarde"
          />
          <FeatureCard 
            icon={<Bell className="h-8 w-8 text-orange-400" />}
            title="Notificaciones"
            description="Tiempo real a padres por Telegram, WhatsApp o Email"
          />
          <FeatureCard 
            icon={<Shield className="h-8 w-8 text-green-400" />}
            title="Credenciales"
            description="Foto + QR descargable e imprimible"
          />
          <FeatureCard 
            icon={<Settings className="h-8 w-8 text-blue-400" />}
            title="100% Configurable"
            description="Colores, horarios, turnos, grados y más"
          />
        </div>
        
        {/* Footer */}
        <div className="text-center text-slate-500 mt-20">
          <p>SchoolAssist © 2026 - Sistema de Asistencia Escolar</p>
        </div>
      </div>

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-400" />
                Registrar Nuevo Instituto
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 font-medium">Nombre del Instituto *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="Ej: Colegio San Juan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Slug (URL única) *</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="ej: san-juan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="contacto@instituto.edu.ve"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Teléfono</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="+58 212 123 4567"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Dirección</label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="Av. Principal, Caracas"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Logo URL</label>
                  <Input
                    value={form.logo}
                    onChange={(e) => setForm({...form, logo: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Color Principal</label>
                  <Input
                    type="color"
                    value={form.brandColor}
                    onChange={(e) => setForm({...form, brandColor: e.target.value})}
                    className="h-10 bg-slate-800 border-gray-700 mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Color Secundario</label>
                  <Input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => setForm({...form, secondaryColor: e.target.value})}
                    className="h-10 bg-slate-800 border-gray-700 mt-1 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 font-medium">Color Acento</label>
                  <Input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({...form, accentColor: e.target.value})}
                    className="h-10 bg-slate-800 border-gray-700 mt-1 w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-slate-400 font-medium">Nivel Educativo (opcional)</label>
                  <Input
                    value={form.educationLevel}
                    onChange={(e) => setForm({...form, educationLevel: e.target.value})}
                    className="bg-slate-800 border-slate-700 mt-1"
                    placeholder="Ej: Primaria, Bachillerato, Universidad"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
                >
                  {status === 'loading' ? 'Creando...' : '✓ Crear Instituto'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                  className="px-6"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-white/5 backdrop-blur border-white/10">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-300">
        {description}
      </CardContent>
    </Card>
  )
}
