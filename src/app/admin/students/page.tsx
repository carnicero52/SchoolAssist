'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Search, Upload, Download, User, Edit, X } from 'lucide-react'

interface Student {
  id: string
  code: string
  name: string
  cedula: string
  photo: string
  email: string
  phone: string
  whatsappPhone: string
  guardianName: string
  guardianPhone: string
  guardianEmail: string
  level: string
  group: string
  totalAttendances: number
  totalAbsences: number
  totalLates: number
  levelId?: string
  groupId?: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    id: '', name: '', cedula: '', email: '', phone: '', whatsappPhone: '',
    guardianName: '', guardianPhone: '', guardianEmail: '', levelId: '', groupId: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
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

  const createStudent = async () => {
    if (!form.name) return alert('Nombre requerido')
    const body = { institutionId, ...form, levelId: form.levelId || null, groupId: form.groupId || null }
    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    resetForm()
    loadData()
  }

  const updateStudent = async () => {
    if (!form.id || !form.name) return alert('ID y nombre requeridos')
    const body = { id: form.id, name: form.name, cedula: form.cedula, email: form.email, phone: form.phone, whatsappPhone: form.whatsappPhone, guardianName: form.guardianName, guardianPhone: form.guardianPhone, guardianEmail: form.guardianEmail, levelId: form.levelId || null, groupId: form.groupId || null }
    await fetch('/api/students', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    resetForm()
    loadData()
  }

  const deleteStudent = async (id: string) => {
    if (!confirm('¿Eliminar estudiante (soft delete)?')) return
    await fetch(`/api/students?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  const openEdit = (student: Student) => {
    setForm({
      id: student.id,
      name: student.name,
      cedula: student.cedula || '',
      email: student.email || '',
      phone: student.phone || '',
      whatsappPhone: student.whatsappPhone || '',
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '',
      guardianEmail: student.guardianEmail || '',
      levelId: student.levelId || '',
      groupId: student.groupId || ''
    })
    setEditingId(student.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ id: '', name: '', cedula: '', email: '', phone: '', whatsappPhone: '', guardianName: '', guardianPhone: '', guardianEmail: '', levelId: '', groupId: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const exportCSV = async () => {
    window.open(`/api/export/students?institutionId=${institutionId}&format=csv`, '_blank')
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Estudiantes</h1>
          <div className="flex gap-2">
            <Button onClick={exportCSV} variant="outline" className="bg-slate-800">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => { resetForm(); setShowForm(!showForm) }} className="bg-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, código o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700"
          />
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {editingId ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                <Button size="sm" variant="ghost" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nombre completo *"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="Cédula"
                  value={form.cedula}
                  onChange={(e) => setForm({...form, cedula: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="Email estudiante"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="Teléfono estudiante"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <Input
                  placeholder="WhatsApp estudiante (ej: 584123456789)"
                  value={form.whatsappPhone}
                  onChange={(e) => setForm({...form, whatsappPhone: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                />
                <div>
                  <label className="text-sm text-slate-400">Nombre apoderado (opcional para adultos/universitarios)</label>
                  <Input
                    placeholder="Nombre apoderado"
                    value={form.guardianName}
                    onChange={(e) => setForm({...form, guardianName: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Teléfono apoderado</label>
                  <Input
                    placeholder="Teléfono apoderado"
                    value={form.guardianPhone}
                    onChange={(e) => setForm({...form, guardianPhone: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email apoderado</label>
                  <Input
                    placeholder="Email apoderado"
                    value={form.guardianEmail}
                    onChange={(e) => setForm({...form, guardianEmail: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={editingId ? updateStudent : createStudent} className="flex-1 bg-green-500">
                  {editingId ? 'Actualizar' : 'Crear'}
                </Button>
                {editingId && (
                  <Button onClick={() => deleteStudent(editingId)} variant="destructive" className="flex-1">
                    Eliminar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Students List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Lista de Estudi./.
              <Badge>{students.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left p-3">Código</th>
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Cédula</th>
                    <th className="text-left p-3">Nivel/Grupo</th>
                    <th className="text-center p-3">Asist.</th>
                    <th className="text-center p-3">Faltas</th>
                    <th className="text-center p-3">Tarde</th>
                    <th className="text-center p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id} className="border-b border-slate-700">
                      <td className="p-3 text-slate-400">{student.code}</td>
                      <td className="p-3 font-medium flex items-center gap-2">
                        {student.photo ? (
                          <img src={student.photo} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        {student.name}
                      </td>
                      <td className="p-3 text-slate-400">{student.cedula || '-'}</td>
                      <td className="p-3 text-slate-400">{student.level} {student.group}</td>
                      <td className="p-3 text-center text-green-400">{student.totalAttendances}</td>
                      <td className="p-3 text-center text-red-400">{student.totalAbsences}</td>
                      <td className="p-3 text-center text-orange-400">{student.totalLates}</td>
                      <td className="p-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(student)} className="text-blue-400">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteStudent(student.id)} className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <p className="text-center text-slate-500 py-8">No hay estudiantes</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
