'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QrCode, Download, Printer, Mail, Camera, User, Search } from 'lucide-react'

interface StudentData {
  id: string
  name: string
  code: string
  photo: string
  level: string
  group: string
  cedula: string
  institution: {
    name: string
    logo: string
    brandColor: string
  }
}

export default function CredentialPage() {
  const [searchCode, setSearchCode] = useState('')
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [downloading, setDownloading] = useState(false)
  const credentialRef = useRef<HTMLDivElement>(null)

  const searchStudent = useCallback(async () => {
    if (!searchCode) return
    setLoading(true)
    setQrDataUrl('')

    try {
      const res = await fetch(`/api/students?institutionId=demo&search=${searchCode}`)
      const data = await res.json()

      if (data.students?.[0]) {
        const s = data.students[0]
        setStudent({
          id: s.id,
          name: s.name,
          code: s.code,
          photo: s.photo,
          level: s.level,
          group: s.group,
          cedula: s.cedula,
          institution: {
            name: 'Instituto Demo',
            logo: '',
            brandColor: '#d97706'
          }
        })

        // Generate real QR code
        try {
          const QRCode = (await import('qrcode')).default
          const qrUrl = await QRCode.toDataURL(s.code, {
            width: 200,
            margin: 2,
            color: { dark: '#1a0f0a', light: '#ffffff' }
          })
          setQrDataUrl(qrUrl)
        } catch (err) {
          console.error('QR generation error:', err)
        }
      } else {
        setStudent(null)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [searchCode])

  const downloadCredential = async () => {
    if (!credentialRef.current) return
    setDownloading(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(credentialRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      })

      const link = document.createElement('a')
      link.download = `credencial-${student?.name?.replace(/\s+/g, '-').toLowerCase() || 'estudiante'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const printCredential = () => {
    window.print()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Credenciales</h1>
        <p className="text-[hsl(28,10%,55%)] mt-1">Busca un estudiante para generar su credencial con código QR</p>
      </div>

      {/* Search */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Buscar Estudiante</CardTitle>
          <CardDescription className="text-[hsl(28,10%,55%)]">Ingresa el código, nombre o cédula</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Código, nombre o cédula..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchStudent()}
              className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
            />
            <Button
              onClick={searchStudent}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credential Preview */}
      {student && (
        <>
          <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
            <CardHeader>
              <CardTitle className="text-base">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {/* Credential Card */}
              <div
                ref={credentialRef}
                className="bg-white text-black rounded-2xl p-6 w-full max-w-sm shadow-xl"
                style={{ borderTop: `5px solid ${student.institution.brandColor || '#d97706'}` }}
              >
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 mb-1">
                    {student.institution.logo ? (
                      <img src={student.institution.logo} alt="Logo" className="w-8 h-8 object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: student.institution.brandColor || '#d97706' }}>
                        <span className="text-white text-xs font-bold">SA</span>
                      </div>
                    )}
                    <span className="font-bold text-sm text-gray-700">{student.institution.name}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 tracking-wider uppercase">Credencial de Estudiante</p>
                </div>

                {/* Photo */}
                <div className="flex justify-center mb-4">
                  {student.photo ? (
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-28 h-28 rounded-2xl object-cover shadow-lg border-4 border-gray-100"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-2xl bg-gray-100 flex items-center justify-center border-4 border-gray-50">
                      <Camera className="h-10 w-10 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                  <p className="text-sm text-gray-500">{student.level || 'Nivel'} - {student.group || 'Grupo'}</p>
                  {student.cedula && (
                    <p className="text-xs text-gray-400">CI: {student.cedula}</p>
                  )}
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-2"
                    style={{ backgroundColor: `${student.institution.brandColor || '#d97706'}20`, color: student.institution.brandColor || '#d97706' }}>
                    {student.code}
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mt-4">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 rounded-lg" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Footer */}
                <p className="text-center text-[9px] text-gray-300 mt-3">
                  Este documento es propiedad de {student.institution.name}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={downloadCredential}
              disabled={downloading}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
            >
              {downloading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {downloading ? 'Generando...' : 'Descargar PNG'}
            </Button>
            <Button
              onClick={printCredential}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              className="border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]"
            >
              <Mail className="h-4 w-4 mr-2" />
              Enviar Email
            </Button>
          </div>
        </>
      )}

      {/* No result hint */}
      {!student && !loading && searchCode && (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" />
          <p className="text-[hsl(28,10%,55%)]">No se encontró ningún estudiante</p>
          <p className="text-sm text-[hsl(28,10%,45%)] mt-1">Intenta con otro código o nombre</p>
        </div>
      )}
    </div>
  )
}
