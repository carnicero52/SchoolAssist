'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { School, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        // Verify session is set
        await verifySession(data.user)
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const verifySession = async (user: any) => {
    // Wait a bit for cookie to be set
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        // Session verified, navigate
        if (user.role === 'director' || user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/admin/scan')
        }
      } else {
        // Session not set yet, retry
        await new Promise(resolve => setTimeout(resolve, 1000))
        const retryRes = await fetch('/api/auth/me')
        if (retryRes.ok) {
          if (user.role === 'director' || user.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/admin/scan')
          }
        } else {
          setError('Error al verificar sesión. Intenta de nuevo.')
        }
      }
    } catch {
      setError('Error al verificar sesión. Intenta de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(24,25%,10%)] flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Card className="bg-[hsl(24,22%,13%)] border-[hsl(24,18%,22%)]">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/20">
                <School className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[hsl(30,30%,92%)]">SchoolAssist</CardTitle>
            <CardDescription className="text-[hsl(28,10%,55%)]">
              Ingresa a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-[hsl(28,10%,55%)]">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="director@colegio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)] text-[hsl(30,30%,92%)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[hsl(28,10%,55%)]">Contraseña</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)] text-[hsl(30,30%,92%)]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-[hsl(28,10%,55%)] hover:text-amber-400 transition-colors">
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
