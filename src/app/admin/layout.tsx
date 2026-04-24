'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  GraduationCap, BarChart3, Users, QrCode, ScanLine, Settings,
  FileText, Clock, Shield, Menu, X, LogOut, ChevronLeft, ChevronRight, Layers, MapPin
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
  { href: '/admin/scan', icon: ScanLine, label: 'Escanear QR' },
  { href: '/admin/students', icon: Users, label: 'Estudiantes' },
  { href: '/admin/credentials', icon: QrCode, label: 'Credenciales' },
  { href: '/admin/staff', icon: Shield, label: 'Personal' },
  { href: '/admin/shifts', icon: Clock, label: 'Turnos' },
  { href: '/admin/levels', icon: Layers, label: 'Niveles/Grados' },
  { href: '/admin/scanpoints', icon: MapPin, label: 'Puntos de Escaneo' },
  { href: '/admin/reports', icon: FileText, label: 'Reportes' },
  { href: '/admin/settings', icon: Settings, label: 'Configuración' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[hsl(24,25%,10%)] text-[hsl(30,30%,92%)]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out
        bg-gradient-to-b from-[hsl(24,22%,14%)] to-[hsl(24,25%,10%)]
        border-r border-[hsl(24,18%,22%)]
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${collapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-[hsl(24,18%,22%)] ${collapsed ? 'justify-center' : 'px-4'}`}>
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/20">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                SchoolAssist
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/10'
                    : 'text-[hsl(28,10%,55%)] hover:bg-[hsl(24,18%,18%)] hover:text-[hsl(30,30%,85%)]'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-amber-400' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center border-t border-[hsl(24,18%,22%)] p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-[hsl(28,10%,55%)] hover:text-amber-400 hover:bg-[hsl(24,18%,18%)]"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Logout */}
        <div className={`border-t border-[hsl(24,18%,22%)] p-3 ${collapsed ? 'flex justify-center' : ''}`}>
          <Link href="/login">
            <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[hsl(28,10%,55%)] hover:text-red-400 hover:bg-red-500/10 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}>
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 h-16 bg-[hsl(24,25%,10%)]/95 backdrop-blur-md border-b border-[hsl(24,18%,22%)] flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[hsl(30,30%,85%)] hover:text-amber-400">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 ml-3">
            <div className="p-1.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-amber-400">SchoolAssist</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
