'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Clock } from 'lucide-react'

interface Shift { id: string; name: string; startTime: string; endTime: string; graceMinutes: number }

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', graceMinutes: '15' })
  const institutionId = 'demo'

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/shifts?institutionId=${institutionId}`)
      const data = await res.json()
      setShifts(data.shifts || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const createShift = async () => {
    if (!form.name || !form.startTime || !form.endTime) return
    await fetch('/api/shifts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, ...form })
    })
    setForm({ name: '', startTime: '', endTime: '', graceMinutes: '15' })
    loadData()
  }

  const deleteShift = async (id: string) => {
    if (!confirm('Eliminar turno?')) return
    await fetch(`/api/shifts?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Turnos</h1>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Crear Turno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Nombre (ej: Mañana)"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                type="number"
                placeholder="Minutos de gracia"
                value={form.graceMinutes}
                onChange={(e) => setForm({...form, graceMinutes: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({...form, startTime: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({...form, endTime: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button onClick={createShift} className="w-full bg-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Crear Turno
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Turnos Existentes
              <Badge>{shifts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shifts.map(shift => (
                <div key={shift.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">{shift.name}</span>
                    <span className="text-slate-400">{shift.startTime} - {shift.endTime}</span>
                    <Badge variant="outline">{shift.graceMinutes}min</Badge>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => deleteShift(shift.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {shifts.length === 0 && (
                <p className="text-center text-slate-500 py-4">No hay turnos</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}