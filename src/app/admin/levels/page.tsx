'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap, Plus, Trash2, ChevronRight, Users } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'sonner'

interface Level {
  id: string
  name: string
  order: number
  _count: { groups: number }
}

interface Group {
  id: string
  name: string
  order: number
  _count: { students: number }
}

export default function LevelsPage() {
  const { institutionId } = useAuth()
  const [levels, setLevels] = useState<Level[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [newLevel, setNewLevel] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/levels')
      const data = await res.json()
      startTransition(() => setLevels(data.levels || []))
    } catch {
      toast.error('Error cargando niveles')
    }
    startTransition(() => setLoading(false))
  }, [startTransition])

  useEffect(() => {
    if (institutionId) loadData()
  }, [institutionId, loadData])

  const createLevel = async () => {
    if (!newLevel.trim()) {
      toast.error('Ingresa un nombre para el nivel')
      return
    }
    try {
      const res = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLevel.trim() })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Nivel creado')
        setNewLevel('')
        loadData()
      } else {
        toast.error(data.error || 'Error al crear nivel')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const deleteLevel = async (id: string) => {
    if (!confirm('¿Eliminar este nivel? Se eliminaran todos los grupos y datos asociados.')) return
    try {
      const res = await fetch(`/api/levels?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Nivel eliminado')
        if (selectedLevel === id) {
          setSelectedLevel(null)
          setGroups([])
        }
        loadData()
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const loadGroups = async (levelId: string) => {
    setSelectedLevel(levelId)
    try {
      const res = await fetch(`/api/groups?levelId=${levelId}`)
      const data = await res.json()
      setGroups(data.groups || [])
    } catch {
      toast.error('Error cargando grupos')
    }
  }

  const createGroup = async () => {
    if (!newGroup.trim() || !selectedLevel) return
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levelId: selectedLevel, name: newGroup.trim() })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Grupo creado')
        setNewGroup('')
        loadGroups(selectedLevel)
        loadData()
      } else {
        toast.error(data.error || 'Error al crear grupo')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const deleteGroup = async (id: string) => {
    if (!confirm('¿Eliminar este grupo?')) return
    try {
      const res = await fetch(`/api/groups?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Grupo eliminado')
        if (selectedLevel) {
          loadGroups(selectedLevel)
          loadData()
        }
      } else {
        toast.error(data.error || 'Error al eliminar')
      }
    } catch {
      toast.error('Error de conexion')
    }
  }

  const selectedLevelName = levels.find((l) => l.id === selectedLevel)?.name || ''

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-50 rounded-lg dark:bg-teal-950/50">
          <GraduationCap className="h-6 w-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Niveles y Grupos</h1>
          <p className="text-sm text-muted-foreground">Organiza estudiantes por niveles y grupos</p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel: Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-teal-600" />
                Niveles
              </div>
              <Badge variant="secondary">{levels.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nuevo nivel (ej: Primaria)"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createLevel()}
              />
              <Button onClick={createLevel} className="bg-teal-600 hover:bg-teal-700" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {levels.length === 0 ? (
                <div className="text-center py-8">
                  <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground text-sm">No hay niveles creados</p>
                </div>
              ) : (
                levels.map((level) => (
                  <div
                    key={level.id}
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLevel === level.id
                        ? 'bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800'
                        : 'bg-muted/50 hover:bg-muted/80'
                    }`}
                    onClick={() => loadGroups(level.id)}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          selectedLevel === level.id ? 'rotate-90 text-teal-600' : ''
                        }`}
                      />
                      <span className="font-medium text-sm">{level.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {level._count?.groups || 0} grupos
                      </Badge>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteLevel(level.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel: Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                {selectedLevel ? `Grupos de ${selectedLevelName}` : 'Grupos'}
              </div>
              {selectedLevel && (
                <Badge variant="secondary">{groups.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedLevel ? (
              <div className="text-center py-12">
                <ChevronRight className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2 rotate-90" />
                <p className="text-muted-foreground text-sm">Selecciona un nivel para ver sus grupos</p>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Nuevo grupo (ej: 1A)"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                  />
                  <Button onClick={createGroup} className="bg-amber-500 hover:bg-amber-600" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {groups.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground text-sm">No hay grupos en este nivel</p>
                      <p className="text-xs text-muted-foreground mt-1">Agrega el primer grupo arriba</p>
                    </div>
                  ) : (
                    groups.map((group) => (
                      <div
                        key={group.id}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 rounded-lg dark:bg-amber-950/30">
                            <Users className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                          <div>
                            <span className="font-medium text-sm">{group.name}</span>
                            <Badge variant="outline" className="text-xs ml-2">
                              {group._count?.students || 0} est.
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                          onClick={() => deleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
