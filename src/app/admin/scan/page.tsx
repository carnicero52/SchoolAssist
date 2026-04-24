'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QrCode, CheckCircle, XCircle, Loader2, ArrowRight, ArrowLeft, Clock, History, Camera, CameraOff, Keyboard } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface ScanResult {
  success: boolean
  data?: {
    id: string
    type: 'in' | 'out'
    status: 'on_time' | 'late'
    time: string
    student: {
      id: string
      name: string
      photo: string | null
      level: string | null
      group: string | null
    }
  }
  error?: string
}

interface RecentScan {
  studentName: string
  type: 'in' | 'out'
  status: 'on_time' | 'late'
  time: string
  timestamp: number
}

export default function ScanPage() {
  const { institutionId } = useAuth()
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false)
  const [scannerMode, setScannerMode] = useState<'camera' | 'manual'>('camera')
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const scannerRef = useRef<any>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  // Default scan type
  const [scanType, setScanType] = useState<'in' | 'out'>('in')

  const handleScan = useCallback(async (code: string, type: 'in' | 'out') => {
    const trimmedCode = code.trim()
    if (!trimmedCode) {
      toast.error('Ingresa un codigo de estudiante')
      return
    }
    if (!institutionId) {
      toast.error('No se pudo determinar la institucion')
      return
    }

    // Prevent duplicate scans within 3 seconds
    if (lastScannedCode === trimmedCode) {
      return
    }
    setLastScannedCode(trimmedCode)
    setTimeout(() => setLastScannedCode(null), 3000)

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: trimmedCode, type })
      })

      const data = await res.json()

      if (data.success) {
        const attendance = data.attendance
        setResult({
          success: true,
          data: {
            id: attendance.id,
            type: attendance.type,
            status: attendance.status,
            time: attendance.time,
            student: attendance.student
          }
        })
        setRecentScans(prev => [
          {
            studentName: attendance.student?.name || 'Estudiante',
            type: attendance.type,
            status: attendance.status,
            time: new Date(attendance.time).toLocaleTimeString('es-VE', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }),
            timestamp: Date.now()
          },
          ...prev.slice(0, 19)
        ])
        toast.success(
          `${attendance.student?.name} - ${type === 'in' ? 'Entrada' : 'Salida'} registrada`,
          { description: attendance.status === 'on_time' ? 'A tiempo' : 'Tarde' }
        )
        setQrCode('')
        if (navigator.vibrate) navigator.vibrate(100)
      } else {
        setResult({ success: false, error: data.error || 'Error desconocido' })
        if (data.code !== 'ALREADY_SCANNED') {
          toast.error(data.error || 'Error al registrar')
        } else {
          toast.warning(data.error || 'Ya registrado')
        }
        if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      }
    } catch {
      setResult({ success: false, error: 'Error de conexion' })
      toast.error('Error de conexion con el servidor')
    } finally {
      setLoading(false)
    }
  }, [institutionId, lastScannedCode])

  // Initialize camera scanner
  useEffect(() => {
    if (scannerMode !== 'camera' || !scannerActive) return

    let scannerInstance: any = null
    let mounted = true

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (!mounted || !scannerContainerRef.current) return

        scannerInstance = new Html5Qrcode('qr-reader')
        scannerRef.current = scannerInstance

        await scannerInstance.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText: string) => {
            handleScan(decodedText, scanType)
          },
          () => {
            // QR not found in this frame - ignore
          }
        )

        if (mounted) {
          setCameraError(null)
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Camera error:', err)
          setCameraError(err?.message || 'No se pudo acceder a la camara')
          setScannerActive(false)
        }
      }
    }

    initScanner()

    return () => {
      mounted = false
      if (scannerInstance) {
        try {
          scannerInstance.stop().then(() => {
            scannerInstance.clear()
          }).catch(() => {})
        } catch {
          // ignore
        }
      }
    }
  }, [scannerMode, scannerActive, scanType, handleScan])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear()
          }).catch(() => {})
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        // ignore
      }
      scannerRef.current = null
    }
    setScannerActive(false)
  }, [])

  const toggleScanner = useCallback(() => {
    if (scannerActive) {
      stopScanner()
    } else {
      setCameraError(null)
      setScannerActive(true)
    }
  }, [scannerActive, stopScanner])

  const switchToManual = useCallback(() => {
    stopScanner()
    setScannerMode('manual')
  }, [stopScanner])

  const switchToCamera = useCallback(() => {
    setScannerMode('camera')
    setCameraError(null)
    setScannerActive(true)
  }, [])

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return '--:--'
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-6 w-6 text-teal-600" />
          Escanear QR
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Escanea o ingresa el codigo del estudiante para registrar asistencia
        </p>
      </div>

      {/* Scan Type Toggle */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-muted-foreground">Tipo de registro:</span>
            <div className="flex gap-2 ml-auto">
              <Button
                size="sm"
                variant={scanType === 'in' ? 'default' : 'outline'}
                className={scanType === 'in' ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}
                onClick={() => setScanType('in')}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Entrada
              </Button>
              <Button
                size="sm"
                variant={scanType === 'out' ? 'default' : 'outline'}
                className={scanType === 'out' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                onClick={() => setScanType('out')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Salida
              </Button>
            </div>
          </div>

          {/* Mode Switch */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={scannerMode === 'camera' ? 'secondary' : 'ghost'}
              className={scannerMode === 'camera' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : ''}
              onClick={switchToCamera}
            >
              <Camera className="h-4 w-4 mr-1" />
              Camara
            </Button>
            <Button
              size="sm"
              variant={scannerMode === 'manual' ? 'secondary' : 'ghost'}
              className={scannerMode === 'manual' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : ''}
              onClick={switchToManual}
            >
              <Keyboard className="h-4 w-4 mr-1" />
              Manual
            </Button>
          </div>

          {/* Camera Scanner */}
          {scannerMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black">
                {scannerActive ? (
                  <div id="qr-reader" ref={scannerContainerRef} className="w-full" style={{ minHeight: '280px' }} />
                ) : (
                  <div className="aspect-[4/3] flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-900/50 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
                    <Camera className="h-14 w-14 text-stone-300 dark:text-stone-600 mb-3" />
                    <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">Camara inactiva</p>
                    <p className="text-stone-300 dark:text-stone-600 text-xs mt-1">Presiona el boton para activar</p>
                  </div>
                )}
                {loading && scannerActive && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    {cameraError}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 text-xs"
                    onClick={switchToManual}
                  >
                    Usar entrada manual
                  </Button>
                </div>
              )}

              <Button
                onClick={toggleScanner}
                className={`w-full h-12 text-white shadow-md transition-all ${
                  scannerActive
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                    : 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20'
                }`}
                size="lg"
                disabled={!!cameraError && !scannerActive}
              >
                {scannerActive ? (
                  <>
                    <CameraOff className="h-5 w-5 mr-2" />
                    Detener Camara
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Activar Camara
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Manual Input */}
          {scannerMode === 'manual' && (
            <div className="space-y-4">
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="Codigo QR o numero de estudiante..."
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && qrCode.trim()) {
                      handleScan(qrCode, scanType)
                    }
                  }}
                  className="pl-10 h-12 text-base"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleScan(qrCode, 'in')}
                  disabled={loading || !qrCode.trim()}
                  className="h-12 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 transition-all"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Entrada
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleScan(qrCode, 'out')}
                  disabled={loading || !qrCode.trim()}
                  className="h-12 bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowLeft className="h-5 w-5 mr-2" />
                      Salida
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Card */}
      {result && (
        <Card className={`border-0 shadow-sm overflow-hidden ${
          result.success
            ? 'ring-2 ring-teal-500/30'
            : 'ring-2 ring-red-500/30'
        }`}>
          <div className={`h-1.5 ${
            result.success ? 'bg-teal-500' : 'bg-red-500'
          }`} />
          <CardContent className="pt-5">
            {result.success && result.data ? (
              <div className="text-center space-y-3">
                <CheckCircle className="h-12 w-12 text-teal-600 mx-auto" />
                <div>
                  <p className="text-xl font-bold text-foreground">{result.data.student?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {result.data.type === 'in' ? 'Entrada registrada' : 'Salida registrada'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Badge className={
                    result.data.status === 'on_time'
                      ? 'bg-teal-600 hover:bg-teal-700'
                      : 'bg-amber-500 hover:bg-amber-600'
                  }>
                    {result.data.status === 'on_time' ? 'A tiempo' : 'Tarde'}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-sm">{formatTime(result.data.time)}</span>
                  </div>
                </div>
                {(result.data.student?.level || result.data.student?.group) && (
                  <p className="text-xs text-muted-foreground">
                    {[result.data.student.level, result.data.student.group].filter(Boolean).join(' - ')}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <p className="text-red-600 dark:text-red-400 font-medium">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Scans */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4 text-teal-600" />
            Escaneos Recientes
          </CardTitle>
          <CardDescription>
            {recentScans.length > 0
              ? `${recentScans.length} registro${recentScans.length !== 1 ? 's' : ''} en esta sesion`
              : 'Sin escaneos en esta sesion'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <div className="py-8 text-center">
              <QrCode className="h-10 w-10 text-stone-200 dark:text-stone-700 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Los escaneos apareceran aqui</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentScans.map((scan, i) => (
                <div
                  key={scan.timestamp + '-' + i}
                  className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-900/40 hover:bg-stone-100 dark:hover:bg-stone-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      scan.type === 'in'
                        ? 'bg-teal-100 dark:bg-teal-900/30'
                        : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      {scan.type === 'in'
                        ? <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        : <ArrowLeft className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-sm">{scan.studentName}</p>
                      <p className="text-xs text-muted-foreground">{scan.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        scan.type === 'in'
                          ? 'border-teal-300 text-teal-700 dark:border-teal-700 dark:text-teal-400'
                          : 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {scan.type === 'in' ? 'Entrada' : 'Salida'}
                    </Badge>
                    {scan.status === 'late' && (
                      <Badge variant="outline" className="text-xs border-amber-400 text-amber-600 dark:border-amber-600 dark:text-amber-400">
                        Tarde
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {recentScans.length > 0 && (
            <>
              <Separator className="my-3" />
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => setRecentScans([])}
              >
                Limpiar historial
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
