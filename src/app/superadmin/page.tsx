'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Building, Users, Shield, Activity, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Institution {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  active: boolean
  educationLevel: string
  students: number
  staff: number
  createdAt: string
}

interface Stats {
  totalInstitutions: number
  activeInstitutions: number
  totalStudents: number
  totalStaff: number
}

export default function SuperAdminPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/superadmin/institutions')
      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
      } else {
        setInstitutions(data.institutions || [])
        setStats(data.stats || null)
      }
    } catch {
      toast.error('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    const action = currentActive ? 'suspender' : 'activar'
    if (!confirm(`¿Estas seguro de ${action} esta institucion?`)) return

    setTogglingId(id)
    try {
      const res = await fetch(`/api/superadmin/institutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(currentActive ? 'Institucion suspendida' : 'Institucion activada')
        loadData()
      } else {
        toast.error(data.error || 'Error al actualizar')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setTogglingId(null)
    }
  }

  const filteredInstitutions = institutions.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-lg dark:bg-amber-950/30">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Super Admin</h1>
              <p className="text-sm text-muted-foreground">Panel de administracion global</p>
            </div>
          </div>
          <Badge variant="outline" className="border-amber-500 text-amber-600 text-sm">
            Panel Global
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar instituciones por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-900/30">
                    <Building className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Institutos</p>
                    <p className="text-2xl font-bold">{stats.totalInstitutions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 rounded-lg dark:bg-emerald-900/30">
                    <Activity className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Activos</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.activeInstitutions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 rounded-lg dark:bg-amber-900/30">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estudiantes</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-50 rounded-lg dark:bg-orange-900/30">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Personal</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.totalStaff}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Institutions Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              Instituciones ({filteredInstitutions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  {search ? 'No se encontraron instituciones' : 'No hay instituciones registradas'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Nombre</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Nivel</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Est.</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Staff</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-center p-3 text-sm font-medium text-muted-foreground">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstitutions.map((i) => (
                      <tr key={i.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                              <Building className="h-4 w-4 text-teal-600" />
                            </div>
                            <span className="font-medium text-sm">{i.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground text-sm hidden md:table-cell">{i.email || '-'}</td>
                        <td className="p-3 text-muted-foreground text-sm hidden lg:table-cell">{i.educationLevel || '-'}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">{i.students}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">{i.staff}</Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={i.active ? 'bg-emerald-500 hover:bg-emerald-500' : 'bg-stone-500 hover:bg-stone-500'}>
                            {i.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            size="sm"
                            variant={i.active ? 'outline' : 'default'}
                            onClick={() => toggleActive(i.id, i.active)}
                            disabled={togglingId === i.id}
                            className={
                              i.active
                                ? 'text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30'
                                : 'bg-emerald-600 hover:bg-emerald-700'
                            }
                          >
                            {togglingId === i.id ? '...' : i.active ? 'Suspender' : 'Activar'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
