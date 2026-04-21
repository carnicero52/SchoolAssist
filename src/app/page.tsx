'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { School, Users, QrCode, BarChart3, Shield, Bell, Settings, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Hero */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <School className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            SchoolAssist
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Sistema de asistencia escolar con códigos QR, notificaciones en tiempo real 
            y dashboard en vivo. Multi-instituto con control total.
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                <LogIn className="h-5 w-5 mr-2" />
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <FeatureCard 
            icon={<QrCode className="h-8 w-8 text-blue-400" />}
            title="Escaneo QR"
            description="Escanea la credencial del estudiante para registrar asistencia"
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-green-400" />}
            title="Multi-Rol"
            description="Director, Administración y Portero con permisos específicos"
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8 text-purple-400" />}
            title="Dashboard en Vivo"
            description="Métricas en tiempo real: asistieron, faltaron, tarde"
          />
          <FeatureCard 
            icon={<Bell className="h-8 w-8 text-orange-400" />}
            title="Notificaciones"
            description="Tiempo real a padres por Telegram, WhatsApp o Email"
          />
          <FeatureCard 
            icon={<Shield className="h-8 w-8 text-cyan-400" />}
            title="Credenciales"
            description="Foto + QR descargable e imprimible"
          />
          <FeatureCard 
            icon={<Settings className="h-8 w-8 text-pink-400" />}
            title="100% Configurable"
            description="Colores, horarios, turnos, grados y más"
          />
        </div>
        
        {/* Footer */}
        <div className="text-center text-slate-500 mt-20">
          <p>SchoolAssist © 2026 - Sistema de Asistencia Escolar</p>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
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