'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QrCode, CheckCircle, XCircle, Loader2, ArrowRight, ArrowLeft, Clock, History } from 'lucide-react'
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

  const handleScan = async (type: 'in' | 'out') => {
    const code = qrCode.trim()
    if (!code) {
      toast.error('Ingresa un codigo de estudiante')
      return
    }
    if (!institutionId) {
      toast.error('No se pudo determinar la institucion')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: code, type })
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
      } else {
        setResult({ success: false, error: data.error || 'Error desconocido' })
        if (data.code !== 'ALREADY_SCANNED') {
          toast.error(data.error || 'Error al registrar')
        } else {
          toast.warning(data.error || 'Ya registrado')
        }
      }
    } catch {
      setResult({ success: false, error: 'Error de conexion' })
      toast.error('Error de conexion con el servidor')
    } finally {
      setLoading(false)
    }
  }

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

      {/* Scanner Card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          {/* QR Placeholder Visual */}
          <div className="aspect-[2/1] bg-stone-50 dark:bg-stone-900/50 rounded-xl flex items-center justify-center mb-5 border-2 border-dashed border-stone-200 dark:border-stone-700">
            <div className="text-center">
              <QrCode className="h-14 w-14 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 dark:text-stone-500 text-sm font-medium">Escanner no disponible</p>
              <p className="text-stone-300 dark:text-stone-600 text-xs mt-1">Usa el campo debajo para entrada manual</p>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-4">
            <div className="relative">
              <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Codigo QR o numero de estudiante..."
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading && qrCode.trim()) {
                    handleScan('in')
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
                onClick={() => handleScan('in')}
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
                onClick={() => handleScan('out')}
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
