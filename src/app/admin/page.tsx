'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, Clock, CheckCircle, XCircle, AlertCircle, Download, Calendar } from 'lucide-react'

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

  useEffect(() => { loadStats() }, [period])

  const loadStats = async () => {
    setLoading(true)
    // Simulated data
    setStats({
      totalStudents: 150,
      present: 120,
      absent: 20,
      late: 10,
      percentage: 80
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button onClick={() => setPeriod('today')} variant={period === 'today' ? 'default' : 'outline'} size="sm">
              Hoy
            </Button>
            <Button onClick={() => setPeriod('week')} variant={period === 'week' ? 'default' : 'outline'} size="sm">
              Semana
            </Button>
            <Button onClick={() => setPeriod('month')} variant={period === 'month' ? 'default' : 'outline'} size="sm">
              Mes
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Estudiantes</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Asistieron</p>
                  <p className="text-2xl font-bold text-green-400">{stats.present}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Tarde</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.late}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Faltaron</p>
                  <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Percentage */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">% Asistencia</span>
              <span className="text-2xl font-bold text-green-400">{stats.percentage}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-cyan-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chart Placeholder */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Gráfico de Asistencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-around gap-2">
              {[65, 78, 82, 75, 88, 92, 85].map((val, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t"
                    style={{ height: `${val * 1.5}px` }}
                  />
                  <span className="text-xs text-slate-500">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}