'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserCog, Plus, Trash2, Shield } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Staff {
  id: string
  name: string
  email: string
  role: string
  phone: string
  active: boolean
}

export default function StaffPage() {
  const { institutionId } = useAuth()
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin', phone: '' })
  const [, startTransition] = useTransition()

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/staff')
      const data = await res.json()
      startTransition(() => setStaff(data.staff || []))
    } catch {
      toast.error('Error cargando personal')
    }
    startTransition(() => setLoading(false))
  }, [startTransition])

  useEffect(() => {
    if (institutionId) loadData()
  }, [institutionId, loadData])

  const createStaff = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      toast.error('Todos los campos requeridos')
      return
    }
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Usuario creado exitosamente')
        setForm({ name: '', email: '', password: '', role: 'admin', phone: '' })
        setShowForm(false)
        loadData()
      } else {
        toast.error(data.error || 'Error al crear')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const deleteStaff = async (id: string) => {
    if (!confirm('¿Estas seguro de eliminar este usuario? Esta accion no se puede deshacer.')) return
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Usuario eliminado')
        loadData()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'director': return 'bg-teal-600 hover:bg-teal-600 text-white'
      case 'admin': return 'bg-amber-500 hover:bg-amber-500 text-white'
      case 'portero': return 'bg-stone-500 hover:bg-stone-500 text-white'
      default: return 'bg-gray-500 hover:bg-gray-500 text-white'
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'director': return 'Director'
      case 'admin': return 'Admin'
      case 'portero': return 'Portero'
      default: return role
    }
  }

  const getRoleIconColor = (role: string) => {
    switch (role) {
      case 'director': return 'text-teal-600'
      case 'admin': return 'text-amber-500'
      case 'portero': return 'text-stone-500'
      default: return 'text-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50">
            <UserCog className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Personal</h1>
            <p className="text-sm text-muted-foreground">Gestion de usuarios y roles</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-teal-600 hover:bg-teal-700" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-teal-200 dark:border-teal-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-teal-600" />
              Agregar Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre completo</Label>
                  <Input
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contrasena</Label>
                  <Input
                    type="password"
                    placeholder="Contrasena segura"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefono (opcional)</Label>
                  <Input
                    placeholder="+58 412 1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="director">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-600" />
                        Director
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        Administracion
                      </div>
                    </SelectItem>
                    <SelectItem value="portero">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-stone-500" />
                        Portero / Vigilante
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createStaff} className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-teal-600" />
              Personal Registrado
            </div>
            <Badge variant="secondary">{staff.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No hay personal registrado</p>
              <p className="text-xs text-muted-foreground mt-1">Agrega el primer usuario con el boton de arriba</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      s.role === 'director' ? 'bg-teal-50 dark:bg-teal-950/30' :
                      s.role === 'admin' ? 'bg-amber-50 dark:bg-amber-950/30' :
                      'bg-stone-100 dark:bg-stone-800/50'
                    }`}>
                      <Shield className={`h-4 w-4 ${getRoleIconColor(s.role)}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                    <Badge className={getRoleBadgeClass(s.role)}>
                      {getRoleName(s.role)}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => deleteStaff(s.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
