'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScanLine, Camera, CheckCircle, XCircle, Loader2, Keyboard, RotateCcw, Vibrate } from 'lucide-react'

export default function ScanPage() {
  const [scanCode, setScanCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recentScans, setRecentScans] = useState<any[]>([])
  const [scanType, setScanType] = useState<'in' | 'out'>('in')
  const [scannerMode, setScannerMode] = useState<'camera' | 'manual'>('camera')
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const scannerRef = useRef<any>(null)
  const html5QrCodeRef = useRef<any>(null)

  // Initialize camera scanner
  useEffect(() => {
    if (scannerMode === 'camera' && !html5QrCodeRef.current) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [scannerMode])

  const startCamera = async () => {
    setCameraError('')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const html5QrCode = new Html5Qrcode('qr-reader')
      html5QrCodeRef.current = html5QrCode

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          handleScanResult(decodedText)
        },
        () => {} // Ignore scan failures
      )
      setCameraActive(true)
    } catch (err: any) {
      console.error('Camera error:', err)
      setCameraError('No se pudo acceder a la cámara. Usa entrada manual.')
      setScannerMode('manual')
    }
  }

  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current) {
        const state = html5QrCodeRef.current.getState()
        if (state === 2) { // SCANNING state
          await html5QrCodeRef.current.stop()
        }
        html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
      }
    } catch (e) {
      console.error('Stop camera error:', e)
    }
    setCameraActive(false)
  }

  const handleScanResult = async (code: string) => {
    // Vibrate on scan
    if (navigator.vibrate) navigator.vibrate(200)

    // Prevent duplicate scans
    if (loading) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: code,
          type: scanType,
          institutionId: 'demo'
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
      // Clear input after scan
      setScanCode('')
    }
  }

  const handleManualScan = () => {
    if (!scanCode.trim()) return
    handleScanResult(scanCode.trim())
  }

  const toggleScannerMode = async () => {
    if (scannerMode === 'camera') {
      await stopCamera()
      setScannerMode('manual')
    } else {
      setScannerMode('camera')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Escanear QR</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">Registra entrada o salida del estudiante</p>
        </div>

        {/* Entry/Exit Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={() => setScanType('in')}
            variant={scanType === 'in' ? 'default' : 'outline'}
            className={scanType === 'in'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'
            }
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Entrada
          </Button>
          <Button
            onClick={() => setScanType('out')}
            variant={scanType === 'out' ? 'default' : 'outline'}
            className={scanType === 'out'
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]'
            }
          >
            <XCircle className="h-4 w-4 mr-2" />
            Salida
          </Button>
        </div>
      </div>

      {/* Scanner Card */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-amber-400" />
              {scanType === 'in' ? 'Registrar Entrada' : 'Registrar Salida'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleScannerMode}
              className="text-[hsl(28,10%,55%)] hover:text-amber-400"
            >
              {scannerMode === 'camera' ? <Keyboard className="h-4 w-4 mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
              {scannerMode === 'camera' ? 'Manual' : 'Cámara'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scannerMode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera viewer */}
              <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                <div id="qr-reader" className="w-full h-full" />
                {!cameraActive && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Camera className="h-12 w-12 text-[hsl(28,10%,45%)] mb-4" />
                    <p className="text-[hsl(28,10%,55%)] text-sm">{cameraError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-[hsl(24,18%,22%)] text-amber-400 hover:bg-[hsl(24,18%,18%)]"
                      onClick={() => setScannerMode('manual')}
                    >
                      Usar entrada manual
                    </Button>
                  </div>
                )}
                {/* Scan overlay */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-[hsl(28,10%,55%)]">
                Apunta la cámara al código QR del estudiante
              </p>
            </div>
          ) : (
            /* Manual Entry */
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Código QR o número de estudiante..."
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)] text-lg"
                  autoFocus
                />
                <Button
                  onClick={handleManualScan}
                  disabled={loading || !scanCode.trim()}
                  className={scanType === 'in'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ScanLine className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-center text-sm text-[hsl(28,10%,55%)]">
                Escribe el código del estudiante y presiona Enter o el botón de escaneo
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className={`border-2 ${result.success ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
          <CardContent className="pt-6">
            {result.success ? (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <p className="text-xl font-bold">{result.data?.student?.name}</p>
                <p className="text-[hsl(28,10%,55%)] mt-1">
                  {result.data?.type === 'in' ? 'Entrada registrada' : 'Salida registrada'}
                </p>
                <div className="flex justify-center gap-3 mt-3">
                  <Badge className={result.data?.status === 'on_time' ? 'bg-green-600' : 'bg-orange-600'}>
                    {result.data?.status === 'on_time' ? 'A tiempo' : 'Tarde'}
                  </Badge>
                  {result.data?.student?.level && (
                    <Badge className="bg-amber-600">{result.data.student.level}</Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-red-400">{result.error}</p>
              </div>
            )}
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Escanear otro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Camera className="h-5 w-5 text-amber-400" />
            Escaneos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentScans.length === 0 ? (
              <p className="text-center text-[hsl(28,10%,45%)] py-6">Sin escaneos recientes</p>
            ) : (
              recentScans.map((scan, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                  <div className="flex items-center gap-3">
                    {scan.student?.photo ? (
                      <img src={scan.student.photo} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[hsl(24,15%,20%)] flex items-center justify-center">
                        <ScanLine className="h-4 w-4 text-[hsl(28,10%,45%)]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{scan.student?.name || 'Estudiante'}</p>
                      <p className="text-xs text-[hsl(28,10%,55%)]">
                        {scan.time ? new Date(scan.time).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={scan.status === 'on_time' ? 'bg-green-600' : 'bg-orange-600'}>
                      {scan.status === 'on_time' ? 'A tiempo' : 'Tarde'}
                    </Badge>
                    <Badge className={scan.type === 'in' ? 'bg-blue-600' : 'bg-purple-600'}>
                      {scan.type === 'in' ? 'Entrada' : 'Salida'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
