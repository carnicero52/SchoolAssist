'use client'

import { useAuth } from '@/components/auth-provider'
import { AdminSidebar, MobileSidebarTrigger } from '@/components/admin-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, institutionId } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      redirect('/login')
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <AdminSidebar
        name={user.email?.split('@')[0] || 'Usuario'}
        role={user.role}
        institutionName={user.institutionName || 'SchoolAssist'}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4 sticky top-0 z-10">
          <MobileSidebarTrigger
            name={user.email?.split('@')[0] || 'Usuario'}
            role={user.role}
            institutionName={user.institutionName || 'SchoolAssist'}
          />
          <SidebarTrigger className="hidden md:flex h-8 w-8" />
          <Separator orientation="vertical" className="h-5 hidden md:block" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
