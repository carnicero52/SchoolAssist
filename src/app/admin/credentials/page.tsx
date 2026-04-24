'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { QrCode, Download, Printer, Mail, Search, User, Building2, GraduationCap, Users, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface StudentData {
  id: string
  name: string
  code: string
  photo: string | null
  level: string | null
  group: string | null
  email: string | null
  cedula: string | null
  guardianName: string | null
  guardianEmail: string | null
  qrCode: string | null
}

export default function CredentialPage() {
  const { user, institutionId } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<StudentData[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [searching, setSearching] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const credentialRef = useRef<HTMLDivElement>(null)

  // Generate QR code when student is selected
  useEffect(() => {
    if (!selectedStudent) {
      setQrDataUrl(null)
      return
    }

    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default
        const codeToEncode = selectedStudent.qrCode || selectedStudent.code
        const dataUrl = await QRCode.toDataURL(codeToEncode, {
          width: 200,
          margin: 1,
          color: {
            dark: '#1c1917',
            light: '#ffffff'
          }
        })
        setQrDataUrl(dataUrl)
      } catch (err) {
        console.error('QR generation error:', err)
        setQrDataUrl(null)
      }
    }

    generateQR()
  }, [selectedStudent])

  const searchStudent = async () => {
    const query = searchQuery.trim()
    if (!query) {
      toast.error('Ingresa un codigo o nombre para buscar')
      return
    }

    setSearching(true)
    setHasSearched(true)

    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(query)}&limit=10`)
      const data = await res.json()

      if (data.students && data.students.length > 0) {
        // Fetch QR code for each student
        const studentsWithQR = await Promise.all(
          data.students.map(async (s: any) => {
            try {
              const qrRes = await fetch(`/api/students/${s.id}/qr`)
              if (qrRes.ok) {
                const qrData = await qrRes.json()
                return { ...s, qrCode: qrData.code || null }
              }
            } catch {
              // ignore
            }
            return { ...s, qrCode: null }
          })
        )
        setSearchResults(studentsWithQR)
        if (studentsWithQR.length === 1) {
          setSelectedStudent(studentsWithQR[0])
        }
      } else {
        setSearchResults([])
        toast.info('No se encontraron estudiantes')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setSearching(false)
    }
  }

  const printCredential = () => {
    window.print()
  }

  const downloadCredential = async () => {
    if (!selectedStudent) return

    // Try to use canvas-based image download
    try {
      const html2canvas = (await import('html2canvas')).default
      if (credentialRef.current) {
        const canvas = await html2canvas(credentialRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: true,
        })
        const link = document.createElement('a')
        link.download = `credencial-${selectedStudent.code}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        toast.success('Credencial descargada como imagen')
        return
      }
    } catch {
      // Fallback to text download
    }

    // Fallback: text file
    const content = [
      'CREDENCIAL ESCOLAR',
      '===================',
      '',
      `Institucion: ${user?.institutionName || 'N/A'}`,
      `Nombre: ${selectedStudent.name}`,
      `Codigo: ${selectedStudent.code}`,
      `Cedula: ${selectedStudent.cedula || 'N/A'}`,
      `Nivel: ${selectedStudent.level || 'N/A'}`,
      `Grupo: ${selectedStudent.group || 'N/A'}`,
      '',
      `Apoderado: ${selectedStudent.guardianName || 'N/A'}`,
      `Email Apoderado: ${selectedStudent.guardianEmail || 'N/A'}`,
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `credencial-${selectedStudent.code}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Credencial descargada')
  }

  const sendCredentialEmail = async () => {
    if (!selectedStudent) return

    setSendingEmail(true)
    try {
      const res = await fetch(`/api/students/${selectedStudent.id}/credential`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId })
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Credencial enviada por email', {
          description: `Enviada a ${selectedStudent.guardianEmail || selectedStudent.email || 'correo registrado'}`
        })
      } else {
        toast.error(data.error || 'Error al enviar la credencial')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <QrCode className="h-6 w-6 text-teal-600" />
          Credenciales
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Busca un estudiante para generar, imprimir o enviar su credencial
        </p>
      </div>

      {/* Search Card */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-teal-600" />
            Buscar Estudiante
          </CardTitle>
          <CardDescription>Ingresa el codigo, nombre o cedula del estudiante</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Codigo, nombre o cedula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchStudent()}
                className="pl-10"
              />
            </div>
            <Button
              onClick={searchStudent}
              disabled={searching || !searchQuery.trim()}
              className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
            >
              {searching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 1 && (
            <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
              <p className="text-xs text-muted-foreground font-medium mb-2">
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} - Selecciona un estudiante:
              </p>
              {searchResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                    selectedStudent?.id === s.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-300 dark:ring-teal-700'
                      : 'bg-stone-50 dark:bg-stone-900/40 hover:bg-stone-100 dark:hover:bg-stone-900/60'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0 overflow-hidden">
                    {s.photo ? (
                      <img src={s.photo} alt={s.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{s.code}</p>
                  </div>
                  {(s.level || s.group) && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {[s.level, s.group].filter(Boolean).join(' - ')}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {hasSearched && searchResults.length === 0 && !searching && (
            <div className="mt-3 text-center py-4">
              <p className="text-muted-foreground text-sm">No se encontraron estudiantes con esa busqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credential Preview */}
      {selectedStudent && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Vista Previa de Credencial</CardTitle>
            <CardDescription>Asi se vera la credencial del estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Credential Card */}
            <div
              id="credential-card"
              ref={credentialRef}
              className="bg-white dark:bg-stone-900 text-black dark:text-white rounded-2xl overflow-hidden shadow-xl max-w-sm mx-auto border border-stone-200 dark:border-stone-700 print:shadow-none print:border-stone-300"
            >
              {/* Top accent bar */}
              <div className="h-2 bg-gradient-to-r from-teal-600 to-teal-500" />

              {/* Institution header */}
              <div className="px-5 pt-4 pb-2 flex items-center gap-2.5 border-b border-stone-100 dark:border-stone-800">
                <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                    {user?.institutionName || 'Institucion'}
                  </p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
                    Credencial Escolar
                  </p>
                </div>
              </div>

              {/* Student Info */}
              <div className="px-5 py-5">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="shrink-0">
                    <div className="h-20 w-20 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center ring-2 ring-teal-200 dark:ring-teal-700 overflow-hidden">
                      {selectedStudent.photo ? (
                        <img
                          src={selectedStudent.photo}
                          alt={selectedStudent.name}
                          className="h-20 w-20 object-cover rounded-xl"
                        />
                      ) : (
                        <User className="h-10 w-10 text-teal-300 dark:text-teal-600" />
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
                      {selectedStudent.name}
                    </h2>
                    {selectedStudent.cedula && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                        CI: {selectedStudent.cedula}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {selectedStudent.level && (
                        <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 text-[11px] border-0">
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {selectedStudent.level}
                        </Badge>
                      )}
                      {selectedStudent.group && (
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 text-[11px] border-0">
                          <Users className="h-3 w-3 mr-1" />
                          {selectedStudent.group}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code */}
                <div className="mt-4 p-2.5 bg-stone-50 dark:bg-stone-800 rounded-lg text-center">
                  <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider font-medium">Codigo</p>
                  <p className="text-lg font-bold font-mono text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedStudent.code}
                  </p>
                </div>

                {/* QR Code - Real generated QR */}
                <div className="flex justify-center mt-4">
                  {qrDataUrl ? (
                    <div className="bg-white rounded-xl p-2 ring-1 ring-stone-200 dark:ring-stone-700">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code - ${selectedStudent.code}`}
                        className="h-28 w-28"
                      />
                    </div>
                  ) : (
                    <div className="h-28 w-28 bg-stone-50 dark:bg-stone-800 rounded-xl flex items-center justify-center border-2 border-dashed border-stone-200 dark:border-stone-700">
                      <Loader2 className="h-8 w-8 animate-spin text-stone-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800">
                <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
                  Esta credencial es propiedad de {user?.institutionName || 'la institucion'}.
                  En caso de extravio contactar a la administracion.
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                onClick={downloadCredential}
                variant="outline"
                size="sm"
                className="border-stone-200 dark:border-stone-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
              <Button
                onClick={printCredential}
                variant="outline"
                size="sm"
                className="border-stone-200 dark:border-stone-700"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button
                onClick={sendCredentialEmail}
                disabled={sendingEmail}
                className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
                size="sm"
              >
                {sendingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Enviar Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedStudent && !hasSearched && (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <QrCode className="h-16 w-16 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Busca un estudiante para ver su credencial</p>
            <p className="text-muted-foreground text-sm mt-1">
              Ingresa un codigo, nombre o cedula en el campo de busqueda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
