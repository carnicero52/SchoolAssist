'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  GraduationCap, QrCode, Users, BarChart3, Bell, Shield,
  Settings, CheckCircle, ArrowRight, Smartphone, Zap,
  Clock, Globe, ChevronDown, Star, Menu, X
} from 'lucide-react'

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: 'Escaneo QR Inteligente',
      description: 'Registra entrada y salida en segundos con la cámara del dispositivo. Detección automática de duplicados y validación en tiempo real.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: 'Notificaciones en Tiempo Real',
      description: 'Los padres reciben alertas instantáneas por Telegram, WhatsApp o Email cuando su hijo entra o sale del plantel.',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Dashboard en Vivo',
      description: 'Métricas actualizadas al instante: asistencias, faltas, llegadas tarde. Gráficos semanales y tendencias mensuales.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Credenciales con QR',
      description: 'Genera credenciales personalizadas con foto y código QR para cada estudiante. Descargables e imprimibles.',
      color: 'from-amber-600 to-yellow-600'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Multi-Rol y Permisos',
      description: 'Director, Administración y Portero con permisos específicos. Cada rol ve solo lo que necesita.',
      color: 'from-orange-400 to-amber-600'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Multi-Institución',
      description: 'Gestiona múltiples planteles desde un solo panel de Super Admin. Estadísticas globales y control total.',
      color: 'from-yellow-600 to-orange-500'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Registra tu Institución',
      description: 'Configura tu colegio, turnos, niveles y grupos en minutos.'
    },
    {
      number: '02',
      title: 'Inscribe Estudiantes',
      description: 'Agrega estudiantes con foto y genera sus credenciales QR automáticamente.'
    },
    {
      number: '03',
      title: 'Escanea y Listo',
      description: 'El portero escanea el QR al entrar y salir. Los padres reciben notificación al instante.'
    }
  ]

  return (
    <div className="min-h-screen bg-[hsl(24,25%,10%)] text-[hsl(30,30%,92%)]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[hsl(24,25%,10%)]/95 backdrop-blur-md border-b border-[hsl(24,18%,22%)]' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                SchoolAssist
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[hsl(28,10%,55%)] hover:text-amber-400 transition-colors text-sm font-medium">Funciones</a>
              <a href="#how-it-works" className="text-[hsl(28,10%,55%)] hover:text-amber-400 transition-colors text-sm font-medium">Cómo Funciona</a>
              <a href="#advantages" className="text-[hsl(28,10%,55%)] hover:text-amber-400 transition-colors text-sm font-medium">Ventajas</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-[hsl(30,30%,85%)] hover:text-amber-400 hover:bg-[hsl(24,18%,18%)]">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25">
                  Comenzar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-[hsl(24,22%,13%)] border-t border-[hsl(24,18%,22%)] p-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block py-2 text-[hsl(30,30%,85%)]">Funciones</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)} className="block py-2 text-[hsl(30,30%,85%)]">Cómo Funciona</a>
            <a href="#advantages" onClick={() => setMobileMenu(false)} className="block py-2 text-[hsl(30,30%,85%)]">Ventajas</a>
            <Link href="/login" className="block">
              <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Sistema de Asistencia Escolar #1</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Control de Asistencia
            </span>
            <br />
            <span className="text-[hsl(30,30%,92%)]">
              Escolar Inteligente
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-[hsl(28,10%,55%)] max-w-3xl mx-auto mb-10 leading-relaxed">
            Registra entrada y salida con códigos QR, notifica a los padres en tiempo real
            y gestiona la asistencia de todo tu plantel desde un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-2xl shadow-amber-500/25">
                Comenzar Ahora
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)] px-8 py-6 text-lg">
                Ver Funciones
                <ChevronDown className="h-5 w-5 ml-2" />
              </Button>
            </a>
          </div>

          {/* Floating stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { value: '<3s', label: 'Tiempo de Escaneo' },
              { value: '100%', label: 'Notificación en Vivo' },
              { value: '24/7', label: 'Disponibilidad' },
              { value: 'Multi', label: 'Planteles' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[hsl(24,22%,13%)]/80 backdrop-blur border border-[hsl(24,18%,22%)]">
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[hsl(28,10%,55%)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Todo lo que tu colegio{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                necesita
              </span>
            </h2>
            <p className="text-lg text-[hsl(28,10%,55%)] max-w-2xl mx-auto">
              Herramientas diseñadas específicamente para el control de asistencia escolar
            </p>
          </div>

          {/* Featured Feature */}
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[hsl(24,22%,13%)] border border-[hsl(24,18%,22%)] overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} mb-6 shadow-lg`}>
                  <div className="text-white">{features[activeFeature].icon}</div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">{features[activeFeature].title}</h3>
                <p className="text-[hsl(28,10%,55%)] text-lg leading-relaxed">{features[activeFeature].description}</p>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-[hsl(24,22%,13%)] to-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)] flex items-center justify-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${features[activeFeature].color} opacity-10`} />
                  <div className="relative text-white scale-150">{features[activeFeature].icon}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className={`bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] cursor-pointer transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 ${
                  activeFeature === i ? 'border-amber-500/50 ring-1 ring-amber-500/20' : ''
                }`}
                onClick={() => setActiveFeature(i)}
              >
                <CardContent className="pt-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-md`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-[hsl(28,10%,55%)] text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Cómo{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Funciona
              </span>
            </h2>
            <p className="text-lg text-[hsl(28,10%,55%)] max-w-2xl mx-auto">
              En tres simples pasos tendrás el control total de la asistencia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-500/50 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6">
                  <span className="text-3xl font-extrabold text-amber-400">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[hsl(28,10%,55%)] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section id="advantages" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              ¿Por qué{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                SchoolAssist
              </span>
              ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Smartphone className="h-5 w-5" />, title: 'Funciona en cualquier dispositivo', desc: 'Celular, tablet o computadora. Sin instalación.' },
              { icon: <Zap className="h-5 w-5" />, title: 'Registro en menos de 3 segundos', desc: 'Escaneo QR instantáneo con feedback visual y sonoro.' },
              { icon: <Clock className="h-5 w-5" />, title: 'Detección automática de tarde', desc: 'Compara con horarios configurados por turno y grado.' },
              { icon: <Shield className="h-5 w-5" />, title: 'Datos seguros y en la nube', desc: 'PostgreSQL con respaldo automático y encriptación.' },
              { icon: <Bell className="h-5 w-5" />, title: '3 canales de notificación', desc: 'Telegram, WhatsApp y Email para que ningún padre se quede sin saber.' },
              { icon: <Star className="h-5 w-5" />, title: '100% configurable', desc: 'Colores, horarios, turnos, grados, puntos de escaneo y más.' }
            ].map((adv, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[hsl(24,22%,13%)] border border-[hsl(24,18%,22%)] hover:border-amber-500/30 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  {adv.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{adv.title}</h3>
                  <p className="text-sm text-[hsl(28,10%,55%)]">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-[hsl(24,22%,13%)] border border-amber-500/20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                ¿Listo para modernizar
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  la asistencia escolar?
                </span>
              </h2>
              <p className="text-lg text-[hsl(28,10%,55%)] mb-8 max-w-2xl mx-auto">
                Únete a los colegios que ya confían en SchoolAssist para un control de asistencia
                más eficiente, transparente y seguro.
              </p>
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-6 text-lg shadow-2xl shadow-amber-500/25">
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(24,18%,22%)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-[hsl(30,30%,85%)]">SchoolAssist</span>
            </div>
            <p className="text-sm text-[hsl(28,10%,45%)]">
              SchoolAssist &copy; 2026 &mdash; Sistema de Asistencia Escolar
            </p>
            <div className="flex gap-4 text-[hsl(28,10%,45%)]">
              <span className="text-sm">Privacidad</span>
              <span className="text-sm">Términos</span>
              <span className="text-sm">Contacto</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
