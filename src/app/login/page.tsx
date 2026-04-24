'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, LogIn, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.error) {
        toast.error(data.error)
        setLoading(false)
        return
      }

      toast.success(`Bienvenido, ${data.user.name}`)

      // Verify session is established before navigating
      let retries = 0
      let sessionVerified = false

      while (retries < 3 && !sessionVerified) {
        await new Promise(resolve => setTimeout(resolve, 500))
        try {
          const meRes = await fetch('/api/auth/me')
          if (meRes.ok) {
            sessionVerified = true
          }
        } catch {
          // ignore
        }
        retries++
      }

      if (sessionVerified) {
        // Use full page navigation to ensure all state is properly reset
        const targetUrl = (data.user.role === 'director' || data.user.role === 'admin')
          ? '/admin'
          : '/admin/scan'
        window.location.href = targetUrl
      } else {
        toast.error('Error al verificar sesion. Intenta de nuevo.')
        setLoading(false)
      }
    } catch {
      toast.error('Error de conexion')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-background to-emerald-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-50 rounded-2xl">
              <GraduationCap className="h-10 w-10 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">SchoolAssist</CardTitle>
          <CardDescription className="text-muted-foreground">Ingresa a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electronico</Label>
              <Input id="email" type="email" placeholder="director@colegio.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contrasena</Label>
              <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              {loading ? 'Ingresando...' : 'Iniciar Sesion'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
