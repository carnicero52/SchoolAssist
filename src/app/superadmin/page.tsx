'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building, Users, Shield, Activity, Search, ToggleLeft } from 'lucide-react'

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

  const filteredInstitutions = institutions.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-8 text-white">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Panel Global
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Buscar institutos..." 
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
          <CardHeader><CardTitle>Institutos ({filteredInstitutions.length})</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Nivel</th>
                  <th className="text-center p-3">Est.</th>
                  <th className="text-center p-3">Staff</th>
                  <th className="text-center p-3">Estado</th>
                  <th className="text-center p-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map(i => (
                  <tr key={i.id} className="border-b border-gray-800">
                    <td className="p-3 font-medium">{i.name}</td>
                    <td className="p-3 text-gray-400">{i.email}</td>
                    <td className="p-3 text-gray-400">{i.educationLevel || '-'}</td>
                    <td className="p-3 text-center">{i.students}</td>
                    <td className="p-3 text-center">{i.staff}</td>
                    <td className="p-3 text-center">
                      <Badge className={i.active ? 'bg-green-500' : 'bg-gray-500'}>
                        {i.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Button 
                        size="sm" 
                        variant={i.active ? "destructive" : "default"}
                        onClick={() => toggleActive(i.id, i.active)}
                      >
                        {i.active ? 'Suspender' : 'Activar'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}