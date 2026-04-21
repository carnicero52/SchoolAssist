'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Plus, Trash2, Shield, Users } from 'lucide-react'

interface Staff { id: string; name: string; email: string; role: string; phone: string; active: boolean }

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin', phone: '' })
  const institutionId = 'demo'

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/staff?institutionId=${institutionId}`)
      const data = await res.json()
      setStaff(data.staff || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const createStaff = async () => {
    if (!form.name || !form.email || !form.password || !form.role) return
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, ...form })
    })
    setForm({ name: '', email: '', password: '', role: 'admin', phone: '' })
    loadData()
  }

  const deleteStaff = async (id: string) => {
    if (!confirm('Eliminar usuario?')) return
    await fetch(`/api/staff?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'director': return 'bg-yellow-500'
      case 'admin': return 'bg-blue-500'
      case 'portero': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Personal</h1>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Agregar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                placeholder="Teléfono (opcional)"
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="bg-slate-700 border-slate-600"
              />
              <select 
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value})}
                className="w-full h-10 rounded-md bg-slate-700 border-slate-600 px-3"
              >
                <option value="admin">Administración</option>
                <option value="portero">Portero/Vigilante</option>
                <option value="director">Director</option>
              </select>
              <Button onClick={createStaff} className="w-full bg-blue-500">
                <Plus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Personal Existente
              </div>
              <Badge>{staff.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {staff.map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4" />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-slate-400">{s.email}</p>
                    </div>
                    <Badge className={getRoleBadge(s.role)}>
                      {s.role === 'director' ? 'Director' : s.role === 'admin' ? 'Admin' : 'Portero'}
                    </Badge>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => deleteStaff(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {staff.length === 0 && (
                <p className="text-center text-slate-500 py-4">No hay personal</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}