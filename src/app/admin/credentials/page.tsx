'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QrCode, Download, Printer, Mail, Camera, User, FileText } from 'lucide-react'

interface StudentData {
  id: string
  name: string
  code: string
  photo: string
  level: string
  group: string
  institution: {
    name: string
    logo: string
    brandColor: string
  }
}

export default function CredentialPage() {
  const router = useRouter()
  const [searchCode, setSearchCode] = useState('')
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(false)

  const searchStudent = async () => {
    if (!searchCode) return
    setLoading(true)
    
    try {
      const res = await fetch(`/api/students?search=${searchCode}`)
      const data = await res.json()
      
      if (data.students?.[0]) {
        setStudent(data.students[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const downloadCredential = () => {
    // Implementation for download - would generate image/PDF
    alert('Funcionalidad de descarga en desarrollo')
  }

  const printCredential = () => {
    window.print()
  }

  const sendCredentialEmail = async () => {
    if (!student) return
    
    try {
      const res = await fetch('/api/students/send-credential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        alert('Credencial enviada por email')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Credenciales</h1>
        
        {/* Search */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Buscar Estudiante</CardTitle>
            <CardDescription>Ingresa el código o nombre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Código o nombre..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchStudent()}
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={searchStudent} disabled={loading}>
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Credential Preview */}
        {student && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Credencial</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-white text-black rounded-lg p-6 max-w-sm mx-auto"
                style={{ borderTop: `4px solid ${student.institution.brandColor || '#3b82f6'}` }}
              >
                {/* Photo */}
                <div className="flex justify-center mb-4">
                  {student.photo ? (
                    <img src={student.photo} alt={student.name} className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <Camera className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="text-center">
                  <h2 className="text-xl font-bold">{student.name}</h2>
                  <p className="text-gray-600">{student.level} - {student.group}</p>
                  <p className="text-sm text-gray-500 mt-2">{student.code}</p>
                </div>
                
                {/* QR Code */}
                <div className="flex justify-center mt-4">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <QrCode className="h-12 w-12" />
                  </div>
                </div>
                
                {/* Institution */}
                <p className="text-center text-xs text-gray-500 mt-4">
                  {student.institution.name}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 mt-4 justify-center">
                <Button onClick={downloadCredential} className="bg-blue-500">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
                <Button onClick={printCredential} className="bg-green-500">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
                <Button onClick={sendCredentialEmail} className="bg-purple-500">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}