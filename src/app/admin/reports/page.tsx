'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, Download, Filter, Calendar } from 'lucide-react'

export default function ReportsPage() {
  const [period, setPeriod] = useState('week') // day, week, month, year
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadStats()
  }, [period])

  const loadStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reports?period=${period}`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    // Export functionality
    alert('Exportar a CSV')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reportes</h1>
          
          <div className="flex gap-2">
            <Button onClick={() => setPeriod('day')} variant={period === 'day' ? 'default' : 'outline'}>
              Hoy
            </Button>
            <Button onClick={() => setPeriod('week')} variant={period === 'week' ? 'default' : 'outline'}>
              Semana
            </Button>
            <Button onClick={() => setPeriod('month')} variant={period === 'month' ? 'default' : 'outline'}>
              Mes
            </Button>
            <Button onClick={() => setPeriod('year')} variant={period === 'year' ? 'default' : 'outline'}>
              Año
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Total Registros</p>
              <p className="text-3xl font-bold">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">% Asistencia</p>
              <p className="text-3xl font-bold text-green-400">{stats?.percentage || 0}%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Tarde</p>
              <p className="text-3xl font-bold text-orange-400">{stats?.late || 0}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Faltas</p>
              <p className="text-3xl font-bold text-red-400">{stats?.absent || 0}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Chart placeholder - would integrate Chart.js or similar */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Gráfico de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <FileText className="h-12 w-12 mr-2" />
              Gráfico se mostrará aquí
            </div>
          </CardContent>
        </Card>
        
        {/* Export options */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Exportar Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={exportCSV} className="bg-green-500">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
              <Button className="bg-blue-500">
                <FileText className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}