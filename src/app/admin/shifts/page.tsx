'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  graceMinutes: number
}

export default function ShiftsPage() {
  const { institutionId } = useAuth()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', graceMinutes: '15' })
  const [, startTransition] = useTransition()

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/shifts')
      const data = await res.json()
      startTransition(() => setShifts(data.shifts || []))
    } catch {
      toast.error('Error cargando turnos')
    }
    startTransition(() => setLoading(false))
  }, [startTransition])

  useEffect(() => {
    if (institutionId) loadData()
  }, [institutionId, loadData])

  const createShift = async () => {
    if (!form.name || !form.startTime || !form.endTime) {
      toast.error('Nombre, hora inicio y hora fin son requeridos')
      return
    }
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, graceMinutes: parseInt(form.graceMinutes) || 15 })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Turno creado exitosamente')
        setForm({ name: '', startTime: '', endTime: '', graceMinutes: '15' })
        setShowForm(false)
        loadData()
      } else {
        toast.error(data.error || 'Error al crear turno')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const deleteShift = async (id: string) => {
    if (!confirm('¿Estas seguro de eliminar este turno? Esta accion no se puede deshacer.')) return
    try {
      const res = await fetch(`/api/shifts?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Turno eliminado')
        loadData()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50">
            <Clock className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Turnos</h1>
            <p className="text-sm text-muted-foreground">Horarios y minutos de gracia</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-teal-600" />
              Crear Turno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del turno</Label>
                  <Input
                    placeholder="ej: Manana, Tarde, Noche"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minutos de gracia</Label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={form.graceMinutes}
                    onChange={(e) => setForm({ ...form, graceMinutes: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hora de inicio</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                  {form.startTime && (
                    <p className="text-xs text-muted-foreground">{formatTime(form.startTime)}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Hora de fin</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                  {form.endTime && (
                    <p className="text-xs text-muted-foreground">{formatTime(form.endTime)}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={createShift} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Turno
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shifts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Turnos Configurados
            </div>
            <Badge variant="secondary">{shifts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shifts.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No hay turnos configurados</p>
              <p className="text-xs text-muted-foreground mt-1">Crea el primer turno con el boton de arriba</p>
            </div>
          ) : (
            <div className="space-y-2">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg dark:bg-teal-950/30">
                      <Clock className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{shift.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(shift.startTime)} — {formatTime(shift.endTime)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                      {shift.graceMinutes} min gracia
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => deleteShift(shift.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
