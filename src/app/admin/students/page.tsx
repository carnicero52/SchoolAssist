'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Search, Download, User, Users, FileDown, Camera, Link, Upload, X, Pencil } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Student {
  id: string
  code: string
  name: string
  cedula: string
  photo: string
  email: string
  phone: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  telegramChatId: string
  level: string
  levelId: string
  group: string
  groupId: string
  totalAttendances: number
  totalAbsences: number
  totalLates: number
  active: boolean
}

const emptyForm = {
  name: '',
  cedula: '',
  email: '',
  phone: '',
  photo: '',
  guardianName: '',
  guardianPhone: '',
  guardianEmail: '',
  telegramChatId: '',
}

export default function StudentsPage() {
  const { institutionId } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, pages: 0 })

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<Student | null>(null)
  const [editing, setEditing] = useState(false)

  // Photo upload state
  const [photoMode, setPhotoMode] = useState<'upload' | 'url'>('url')
  const [uploading, setUploading] = useState(false)
  const [editPhotoMode, setEditPhotoMode] = useState<'upload' | 'url'>('url')
  const [editUploading, setEditUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const loadStudents = useCallback(async (searchTerm: string = '') => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      params.set('limit', '50')
      const res = await fetch(`/api/students?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
        setPagination(data.pagination || { page: 1, limit: 50, total: 0, pages: 0 })
      }
    } catch {
      toast.error('Error cargando estudiantes')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, loadStudents])

  const uploadPhoto = async (file: File, target: 'create' | 'edit'): Promise<string | null> => {
    const setUploadingState = target === 'create' ? setUploading : setEditUploading
    setUploadingState(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success && data.url) {
        return data.url
      } else {
        toast.error(data.error || 'Error al subir foto')
        return null
      }
    } catch {
      toast.error('Error al subir foto')
      return null
    } finally {
      setUploadingState(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'create' | 'edit') => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = await uploadPhoto(file, target)
    if (url) {
      if (target === 'create') {
        updateForm('photo', url)
      } else if (editForm) {
        setEditForm({ ...editForm, photo: url })
      }
    }
    // Reset file input
    if (target === 'create' && fileInputRef.current) fileInputRef.current.value = ''
    if (target === 'edit' && editFileInputRef.current) editFileInputRef.current.value = ''
  }

  const createStudent = async () => {
    if (!form.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    if (!institutionId) {
      toast.error('No se pudo determinar la institucion')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId, ...form })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Estudiante registrado exitosamente', {
          description: `Codigo asignado: ${data.student?.code || 'N/A'}`
        })
        setForm(emptyForm)
        setDialogOpen(false)
        loadStudents(search)
      } else {
        toast.error(data.error || 'Error al registrar estudiante')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setCreating(false)
    }
  }

  const updateStudent = async () => {
    if (!editForm || !editForm.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setEditing(true)
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editForm.id,
          name: editForm.name,
          cedula: editForm.cedula,
          email: editForm.email,
          phone: editForm.phone,
          photo: editForm.photo,
          guardianName: editForm.guardianName,
          guardianPhone: editForm.guardianPhone,
          guardianEmail: editForm.guardianEmail,
          telegramChatId: editForm.telegramChatId,
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Estudiante actualizado exitosamente')
        setEditDialogOpen(false)
        setEditForm(null)
        loadStudents(search)
      } else {
        toast.error(data.error || 'Error al actualizar estudiante')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setEditing(false)
    }
  }

  const openEditDialog = (student: Student) => {
    setEditForm({ ...student })
    setEditPhotoMode('url')
    setEditDialogOpen(true)
  }

  const deleteStudent = async (id: string, name: string) => {
    if (!confirm(`¿Estas seguro de eliminar a ${name}? Esta accion no se puede deshacer.`)) return

    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Estudiante eliminado')
        loadStudents(search)
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const exportCSV = () => {
    window.open('/api/export/students?format=csv', '_blank')
    toast.info('Descargando archivo CSV...')
  }

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Photo input component for reuse
  const PhotoInput = ({ target }: { target: 'create' | 'edit' }) => {
    const currentPhoto = target === 'create' ? form.photo : editForm?.photo || ''
    const mode = target === 'create' ? photoMode : editPhotoMode
    const setMode = target === 'create' ? setPhotoMode : setEditPhotoMode
    const isUploading = target === 'create' ? uploading : editUploading
    const ref = target === 'create' ? fileInputRef : editFileInputRef

    return (
      <div className="space-y-3">
        <Label>Foto del estudiante</Label>

        {/* Photo preview */}
        {currentPhoto && (
          <div className="relative inline-block">
            <div className="h-20 w-20 rounded-xl overflow-hidden ring-2 ring-teal-200 dark:ring-teal-700">
              <img src={currentPhoto} alt="Foto" className="h-20 w-20 object-cover" />
            </div>
            <button
              type="button"
              onClick={() => {
                if (target === 'create') updateForm('photo', '')
                else if (editForm) setEditForm({ ...editForm, photo: '' })
              }}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Mode toggle */}
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'url'
                ? 'bg-white dark:bg-stone-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link className="h-3.5 w-3.5" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              mode === 'upload'
                ? 'bg-white dark:bg-stone-700 text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Subir
          </button>
        </div>

        {mode === 'url' ? (
          <Input
            placeholder="https://ejemplo.com/foto.jpg"
            value={currentPhoto}
            onChange={(e) => {
              if (target === 'create') updateForm('photo', e.target.value)
              else if (editForm) setEditForm({ ...editForm, photo: e.target.value })
            }}
          />
        ) : (
          <div>
            <input
              ref={ref}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleFileUpload(e, target)}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => ref.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent mr-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Seleccionar foto
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP o GIF. Maximo 5MB</p>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-teal-600" />
            Estudiantes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pagination.total} estudiante{pagination.total !== 1 ? 's' : ''} registrado{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCSV} variant="outline" size="sm" className="border-stone-200 dark:border-stone-700">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Estudiante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Estudiante</DialogTitle>
                <DialogDescription>
                  Completa los datos del estudiante. Los campos marcados con * son obligatorios.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      placeholder="Juan Perez"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cedula">Cedula</Label>
                    <Input
                      id="cedula"
                      placeholder="V-12345678"
                      value={form.cedula}
                      onChange={(e) => updateForm('cedula', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email estudiante</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="estudiante@email.com"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono estudiante</Label>
                    <Input
                      id="phone"
                      placeholder="+58 412 1234567"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                    />
                  </div>
                </div>

                {/* Photo Input */}
                <PhotoInput target="create" />

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Datos del Apoderado</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="guardianName">Nombre apoderado</Label>
                      <Input
                        id="guardianName"
                        placeholder="Maria Perez"
                        value={form.guardianName}
                        onChange={(e) => updateForm('guardianName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianPhone">Telefono apoderado</Label>
                      <Input
                        id="guardianPhone"
                        placeholder="+58 414 1234567"
                        value={form.guardianPhone}
                        onChange={(e) => updateForm('guardianPhone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="guardianEmail">Email apoderado</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        placeholder="apoderado@email.com"
                        value={form.guardianEmail}
                        onChange={(e) => updateForm('guardianEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="telegramChatId">Chat ID de Telegram</Label>
                      <Input
                        id="telegramChatId"
                        placeholder="123456789"
                        value={form.telegramChatId}
                        onChange={(e) => updateForm('telegramChatId', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Para recibir notificaciones de entrada, salida y tardanzas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={createStudent}
                  disabled={creating || !form.name.trim()}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {creating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Estudiante
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Estudiante</DialogTitle>
            <DialogDescription>
              Modifica los datos del estudiante.
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-4 py-2">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nombre completo *</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cedula</Label>
                  <Input
                    value={editForm.cedula || ''}
                    onChange={(e) => setEditForm({ ...editForm, cedula: e.target.value })}
                    placeholder="V-12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email estudiante</Label>
                  <Input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    placeholder="estudiante@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefono estudiante</Label>
                  <Input
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+58 412 1234567"
                  />
                </div>
              </div>

              {/* Photo Input */}
              <PhotoInput target="edit" />

              <Separator />

              <div>
                <p className="text-sm font-medium text-foreground mb-3">Datos del Apoderado</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre apoderado</Label>
                    <Input
                      value={editForm.guardianName || ''}
                      onChange={(e) => setEditForm({ ...editForm, guardianName: e.target.value })}
                      placeholder="Maria Perez"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefono apoderado</Label>
                    <Input
                      value={editForm.guardianPhone || ''}
                      onChange={(e) => setEditForm({ ...editForm, guardianPhone: e.target.value })}
                      placeholder="+58 414 1234567"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Email apoderado</Label>
                    <Input
                      type="email"
                      value={editForm.guardianEmail || ''}
                      onChange={(e) => setEditForm({ ...editForm, guardianEmail: e.target.value })}
                      placeholder="apoderado@email.com"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Chat ID de Telegram</Label>
                    <Input
                      value={editForm.telegramChatId || ''}
                      onChange={(e) => setEditForm({ ...editForm, telegramChatId: e.target.value })}
                      placeholder="123456789"
                    />
                    <p className="text-xs text-muted-foreground">
                      Para recibir notificaciones de entrada, salida y tardanzas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={editing}
            >
              Cancelar
            </Button>
            <Button
              onClick={updateStudent}
              disabled={editing || !editForm?.name.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {editing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <Input
              placeholder="Buscar por nombre, codigo o cedula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {students.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="h-12 w-12 text-stone-200 dark:text-stone-700 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No hay estudiantes registrados</p>
              <p className="text-muted-foreground text-sm mt-1">
                Haz clic en &quot;Nuevo Estudiante&quot; para agregar el primero
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50 dark:bg-stone-900/40 hover:bg-stone-50 dark:hover:bg-stone-900/40">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500">Codigo</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500">Nombre</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 hidden md:table-cell">Cedula</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 hidden lg:table-cell">Nivel / Grupo</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center">Asist.</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center">Faltas</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center">Tarde</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="group">
                    <TableCell className="font-mono text-xs text-stone-500">
                      {student.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center ring-1 ring-teal-200 dark:ring-teal-800 overflow-hidden">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          {student.email && (
                            <p className="text-xs text-muted-foreground hidden sm:block">{student.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                      {student.cedula || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        {student.level && (
                          <Badge variant="outline" className="text-xs border-teal-200 text-teal-700 dark:border-teal-800 dark:text-teal-400">
                            {student.level}
                          </Badge>
                        )}
                        {student.group && (
                          <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
                            {student.group}
                          </Badge>
                        )}
                        {!student.level && !student.group && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        {student.totalAttendances}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-red-500 dark:text-red-400">
                        {student.totalAbsences}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-amber-500 dark:text-amber-400">
                        {student.totalLates}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-stone-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/30 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          onClick={() => openEditDialog(student)}
                          title="Editar estudiante"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                          onClick={() => deleteStudent(student.id, student.name)}
                          title="Eliminar estudiante"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
