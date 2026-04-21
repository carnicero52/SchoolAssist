'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { QrCode, Camera, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ScanPage() {
  const [scanCode, setScanCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recentScans, setRecentScans] = useState<any[]>([])

  const handleScan = async (type: 'in' | 'out' = 'in') => {
    if (!scanCode.trim()) return
    
    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: scanCode,
          type,
          institutionId: 'demo' // Would come from session
        })
      })
      
      const data = await res.json()
      
      if (data.success) {
        setResult({ success: true, data })
        setRecentScans(prev => [data.attendance, ...prev.slice(0, 9)])
      } else {
        setResult({ success: false, error: data.error })
      }
    } catch (e) {
      setResult({ success: false, error: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Escanear QR</h1>
          <p className="text-slate-400">Escanea o ingresa el código del estudiante</p>
        </div>
        
        {/* Scanner UI (placeholder) */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-500">Escáner no disponible</p>
                <p className="text-xs text-slate-600 mt-2">Usa el campo debajo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Entrada Manual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Código QR o número de estudiante..."
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              className="bg-slate-700 border-slate-600 text-lg"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleScan('in')} 
                disabled={loading || !scanCode.trim()}
                className="bg-green-500 hover:bg-green-600"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Entrada
              </Button>
              <Button 
                onClick={() => handleScan('out')} 
                disabled={loading || !scanCode.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                Salida
              </Button>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg ${result.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {result.success ? (
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="font-bold">{result.data?.student?.name}</p>
                    <p className="text-sm text-slate-400">
                      {result.data?.type === 'in' ? 'Entrada registrada' : 'Salida registrada'}
                    </p>
                    <Badge className="mt-2 bg-green-500">
                      {result.data?.status === 'on_time' ? 'A tiempo' : 'Tarde'}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center text-red-400">
                    <XCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{result.error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentScans.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Sin escaneos recientes</p>
              ) : (
                recentScans.map((scan, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="font-medium">{scan.student?.name || 'Estudiante'}</p>
                      <p className="text-xs text-slate-400">{scan.time}</p>
                    </div>
                    <Badge className={scan.type === 'in' ? 'bg-green-500' : 'bg-orange-500'}>
                      {scan.type === 'in' ? 'Entrada' : 'Salida'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}