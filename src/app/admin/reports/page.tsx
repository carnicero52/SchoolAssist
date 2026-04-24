'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  const [period, setPeriod] = useState('week')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => { loadStats() }, [period])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/stats?institutionId=demo`)
      const data = await res.json()
      setStats(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const exportCSV = () => { window.open(`/api/export/students?institutionId=demo&format=csv`, '_blank') }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reportes</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Estadísticas de asistencia</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map(p => (
            <Button key={p} onClick={() => setPeriod(p)} variant={period === p ? 'default' : 'outline'}
              className={period === p ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'}
              size="sm">
              {{day:'Hoy',week:'Semana',month:'Mes',year:'Año'}[p]||p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6"><p className="text-sm text-[hsl(28,10%,55%)]">Total Registros</p><p className="text-3xl font-bold">{stats?.today?.totalScans || 0}</p></CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6"><p className="text-sm text-[hsl(28,10%,55%)]">% Asistencia</p><p className="text-3xl font-bold text-green-400">{stats?.today?.percentage || 0}%</p></CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6"><p className="text-sm text-[hsl(28,10%,55%)]">Tarde</p><p className="text-3xl font-bold text-orange-400">{stats?.today?.late || 0}</p></CardContent>
        </Card>
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardContent className="pt-6"><p className="text-sm text-[hsl(28,10%,55%)]">Faltas</p><p className="text-3xl font-bold text-red-400">{stats?.today?.absent || 0}</p></CardContent>
        </Card>
      </div>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-5 w-5 text-amber-400" />Gráfico de Asistencia</CardTitle></CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[hsl(28,10%,45%)]">
            <FileText className="h-12 w-12 mr-2 opacity-50" />
            <span>Gráfico se mostrará aquí</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader><CardTitle className="text-base">Exportar Datos</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white"><Download className="h-4 w-4 mr-2" />Exportar CSV</Button>
            <Button variant="outline" className="border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]"><FileText className="h-4 w-4 mr-2" />Exportar Excel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
