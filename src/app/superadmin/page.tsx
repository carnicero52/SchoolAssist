'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building, Users, Shield, Activity, Search, ToggleLeft, LogOut, GraduationCap } from 'lucide-react'

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

export default function SuperAdminPage() {
  const router = useRouter()
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/superadmin/institutions')
      const data = await res.json()

      if (data.error) {
        if (res.status === 401) {
          router.push('/superadmin-login')
          return
        }
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

  const handleLogout = async () => {
    await fetch('/api/superadmin/auth', { method: 'DELETE' })
    router.push('/superadmin-login')
  }

  const filteredInstitutions = institutions.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[hsl(24,25%,10%)]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="min-h-screen bg-[hsl(24,25%,10%)] text-[hsl(30,30%,92%)]">
      {/* Header */}
      <header className="border-b border-[hsl(24,18%,22%)] bg-[hsl(24,22%,13%)]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">SchoolAssist</span>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 ml-2">Super Admin</Badge>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-[hsl(28,10%,55%)] hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl"><Building className="h-6 w-6 text-amber-500" /></div>
                <div><p className="text-sm text-[hsl(28,10%,55%)]">Total Institutos</p><p className="text-2xl font-bold">{stats.totalInstitutions}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-xl"><Activity className="h-6 w-6 text-green-500" /></div>
                <div><p className="text-sm text-[hsl(28,10%,55%)]">Activos</p><p className="text-2xl font-bold">{stats.activeInstitutions}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl"><Users className="h-6 w-6 text-blue-500" /></div>
                <div><p className="text-sm text-[hsl(28,10%,55%)]">Estudiantes</p><p className="text-2xl font-bold">{stats.totalStudents}</p></div>
              </CardContent>
            </Card>
            <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
              <CardContent className="pt-6 flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl"><Shield className="h-6 w-6 text-purple-500" /></div>
                <div><p className="text-sm text-[hsl(28,10%,55%)]">Personal</p><p className="text-2xl font-bold">{stats.totalStaff}</p></div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[hsl(28,10%,45%)]" />
          <Input
            placeholder="Buscar institutos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]"
          />
        </div>

        {/* Institutions Table */}
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader>
            <CardTitle className="text-base">Institutos ({filteredInstitutions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(24,18%,22%)]">
                    <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Nombre</th>
                    <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Email</th>
                    <th className="text-left p-3 text-sm text-[hsl(28,10%,55%)]">Nivel</th>
                    <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Est.</th>
                    <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Staff</th>
                    <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Estado</th>
                    <th className="text-center p-3 text-sm text-[hsl(28,10%,55%)]">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map(i => (
                    <tr key={i.id} className="border-b border-[hsl(24,18%,22%)] hover:bg-[hsl(24,18%,18%)] transition-colors">
                      <td className="p-3 font-medium text-sm">{i.name}</td>
                      <td className="p-3 text-sm text-[hsl(28,10%,55%)]">{i.email}</td>
                      <td className="p-3 text-sm text-[hsl(28,10%,55%)]">{i.educationLevel || '-'}</td>
                      <td className="p-3 text-center text-sm">{i.students}</td>
                      <td className="p-3 text-center text-sm">{i.staff}</td>
                      <td className="p-3 text-center">
                        <Badge className={i.active ? 'bg-green-600' : 'bg-gray-600'}>
                          {i.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant={i.active ? 'outline' : 'default'}
                          onClick={() => toggleActive(i.id, i.active)}
                          className={i.active
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                          }
                        >
                          {i.active ? 'Suspender' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInstitutions.length === 0 && (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" />
                  <p className="text-[hsl(28,10%,55%)]">No hay instituciones registradas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
