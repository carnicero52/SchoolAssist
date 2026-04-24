'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, LogIn, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SuperAdminLoginPage() {
  const [secretKey, setSecretKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/superadmin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey })
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        setLoading(false)
        return
      }

      toast.success('Acceso autorizado')
      // Small delay to ensure cookie is saved
      await new Promise(resolve => setTimeout(resolve, 300))
      window.location.href = '/superadmin'
    } catch {
      toast.error('Error de conexion')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Shield className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Super Admin</CardTitle>
          <CardDescription className="text-muted-foreground">Acceso restringido</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Clave de acceso</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="Ingresa la clave secreta"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white h-11"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              {loading ? 'Verificando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
