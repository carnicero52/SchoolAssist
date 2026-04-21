'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, MapPin } from 'lucide-react'

interface ScanPoint { id: string; name: string; location: string }

export default function ScanPointsPage() {
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [newPoint, setNewPoint] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const institutionId = 'demo'

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/scanpoints?institutionId=${institutionId}`)
      const data = await res.json()
      setScanPoints(data.scanPoints || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const createPoint = async () => {
    if (!newPoint) return
    await fetch('/api/scanpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, name: newPoint, location: newLocation })
    })
    setNewPoint('')
    setNewLocation('')
    loadData()
  }

  const deletePoint = async (id: string) => {
    if (!confirm('Eliminar punto de entrada?')) return
    await fetch(`/api/scanpoints?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Puntos de Entrada</h1>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Crear Punto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Nombre (ej: Entrada Principal)"
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                placeholder="Ubicación/GPS (opcional)"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={createPoint} className="w-full bg-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                Crear Punto
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Puntos Existentes
              </div>
              <Badge>{scanPoints.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanPoints.map(point => (
                <div key={point.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium">{point.name}</p>
                    <p className="text-sm text-slate-400">{point.location || 'Sin ubicación'}</p>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => deletePoint(point.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {scanPoints.length === 0 && (
                <p className="text-center text-slate-500 py-4">No hay puntos</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}