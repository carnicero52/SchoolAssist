'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Plus, Trash2, Navigation } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface ScanPoint {
  id: string
  name: string
  location: string
}

export default function ScanPointsPage() {
  const { institutionId } = useAuth()
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newPoint, setNewPoint] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [, startTransition] = useTransition()

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/scanpoints')
      const data = await res.json()
      startTransition(() => setScanPoints(data.scanPoints || []))
    } catch {
      toast.error('Error cargando puntos de entrada')
    }
    startTransition(() => setLoading(false))
  }, [startTransition])

  useEffect(() => {
    if (institutionId) loadData()
  }, [institutionId, loadData])

  const createPoint = async () => {
    if (!newPoint.trim()) {
      toast.error('El nombre del punto es requerido')
      return
    }
    try {
      const res = await fetch('/api/scanpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPoint.trim(), location: newLocation.trim() })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Punto de entrada creado')
        setNewPoint('')
        setNewLocation('')
        setShowForm(false)
        loadData()
      } else {
        toast.error(data.error || 'Error al crear punto')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const deletePoint = async (id: string) => {
    if (!confirm('¿Eliminar este punto de entrada?')) return
    try {
      const res = await fetch(`/api/scanpoints?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Punto eliminado')
        loadData()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
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
            <MapPin className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Puntos de Entrada</h1>
            <p className="text-sm text-muted-foreground">Ubicaciones de escaneo QR</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Punto
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-teal-600" />
              Crear Punto de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sp-name">Nombre del punto</Label>
                <Input
                  id="sp-name"
                  placeholder="ej: Entrada Principal, Porton Norte"
                  value={newPoint}
                  onChange={(e) => setNewPoint(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createPoint()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-location">Ubicacion / Referencia</Label>
                <Input
                  id="sp-location"
                  placeholder="ej: Edificio A, Piso 1 - Cerca de recepcion"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Descripcion o coordenadas GPS opcionales</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={createPoint} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Punto
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Points List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-teal-600" />
              Puntos Registrados
            </div>
            <Badge variant="secondary">{scanPoints.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scanPoints.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No hay puntos de entrada registrados</p>
              <p className="text-xs text-muted-foreground mt-1">Crea el primer punto con el boton de arriba</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scanPoints.map((point) => (
                <div
                  key={point.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 rounded-lg dark:bg-teal-950/30">
                      <MapPin className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{point.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {point.location || 'Sin ubicacion especificada'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => deletePoint(point.id)}
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
