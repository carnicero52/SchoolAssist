'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Search, Download, User, Pencil, X, Upload, Link as LinkIcon, Camera } from 'lucide-react'

interface Student {
  id: string
  code: string
  name: string
  cedula: string
  photo: string
  email: string
  phone: string
  level: string
  group: string
  telegramChatId: string
  whatsappPhone: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  totalAttendances: number
  totalAbsences: number
  totalLates: number
}

const emptyForm = {
  name: '', cedula: '', email: '', phone: '',
  guardianName: '', guardianPhone: '', guardianEmail: '',
  telegramChatId: '', whatsappPhone: '',
  photo: '', levelId: '', groupId: ''
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('url')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const institutionId = 'demo'

  useEffect(() => { loadData() }, [search])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/students?institutionId=${institutionId}&search=${search}`)
      const data = await res.json()
      setStudents(data.students || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)

      const res = await fetch('/api/upload/photo', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.url) {
        setForm({ ...form, photo: data.url })
      }
    } catch (e) {
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name) return

    try {
      if (editingId) {
        // Update
        await fetch(`/api/students?id=${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ institutionId, ...form })
        })
      } else {
        // Create
        await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ institutionId, ...form })
        })
      }

      setForm(emptyForm)
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = (student: Student) => {
    setForm({
      name: student.name,
      cedula: student.cedula || '',
      email: student.email || '',
      phone: student.phone || '',
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '',
      guardianEmail: student.guardianEmail || '',
      telegramChatId: student.telegramChatId || '',
      whatsappPhone: student.whatsappPhone || '',
      photo: student.photo || '',
      levelId: '',
      groupId: ''
    })
    setEditingId(student.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este estudiante?')) return
    try {
      await fetch(`/api/students?id=${id}`, { method: 'DELETE' })
      loadData()
    } catch (e) { console.error(e) }
  }

  const exportCSV = async () => {
    window.open(`/api/export/students?institutionId=${institutionId}&format=csv`, '_blank')
  }

  const cancelForm = () => {
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Estudiantes</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">{students.length} estudiantes registrados</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" className="border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(!showForm) }} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(28,10%,45%)]" />
        <Input
          placeholder="Buscar por nombre, código o cédula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]"
        />
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}</CardTitle>
              <Button variant="ghost" size="sm" onClick={cancelForm} className="text-[hsl(28,10%,55%)] hover:text-red-400">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Photo Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(30,30%,85%)]">Foto del Estudiante</label>
                <div className="flex items-start gap-4">
                  {/* Photo Preview */}
                  <div className="w-24 h-24 rounded-2xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {form.photo ? (
                      <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="h-8 w-8 text-[hsl(28,10%,45%)]" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* Mode Toggle */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={photoMode === 'url' ? 'default' : 'outline'}
                        onClick={() => setPhotoMode('url')}
                        className={photoMode === 'url' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(28,10%,55%)]'}
                      >
                        <LinkIcon className="h-3 w-3 mr-1" /> URL
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={photoMode === 'upload' ? 'default' : 'outline'}
                        onClick={() => setPhotoMode('upload')}
                        className={photoMode === 'upload' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'border-[hsl(24,18%,22%)] text-[hsl(28,10%,55%)]'}
                      >
                        <Upload className="h-3 w-3 mr-1" /> Subir
                      </Button>
                    </div>
                    {photoMode === 'url' ? (
                      <Input
                        placeholder="https://ejemplo.com/foto.jpg"
                        value={form.photo}
                        onChange={(e) => setForm({ ...form, photo: e.target.value })}
                        className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                      />
                    ) : (
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="w-full border-[hsl(24,18%,22%)] text-[hsl(30,30%,85%)] hover:bg-[hsl(24,18%,18%)]"
                        >
                          {uploading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full mr-2" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          {uploading ? 'Subiendo...' : 'Seleccionar foto'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre completo *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                />
                <Input
                  placeholder="Cédula"
                  value={form.cedula}
                  onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                />
                <Input
                  placeholder="Email estudiante (opcional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                />
                <Input
                  placeholder="Teléfono estudiante"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                />
              </div>

              {/* Guardian Info */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(30,30%,85%)]">Datos del Apoderado</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Nombre apoderado"
                    value={form.guardianName}
                    onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
                    className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                  />
                  <Input
                    placeholder="Teléfono apoderado"
                    value={form.guardianPhone}
                    onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                    className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                  />
                  <Input
                    placeholder="Email apoderado"
                    value={form.guardianEmail}
                    onChange={(e) => setForm({ ...form, guardianEmail: e.target.value })}
                    className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                  />
                </div>
              </div>

              {/* Notification Channels */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-[hsl(30,30%,85%)]">Canales de Notificación</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Telegram Chat ID"
                    value={form.telegramChatId}
                    onChange={(e) => setForm({ ...form, telegramChatId: e.target.value })}
                    className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                  />
                  <Input
                    placeholder="WhatsApp (número)"
                    value={form.whatsappPhone}
                    onChange={(e) => setForm({ ...form, whatsappPhone: e.target.value })}
                    className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {editingId ? 'Guardar Cambios' : 'Registrar Estudiante'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students List */}
      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-base">
            <span>Lista de Estudiantes</span>
            <Badge className="bg-amber-600">{students.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(24,18%,22%)]">
                  <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Estudiante</th>
                  <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Cédula</th>
                  <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Nivel/Grupo</th>
                  <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Asist.</th>
                  <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Faltas</th>
                  <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Tarde</th>
                  <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Acción</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b border-[hsl(24,18%,22%)] hover:bg-[hsl(24,18%,18%)] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {student.photo ? (
                          <img src={student.photo} alt={student.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[hsl(24,15%,20%)] flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-[hsl(28,10%,45%)]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-[hsl(28,10%,55%)]">{student.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-[hsl(28,10%,55%)]">{student.cedula || '-'}</td>
                    <td className="p-3 text-sm text-[hsl(28,10%,55%)]">{student.level || '-'} {student.group || ''}</td>
                    <td className="p-3 text-center text-sm text-green-400">{student.totalAttendances}</td>
                    <td className="p-3 text-center text-sm text-red-400">{student.totalAbsences}</td>
                    <td className="p-3 text-center text-sm text-orange-400">{student.totalLates}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(student)}
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(student.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" />
                <p className="text-[hsl(28,10%,55%)]">No hay estudiantes registrados</p>
                <p className="text-sm text-[hsl(28,10%,45%)] mt-1">Haz clic en &lsquo;Nuevo&rsquo; para registrar el primero</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
