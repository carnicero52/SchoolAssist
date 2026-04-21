'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Edit, Save, X } from 'lucide-react'

interface Level { id: string; name: string; order: number; _count: { groups: number } }
interface Group { id: string; name: string; order: number; _count: { students: number } }

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [newLevel, setNewLevel] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const institutionId = 'demo' // Would come from session

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const res = await fetch(`/api/levels?institutionId=${institutionId}`)
      const data = await res.json()
      setLevels(data.levels || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const createLevel = async () => {
    if (!newLevel) return
    await fetch('/api/levels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ institutionId, name: newLevel })
    })
    setNewLevel('')
    loadData()
  }

  const deleteLevel = async (id: string) => {
    if (!confirm('Eliminar nivel? Se eliminarán todos los grupos.')) return
    await fetch(`/api/levels?id=${id}`, { method: 'DELETE' })
    loadData()
  }

  const createGroup = async () => {
    if (!newGroup || !selectedLevel) return
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelId: selectedLevel, name: newGroup })
    })
    setNewGroup('')
    loadGroups(selectedLevel)
  }

  const deleteGroup = async (id: string) => {
    if (!confirm('Eliminar grupo?')) return
    await fetch(`/api/groups?id=${id}`, { method: 'DELETE' })
    if (selectedLevel) loadGroups(selectedLevel)
  }

  const loadGroups = async (levelId: string) => {
    setSelectedLevel(levelId)
    const res = await fetch(`/api/groups?levelId=${levelId}&institutionId=${institutionId}`)
    const data = await res.json()
    setGroups(data.groups || [])
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Niveles y Grupos</h1>

        {/* Levels */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Niveles
              <Badge>{levels.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Nuevo nivel (ej: Primaria)"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Button onClick={createLevel} className="bg-blue-500">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {levels.map(level => (
                <div key={level.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <span className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => loadGroups(level.id)}>
                      {level.name}
                    </Button>
                    <Badge variant="outline">{level._count.groups} grupos</Badge>
                  </span>
                  <Button size="sm" variant="destructive" onClick={() => deleteLevel(level.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Groups */}
        {selectedLevel && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Grupos de {levels.find(l => l.id === selectedLevel)?.name}
                <Button size="sm" variant="ghost" onClick={() => setSelectedLevel(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Nuevo grupo (ej: 1A)"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
                <Button onClick={createGroup} className="bg-green-500">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <span className="flex items-center gap-2">
                      {group.name}
                      <Badge variant="outline">{group._count.students} estudiantes</Badge>
                    </span>
                    <Button size="sm" variant="destructive" onClick={() => deleteGroup(group.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}