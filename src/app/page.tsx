'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, QrCode, Users, BarChart3, Bell, Shield, Settings, LogIn, ArrowRight, CheckCircle, Smartphone, Zap, Clock, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">SchoolAssist</span>
          </div>
          <Link href="/login">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar Sesion
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-400" />
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] " />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="text-center text-white space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-center">
              <div className="p-6 bg-white/15 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <GraduationCap className="h-20 w-20 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Control de Asistencia<br />
              <span className="text-white/90">Escolar Inteligente</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              Sistema completo con escaneo QR, notificaciones en tiempo real a padres,
              dashboard en vivo y gestion multi-instituto. Simplifica el control de asistencia de tu institucion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90 font-semibold px-8 h-13 text-base shadow-lg gap-2">
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 pt-4 text-white/70 text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Sin tarjeta de credito
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Configuracion en minutos
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4" />
                Soporte incluido
              </div>
            </div>
          </div>
        </div>
        {/* Wave separator */}
        <div className="relative">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80V30C240 60 480 0 720 20C960 40 1200 80 1440 50V80H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0 mb-4">Funcionalidades</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Todo lo que necesitas para<br />gestionar la asistencia</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Herramientas modernas que simplifican el control de asistencia y mantienen a los padres informados en tiempo real</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<QrCode className="h-7 w-7 text-teal-600" />}
            title="Escaneo QR Instantaneo"
            description="Registra entrada y salida en segundos escaneando la credencial del estudiante. Compatible con camara de celular o lector externo."
          />
          <FeatureCard
            icon={<Bell className="h-7 w-7 text-orange-500" />}
            title="Notificaciones en Tiempo Real"
            description="Los padres reciben alertas inmediatas por Telegram, WhatsApp o Email cada vez que su representado entra, sale o llega tarde."
          />
          <FeatureCard
            icon={<BarChart3 className="h-7 w-7 text-emerald-500" />}
            title="Dashboard en Vivo"
            description="Metricas actualizadas al instante: quien asistio, quien falto, quien llego tarde. Graficos y reportes automaticos."
          />
          <FeatureCard
            icon={<Smartphone className="h-7 w-7 text-blue-500" />}
            title="Credenciales Digitales"
            description="Cada estudiante obtiene una credencial con foto y codigo QR, descargable e imprimible directamente desde la plataforma."
          />
          <FeatureCard
            icon={<Users className="h-7 w-7 text-amber-500" />}
            title="Multi-Instituto y Multi-Rol"
            description="Director, administracion y portero con permisos especificos. Administra varias instituciones desde una sola cuenta de super admin."
          />
          <FeatureCard
            icon={<Settings className="h-7 w-7 text-purple-500" />}
            title="100% Configurable"
            description="Turnos, horarios, minutos de tolerancia, niveles, grupos y mas. Adaptable a cualquier tipo de institucion educativa."
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0 mb-4">Como Funciona</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ponlo en marcha en 3 pasos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard number="1" title="Registra tu Institucion" description="Crea tu cuenta, configura turnos, niveles y grupos. Agrega a tu personal administrativo." />
            <StepCard number="2" title="Inscribe Estudiantes" description="Registra estudiantes con datos del apoderado. Genera credenciales con QR automaticamente." />
            <StepCard number="3" title="Escanear y Listo" description="Escanea el QR al entrar y salir. Los padres reciben notificaciones al instante." />
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-0 mb-4">Ventajas</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Por que elegir SchoolAssist</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AdvantageCard icon={<Zap className="h-5 w-5" />} title="Rapido y Facil" description="Interfaz intuitiva que no requiere capacitacion. Tu personal estara operativo en minutos." />
          <AdvantageCard icon={<Clock className="h-5 w-5" />} title="Ahorra Tiempo" description="Elimina el registro manual. Un escaneo dura 2 segundos y automaticamente notifica al apoderado." />
          <AdvantageCard icon={<Shield className="h-5 w-5" />} title="Seguro y Privado" description="Datos protegidos y separados por institucion. Cada instituto tiene su propio espacio aislado." />
          <AdvantageCard icon={<Globe className="h-5 w-5" />} title="Acceso desde Cualquier Lugar" description="Plataforma web accesible desde cualquier dispositivo con navegador. Sin instalaciones." />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500" />
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comienza a transformar el control de asistencia</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8 text-lg">
            Unete a las instituciones que ya confian en SchoolAssist para mantener a los padres informados y la asistencia bajo control.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-white/90 font-semibold px-8 h-13 text-base shadow-lg gap-2">
              Comenzar Ahora
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-600 rounded-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">SchoolAssist</span>
            </div>
            <p className="text-sm text-muted-foreground">
              SchoolAssist &copy; 2026 &mdash; Sistema de Asistencia Escolar
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-6 hover:shadow-lg transition-all hover:border-teal-200 dark:hover:border-teal-800 group">
      <div className="mb-4 p-3 bg-muted rounded-lg w-fit group-hover:bg-teal-50 dark:group-hover:bg-teal-900/20 transition-colors">{icon}</div>
      <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center space-y-3">
      <div className="mx-auto h-12 w-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-600/20">
        {number}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function AdvantageCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl border bg-card hover:shadow-md transition-shadow">
      <div className="shrink-0 h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

