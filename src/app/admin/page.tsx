'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, Clock, XCircle, Activity, ScanLine, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/components/auth-provider'

interface Stats {
  today: { present: number; absent: number; late: number; out: number; totalScans: number; percentage: number }
  weekly: Record<string, { present: number; late: number }>
  recentActivity: { id: string; type: string; status: string; time: string; student: string; photo: string | null }[]
  stats: { totalStudents: number; averageAttendance: number }
}

export default function DashboardPage() {
  const { institutionId } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [, startTransition] = useTransition()

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) {
        const data = await res.json()
        startTransition(() => setStats(data))
      }
    } catch (e) { console.error(e) }
    startTransition(() => setLoading(false))
  }, [startTransition])

  useEffect(() => {
    if (institutionId) loadStats()
  }, [institutionId, loadStats])

  const chartData = stats?.weekly
    ? Object.entries(stats.weekly)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
        .map(([date, val]) => ({
          date: date.slice(5),
          Presentes: val.present,
          Tarde: val.late
        }))
    : []

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse"><CardContent className="pt-6 h-24" /></Card>
          ))}
        </div>
      </div>
    )
  }

  const t = stats?.today
  const s = stats?.stats

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen de asistencia del dia</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/admin/scan">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br from-teal-50 to-teal-100/50 dark:from-teal-950/50 dark:to-teal-900/20">
            <CardContent className="pt-5 text-center">
              <ScanLine className="h-7 w-7 mx-auto text-teal-600 mb-2" />
              <p className="font-medium text-sm text-teal-700 dark:text-teal-400">Escanear QR</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/students">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/50 dark:to-amber-900/20">
            <CardContent className="pt-5 text-center">
              <Users className="h-7 w-7 mx-auto text-amber-600 mb-2" />
              <p className="font-medium text-sm text-amber-700 dark:text-amber-400">Estudiantes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reports">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-emerald-900/20">
            <CardContent className="pt-5 text-center">
              <Activity className="h-7 w-7 mx-auto text-emerald-600 mb-2" />
              <p className="font-medium text-sm text-emerald-700 dark:text-emerald-400">Reportes</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 bg-gradient-to-br from-stone-50 to-stone-100/50 dark:from-stone-800/50 dark:to-stone-700/20">
            <CardContent className="pt-5 text-center">
              <Activity className="h-7 w-7 mx-auto text-stone-600 mb-2" />
              <p className="font-medium text-sm text-stone-700 dark:text-stone-400">Configuracion</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50"><Users className="h-5 w-5 text-teal-600" /></div>
              <div><p className="text-xs text-muted-foreground">Total</p><p className="text-2xl font-bold">{s?.totalStudents || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg dark:bg-emerald-950/50"><CheckCircle className="h-5 w-5 text-emerald-600" /></div>
              <div><p className="text-xs text-muted-foreground">Asistieron</p><p className="text-2xl font-bold text-emerald-600">{t?.present || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-lg dark:bg-amber-950/50"><Clock className="h-5 w-5 text-amber-600" /></div>
              <div><p className="text-xs text-muted-foreground">Tarde</p><p className="text-2xl font-bold text-amber-600">{t?.late || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-lg dark:bg-red-950/50"><XCircle className="h-5 w-5 text-red-500" /></div>
              <div><p className="text-xs text-muted-foreground">Faltas</p><p className="text-2xl font-bold text-red-500">{t?.absent || 0}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Asistencia Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="Presentes" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Tarde" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Sin datos de asistencia aun
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Actividad Reciente</CardTitle>
              <Link href="/admin/reports" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
                Ver todo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.recentActivity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex justify-between items-center p-2.5 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Badge variant={a.type === 'in' ? 'default' : 'secondary'}
                      className={a.type === 'in' ? 'bg-teal-600' : 'bg-amber-500'}>
                      {a.type === 'in' ? 'Entrada' : 'Salida'}
                    </Badge>
                    <span className="text-sm font-medium">{a.student}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.time).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
