'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, QrCode, Users, BarChart3, Bell, Shield, Settings, LogIn } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] " />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center text-white space-y-6">
            <div className="flex justify-center">
              <div className="p-5 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">SchoolAssist</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Sistema de asistencia escolar con códigos QR, notificaciones en tiempo real
              y dashboard en vivo. Multi-instituto con control total.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90 font-semibold px-8 h-12 text-base shadow-lg">
                  <LogIn className="h-5 w-5 mr-2" />
                  Iniciar Sesion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Todo lo que necesitas</h2>
          <p className="text-muted-foreground mt-2">Gestion escolar moderna y eficiente</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard icon={<QrCode className="h-7 w-7 text-teal-600" />} title="Escaneo QR" description="Registra entrada y salida escaneando la credencial del estudiante al instante" />
          <FeatureCard icon={<Users className="h-7 w-7 text-amber-500" />} title="Multi-Rol" description="Director, Administracion y Portero con permisos especificos para cada funcion" />
          <FeatureCard icon={<BarChart3 className="h-7 w-7 text-emerald-500" />} title="Dashboard en Vivo" description="Metricas en tiempo real: asistieron, faltaron, llegaron tarde al instante" />
          <FeatureCard icon={<Bell className="h-7 w-7 text-orange-500" />} title="Notificaciones" description="Alertas inmediatas a padres por Telegram, WhatsApp o Email en cada escaneo" />
          <FeatureCard icon={<Shield className="h-7 w-7 text-teal-600" />} title="Credenciales" description="Foto + QR descargable e imprimible para cada estudiante registrado" />
          <FeatureCard icon={<Settings className="h-7 w-7 text-amber-500" />} title="100% Configurable" description="Colores, horarios, turnos, grados y mas. Adaptable a cualquier instituto" />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>SchoolAssist &copy; 2026 &mdash; Sistema de Asistencia Escolar</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4 p-3 bg-muted rounded-lg w-fit">{icon}</div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
