'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, X, Layers } from 'lucide-react'

interface Level { id: string; name: string; order: number; _count: { groups: number } }
interface Group { id: string; name: string; order: number; _count: { students: number } }

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [newLevel, setNewLevel] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const institutionId = 'demo'

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

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin h-8 w-8 border-4 border-amber-400 border-t-transparent rounded-full" /></div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Niveles y Grupos</h1>
        <p className="text-[hsl(28,10%,55%)] mt-1">Organiza la estructura académica</p>
      </div>

      <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-base">
            <span>Niveles</span>
            <Badge className="bg-amber-600">{levels.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Nuevo nivel (ej: Primaria)" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createLevel()} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
            <Button onClick={createLevel} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="space-y-2">
            {levels.map(level => (
              <div key={level.id} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)] hover:border-amber-500/30 transition-colors">
                <span className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center"><Layers className="h-4 w-4 text-amber-400" /></div>
                  <button onClick={() => loadGroups(level.id)} className="font-medium text-sm hover:text-amber-400 transition-colors">{level.name}</button>
                  <Badge variant="outline" className="border-[hsl(24,18%,22%)] text-[hsl(28,10%,55%)]">{level._count.groups} grupos</Badge>
                </span>
                <Button size="sm" variant="ghost" onClick={() => deleteLevel(level.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {levels.length === 0 && (
              <div className="text-center py-8"><Layers className="h-12 w-12 text-[hsl(28,10%,35%)] mx-auto mb-3" /><p className="text-[hsl(28,10%,55%)]">No hay niveles creados</p></div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLevel && (
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-base">
              <span>Grupos de {levels.find(l => l.id === selectedLevel)?.name}</span>
              <Button size="sm" variant="ghost" onClick={() => setSelectedLevel(null)} className="text-[hsl(28,10%,55%)]"><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input placeholder="Nuevo grupo (ej: 1A)" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createGroup()} className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)]" />
              <Button onClick={createGroup} className="bg-green-600 hover:bg-green-700 text-white"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {groups.map(group => (
                <div key={group.id} className="flex justify-between items-center p-3 rounded-xl bg-[hsl(24,18%,18%)] border border-[hsl(24,18%,22%)]">
                  <span className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{group.name}</span>
                    <Badge variant="outline" className="border-[hsl(24,18%,22%)] text-[hsl(28,10%,55%)]">{group._count.students} est.</Badge>
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => deleteGroup(group.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
