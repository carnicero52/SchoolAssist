'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, QrCode, BarChart3, Settings, FileText, ScanLine } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Estudiantes</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <QrCode className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Asistieron Hoy</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">% Asistencia</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <ScanLine className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Tarde</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Menu */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/admin/students">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <CardTitle className="text-lg">Estudiantes</CardTitle>
                  <p className="text-sm text-slate-400">Gestionar estudiantes</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/scan">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <ScanLine className="h-8 w-8 text-green-400" />
                <div>
                  <CardTitle className="text-lg">Escanear</CardTitle>
                  <p className="text-sm text-slate-400">Registrar asistencia</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/reports">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <FileText className="h-8 w-8 text-purple-400" />
                <div>
                  <CardTitle className="text-lg">Reportes</CardTitle>
                  <p className="text-sm text-slate-400">Ver estadísticas</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/admin/settings">
            <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50">
              <CardContent className="pt-6 flex items-center gap-4">
                <Settings className="h-8 w-8 text-orange-400" />
                <div>
                  <CardTitle className="text-lg">Configuración</CardTitle>
                  <p className="text-sm text-slate-400">Ajustes del instituto</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}