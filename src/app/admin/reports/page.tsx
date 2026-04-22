'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart3, Download, Users, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

type Period = 'day' | 'week' | 'month' | 'year'

interface ReportStats {
  total: number
  present: number
  absent: number
  late: number
  percentage: number
  totalStudents: number
  byDate: Record<string, { present: number; late: number; absent: number }>
  period: string
}

export default function ReportsPage() {
  const { institutionId } = useAuth()
  const [period, setPeriod] = useState<Period>('week')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<ReportStats | null>(null)

  useEffect(() => {
    if (institutionId) loadStats()
  }, [institutionId, period])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports?period=${period}`)
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      } else {
        toast.error('Error cargando reportes')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    window.open(`/api/reports?period=${period}&export=csv`, '_blank')
    toast.success('Exportacion iniciada')
  }

  const periods: { key: Period; label: string }[] = [
    { key: 'day', label: 'Hoy' },
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: 'year', label: 'Ano' }
  ]

  const getChartMax = () => {
    if (!stats?.byDate) return 0
    const values = Object.values(stats.byDate)
    if (values.length === 0) return 0
    return Math.max(...values.map((v) => v.present + v.late), 1)
  }

  const chartData = stats?.byDate
    ? Object.entries(stats.byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-14)
        .map(([date, val]) => ({ date, ...val }))
    : []

  const chartMax = getChartMax()

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50">
            <BarChart3 className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reportes</h1>
            <p className="text-sm text-muted-foreground">Estadisticas de asistencia</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {periods.map((p) => (
            <Button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              variant={period === p.key ? 'default' : 'outline'}
              size="sm"
              className={period === p.key ? 'bg-teal-600 hover:bg-teal-700' : ''}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50">
                <Users className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Registros</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-lg dark:bg-emerald-950/50">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">% Asistencia</p>
                <p className="text-2xl font-bold text-emerald-600">{stats?.percentage || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 rounded-lg dark:bg-amber-950/50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tarde</p>
                <p className="text-2xl font-bold text-amber-600">{stats?.late || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 rounded-lg dark:bg-red-950/50">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Faltas</p>
                <p className="text-2xl font-bold text-red-500">{stats?.absent || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            Grafico de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <div className="space-y-3">
              {/* Legend */}
              <div className="flex gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-teal-600" />
                  Presentes
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-500" />
                  Tarde
                </div>
              </div>

              {/* Text-based bar chart */}
              <div className="space-y-2">
                {chartData.map((item) => {
                  const presentWidth = chartMax > 0 ? (item.present / chartMax) * 100 : 0
                  const lateWidth = chartMax > 0 ? (item.late / chartMax) * 100 : 0

                  return (
                    <div key={item.date} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground font-mono">{item.date.slice(5)}</span>
                        <span className="text-muted-foreground">
                          {item.present}P / {item.late}T
                        </span>
                      </div>
                      <div className="flex gap-0.5 h-6">
                        <div
                          className="bg-teal-600 rounded-l-sm transition-all duration-500"
                          style={{ width: `${Math.max(presentWidth, 1)}%` }}
                        />
                        <div
                          className="bg-amber-500 rounded-r-sm transition-all duration-500"
                          style={{ width: `${Math.max(lateWidth, 0)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No hay datos para el periodo seleccionado</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Exportar Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Descarga los datos de asistencia en formato CSV
            </p>
            <Button onClick={exportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
