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
  const [showForm, setShowForm] = useState(false)
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
    setShowForm(false)
    loadData()
  }

  const deletePoint = async (id: string) => {
    if (!confirm('Eliminar punto de entrada?')) return
    await fetch(`/api/scanpoints?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Puntos de Entrada</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Configura dónde se escanea</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />Nuevo
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader><CardTitle className="text-base">Crear Punto</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Nombre (ej: Entrada Principal)" value={newPoint} onChange={(e) => setNewPoint(e.target.value)} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input placeholder="Ubicación/GPS (opcional)" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Button onClick={createPoint} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />Crear Punto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-base">
            <span className="flex items-center gap-2"><MapPin className="h-5 w-5 text-amber-400" />Puntos Existentes</span>
            <Badge className="bg-amber-600">{scanPoints.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scanPoints.map(point => (
              <div key={point.id} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center"><MapPin className="h-4 w-4 text-amber-400" /></div>
                  <div>
                    <p className="font-medium text-sm">{point.name}</p>
                    <p className="text-xs text-[hsl(28,10%,55%)]">{point.location || 'Sin ubicación'}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deletePoint(point.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {scanPoints.length === 0 && (
              <div className="text-center py-8"><MapPin className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" /><p className="text-[hsl(28,10%,55%)]">No hay puntos de entrada</p></div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
