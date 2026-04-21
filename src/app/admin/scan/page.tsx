'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QrCode, Camera, Clock } from 'lucide-react'

export default function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState<any>(null)
  const [recentScans, setRecentScans] = useState<any[]>([])

  // Simulate real-time scanning
  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        // Simulated scan result
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [scanning])

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Escanear QR</h1>
          <p className="text-slate-400">Escanea la credencial del estudiante</p>
        </div>
        
        {/* QrCode */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="aspect-square bg-slate-700 rounded-lg flex items-center justify-center mb-4">
              {scanning ? (
                <div className="text-center">
                  <div className="animate-pulse">
                    <Camera className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-400">Escaneando...</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-500">Listo para escanear</p>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-blue-500 hover:bg-blue-600"
              onClick={() => setScanning(!scanning)}
            >
              {scanning ? 'Detener' : 'Iniciar Escaner'}
            </Button>
          </CardContent>
        </Card>
        
        {/* Manual Entry */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg">Entrada Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Código de estudiante..."
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Marcar Entrada
              </Button>
              <Button className="w-full bg-orange-500 hover:bg-orange-600">
                Marcar Salida
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Scans */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentScans.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  Sin escaneos recientes
                </p>
              ) : (
                recentScans.map((scan, i) => (
                  <div key={i} className="p-3 bg-slate-700 rounded-lg flex justify-between">
                    <span>{scan.name}</span>
                    <span className={scan.type === 'in' ? 'text-green-400' : 'text-orange-400'}>
                      {scan.type === 'in' ? 'Entrada' : 'Salida'}
                    </span>
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