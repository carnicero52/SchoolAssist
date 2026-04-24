'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart3, Users, Clock, CheckCircle, XCircle, ScanLine, UsersRound, FileText, Settings, QrCode, Activity, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    present: 0,
    absent: 0,
    late: 0,
    percentage: 0
  })
  const [period, setPeriod] = useState('today')
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => { loadStats() }, [period])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/stats?institutionId=demo`)
      const data = await res.json()

      if (data.today) {
        setStats({
          totalStudents: data.stats?.totalStudents || 0,
          present: data.today.present || 0,
          absent: data.today.absent || 0,
          late: data.today.late || 0,
          percentage: data.today.percentage || 0
        })
        setRecentActivity(data.recentActivity || [])
      }
    } catch (e) {
      // Fallback stats
      setStats({ totalStudents: 0, present: 0, absent: 0, late: 0, percentage: 0 })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Panel de Administración</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Resumen de asistencia del día</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPeriod('today')} variant={period === 'today' ? 'default' : 'outline'}
            className={period === 'today' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'}
            size="sm">
            Hoy
          </Button>
          <Button onClick={() => setPeriod('week')} variant={period === 'week' ? 'default' : 'outline'}
            className={period === 'week' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'}
            size="sm">
            Semana
          </Button>
          <Button onClick={() => setPeriod('month')} variant={period === 'month' ? 'default' : 'outline'}
            className={period === 'month' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'}
            size="sm">
            Mes
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/scan">
          <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] hover:border-amber-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5">
            <CardContent className="pt-6 text-center">
              <ScanLine className="h-8 w-8 mx-auto text-green-400 mb-2" />
              <p className="font-medium text-sm">Escanear QR</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/students">
          <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] hover:border-amber-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5">
            <CardContent className="pt-6 text-center">
              <UsersRound className="h-8 w-8 mx-auto text-blue-400 mb-2" />
              <p className="font-medium text-sm">Estudiantes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/credentials">
          <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] hover:border-amber-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5">
            <CardContent className="pt-6 text-center">
              <QrCode className="h-8 w-8 mx-auto text-purple-400 mb-2" />
              <p className="font-medium text-sm">Credenciales</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] hover:border-amber-500/30 cursor-pointer transition-all hover:shadow-lg hover:shadow-amber-500/5">
            <CardContent className="pt-6 text-center">
              <Settings className="h-8 w-8 mx-auto text-amber-400 mb-2" />
              <p className="font-medium text-sm">Configuración</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="h-6 w-6 text-blue-400" /></div>
              <div>
                <p className="text-sm text-[hsl(28,10%,55%)]">Total</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl"><CheckCircle className="h-6 w-6 text-green-400" /></div>
              <div>
                <p className="text-sm text-[hsl(28,10%,55%)]">Asistieron</p>
                <p className="text-2xl font-bold text-green-400">{stats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl"><Clock className="h-6 w-6 text-orange-400" /></div>
              <div>
                <p className="text-sm text-[hsl(28,10%,55%)]">Tarde</p>
                <p className="text-2xl font-bold text-orange-400">{stats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl"><XCircle className="h-6 w-6 text-red-400" /></div>
              <div>
                <p className="text-sm text-[hsl(28,10%,55%)]">Faltas</p>
                <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Percentage bar */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              <span className="font-medium">Asistencia General</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">{stats.percentage}%</span>
          </div>
          <div className="w-full h-3 bg-[hsl(24,18%,18%)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Chart placeholder */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-amber-400" />
            Asistencia Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-around gap-2">
            {[
              { day: 'L', val: 65 },
              { day: 'M', val: 78 },
              { day: 'X', val: 82 },
              { day: 'J', val: 75 },
              { day: 'V', val: 88 },
              { day: 'S', val: 92 },
              { day: 'D', val: 40 }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-full max-w-8 bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-md transition-all hover:from-amber-400 hover:to-orange-400" style={{ height: `${item.val * 1.5}px` }} />
                <span className="text-xs text-[hsl(28,10%,45%)] mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-amber-400" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                  <div className="flex items-center gap-3">
                    {a.photo ? (
                      <img src={a.photo} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[hsl(24,15%,20%)] flex items-center justify-center">
                        <Users className="h-4 w-4 text-[hsl(28,10%,45%)]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{a.student}</p>
                      <p className="text-xs text-[hsl(28,10%,55%)]">{new Date(a.time).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${a.type === 'in' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                      {a.type === 'in' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
