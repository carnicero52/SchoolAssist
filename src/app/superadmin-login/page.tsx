'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, KeyRound, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const [secretKey, setSecretKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/superadmin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secretKey })
      })

      const data = await res.json()

      if (data.success) {
        router.push('/superadmin')
      } else {
        setError(data.error || 'Clave incorrecta')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
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
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-[hsl(30,30%,92%)]">Super Admin</CardTitle>
            <CardDescription className="text-[hsl(28,10%,55%)]">
              Ingresa la clave de acceso secreta
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
                <label className="text-sm text-[hsl(28,10%,55%)]">Clave Secreta</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[hsl(28,10%,45%)]" />
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                    className="pl-10 bg-[hsl(24,18%,18%)] border-[hsl(24,18%,22%)] text-[hsl(30,30%,92%)]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Acceder'
                )}
              </Button>

              <Link href="/" className="block text-center">
                <Button type="button" variant="ghost" className="text-[hsl(28,10%,55%)] hover:text-amber-400">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
