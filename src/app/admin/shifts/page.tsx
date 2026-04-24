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
  const [showForm, setShowForm] = useState(false)
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
    setShowForm(false)
    loadData()
  }

  const deleteShift = async (id: string) => {
    if (!confirm('Eliminar turno?')) return
    await fetch(`/api/shifts?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Turnos</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Configura los turnos escolares</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader><CardTitle className="text-base">Crear Turno</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Input placeholder="Nombre (ej: Mañana)" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input type="number" placeholder="Minutos de gracia" value={form.graceMinutes} onChange={(e) => setForm({...form, graceMinutes: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input type="time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input type="time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
            </div>
            <Button onClick={createShift} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />Crear Turno
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-base">
            <span>Turnos Existentes</span>
            <Badge className="bg-amber-600">{shifts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {shifts.map(shift => (
              <div key={shift.id} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{shift.name}</span>
                    <p className="text-xs text-[hsl(28,10%,55%)]">{shift.startTime} - {shift.endTime} | Gracia: {shift.graceMinutes}min</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteShift(shift.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {shifts.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" />
                <p className="text-[hsl(28,10%,55%)]">No hay turnos configurados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
