'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Shield, Users } from 'lucide-react'

interface Staff { id: string; name: string; email: string; role: string; phone: string; active: boolean }

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin', phone: '' })
  const [showForm, setShowForm] = useState(false)
  const institutionId = 'demo'

  const loadData = async () => {
    try {
      const res = await fetch(`/api/staff?institutionId=${institutionId}`)
      const data = await res.json()
      setStaff(data.staff || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const createStaff = async () => {
    if (!form.name || !form.email || !form.password || !form.role) return
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, ...form })
    })
    setForm({ name: '', email: '', password: '', role: 'admin', phone: '' })
    setShowForm(false)
    loadData()
  }

  const deleteStaff = async (id: string) => {
    if (!confirm('Eliminar usuario?')) return
    await fetch(`/api/staff?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'director': return 'bg-amber-600'
      case 'admin': return 'bg-blue-600'
      case 'portero': return 'bg-green-600'
      default: return 'bg-gray-600'
    }
  }

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'director': return 'Director'
      case 'admin': return 'Admin'
      case 'portero': return 'Portero'
      default: return role
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Personal</h1>
          <p className="text-[hsl(28,10%,55%)] mt-1">{staff.length} usuarios registrados</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo
        </Button>
      </div>

      {showForm && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader>
            <CardTitle className="text-base">Agregar Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Nombre completo" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Input placeholder="Teléfono (opcional)" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full h-10 rounded-md bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)] px-3 text-[hsl(30,30%,92%)]">
                <option value="admin">Administración</option>
                <option value="portero">Portero/Vigilante</option>
                <option value="director">Director</option>
              </select>
              <Button onClick={createStaff} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Crear Usuario
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-base">
            <div className="flex items-center gap-2"><Users className="h-5 w-5 text-amber-400" />Personal Existente</div>
            <Badge className="bg-amber-600">{staff.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {staff.map(s => (
              <div key={s.id} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(24,15%,20%)] flex items-center justify-center">
                    <Shield className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-[hsl(28,10%,55%)]">{s.email}</p>
                  </div>
                  <Badge className={getRoleBadge(s.role)}>{getRoleLabel(s.role)}</Badge>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteStaff(s.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {staff.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" />
                <p className="text-[hsl(28,10%,55%)]">No hay personal registrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
