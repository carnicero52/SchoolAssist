'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building, Users, Shield, Activity, Search, ToggleLeft, Plus, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'

interface Institution {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  address?: string
  logo?: string
  brandColor?: string
  secondaryColor?: string
  accentColor?: string
  educationLevel?: string
  active: boolean
  students: number
  staff: number
  createdAt: string
}

export default function SuperAdminPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingInst, setEditingInst] = useState<Institution | null>(null)
  const [form, setForm] = useState({
    name: '', slug: '', email: '', phone: '', address: '', logo: '',
    brandColor: '#3b82f6', secondaryColor: '#64748b', accentColor: '#22c55e',
    educationLevel: ''
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/superadmin/institutions')
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setInstitutions(data.institutions || [])
        setStats(data.stats || null)
      }
    } catch (e) {
      setError('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const createInstitution = async () => {
    if (!form.name || !form.email || !form.slug) return alert('Nombre, email y slug requeridos')
    await fetch('/api/superadmin/institutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    resetForm()
    loadData()
  }

  const updateInstitution = async () => {
    if (!editingInst || !form.name) return
    await fetch(`/api/superadmin/institutions/${editingInst.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    resetForm()
    loadData()
  }

  const deleteInstitution = async (id: string) => {
    if (!confirm('¿Eliminar instituto? Esta acción no se puede deshacer y eliminará todos sus datos.')) return
    await fetch(`/api/superadmin/institutions/${id}`, { method: 'DELETE' })
    loadData()
  }

  const openEdit = (inst: Institution) => {
    setForm({
      name: inst.name,
      slug: inst.slug,
      email: inst.email,
      phone: inst.phone || '',
      address: inst.address || '',
      logo: inst.logo || '',
      brandColor: inst.brandColor || '#3b82f6',
      secondaryColor: inst.secondaryColor || '#64748b',
      accentColor: inst.accentColor || '#22c55e',
      educationLevel: inst.educationLevel || ''
    })
    setEditingInst(inst)
    setShowForm(true)
  }

  const resetForm = () => {
    setForm({ name: '', slug: '', email: '', phone: '', address: '', logo: '', brandColor: '#3b82f6', secondaryColor: '#64748b', accentColor: '#22c55e', educationLevel: '' })
    setEditingInst(null)
    setShowForm(false)
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/superadmin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      })
      loadData()
    } catch (e) {
      console.error('Error toggling:', e)
    }
  }

  const filteredInstitutions = institutions.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-8 text-white">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building className="h-8 w-8 text-blue-500" />
            Super Admin
          </h1>
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className={`${showForm ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} font-semibold`}
          >
            {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? 'Cancelar' : 'Nuevo Instituto'}
          </Button>
        </div>

        {/* Create/Edit Institution Form - Always visible when toggled */}
        {showForm && (
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {editingInst ? <Edit className="h-5 w-5 text-yellow-500" /> : <Plus className="h-5 w-5 text-green-500" />}
                {editingInst ? 'Editar Instituto' : 'Registrar Nuevo Instituto'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium">Nombre del Instituto *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="Ej: Colegio San Juan"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Slug (URL única) *</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="ej: san-juan"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="contacto@instituto.edu.ve"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Teléfono</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="+58 212 123 4567"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Dirección</label>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="Av. Principal, Caracas"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Logo URL</label>
                  <Input
                    value={form.logo}
                    onChange={(e) => setForm({...form, logo: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Color Principal</label>
                  <Input
                    type="color"
                    value={form.brandColor}
                    onChange={(e) => setForm({...form, brandColor: e.target.value})}
                    className="h-10 bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Color Secundario</label>
                  <Input
                    type="color"
                    value={form.secondaryColor}
                    onChange={(e) => setForm({...form, secondaryColor: e.target.value})}
                    className="h-10 bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium">Color Acento</label>
                  <Input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({...form, accentColor: e.target.value})}
                    className="h-10 bg-gray-800 border-gray-700 mt-1"
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="text-sm text-gray-400 font-medium">Nivel Educativo (opcional)</label>
                  <Input
                    value={form.educationLevel}
                    onChange={(e) => setForm({...form, educationLevel: e.target.value})}
                    className="bg-gray-800 border-gray-700 mt-1"
                    placeholder="Ej: Primaria, Bachillerato, Universidad"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={editingInst ? updateInstitution : createInstitution} 
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
                >
                  {editingInst ? '✓ Actualizar Instituto' : '✓ Crear Instituto'}
                </Button>
                {editingInst && (
                  <Button 
                    onClick={() => deleteInstitution(editingInst.id)} 
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                <Button 
                  onClick={resetForm} 
                  variant="outline"
                  className="px-6"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar institutos por nombre o email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800"
          />
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg"><Building className="h-6 w-6 text-blue-500"/></div>
                <div><p className="text-sm text-gray-400">Total Institutos</p><p className="text-2xl font-bold">{stats.totalInstitutions}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg"><Activity className="h-6 w-6 text-green-500"/></div>
                <div><p className="text-sm text-gray-400">Activos</p><p className="text-2xl font-bold">{stats.activeInstitutions}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg"><Users className="h-6 w-6 text-purple-500"/></div>
                <div><p className="text-sm text-gray-400">Estudiantes</p><p className="text-2xl font-bold">{stats.totalStudents}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg"><Shield className="h-6 w-6 text-orange-500"/></div>
                <div><p className="text-sm text-gray-400">Personal</p><p className="text-2xl font-bold">{stats.totalStaff}</p></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Institutions Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Institutos Registrados</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {filteredInstitutions.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-3 font-semibold">Nombre</th>
                  <th className="text-left p-3 font-semibold">Email</th>
                  <th className="text-left p-3 font-semibold hidden md:table-cell">Slug</th>
                  <th className="text-left p-3 font-semibold hidden lg:table-cell">Nivel</th>
                  <th className="text-center p-3 font-semibold">Est.</th>
                  <th className="text-center p-3 font-semibold">Staff</th>
                  <th className="text-center p-3 font-semibold">Estado</th>
                  <th className="text-center p-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map(i => (
                  <tr key={i.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="p-3 font-medium flex items-center gap-2">
                      {i.logo && (
                        <img src={i.logo} className="w-8 h-8 rounded object-cover border-2 border-gray-600" alt="" />
                      )}
                      {i.name}
                    </td>
                    <td className="p-3 text-gray-400">{i.email}</td>
                    <td className="p-3 text-gray-400 text-sm font-mono hidden md:table-cell">{i.slug}</td>
                    <td className="p-3 text-gray-400 hidden lg:table-cell">{i.educationLevel || '-'}</td>
                    <td className="p-3 text-center font-semibold text-blue-400">{i.students}</td>
                    <td className="p-3 text-center font-semibold text-purple-400">{i.staff}</td>
                    <td className="p-3 text-center">
                      <Badge 
                        className={`cursor-pointer transition-all ${i.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                        onClick={() => toggleActive(i.id, i.active)}
                      >
                        {i.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(i)} title="Editar">
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleActive(i.id, i.active)} title="Activar/Desactivar">
                          <ToggleLeft className="h-4 w-4 text-yellow-400" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteInstitution(i.id)} title="Eliminar">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInstitutions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No hay institutos registrados</p>
                <p className="text-sm">Haz clic en "Nuevo Instituto" para crear el primero.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
