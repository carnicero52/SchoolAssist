'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ScanLine,
  Users,
  IdCard,
  BarChart3,
  UserCog,
  GraduationCap,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AdminSidebarProps {
  name: string
  role: string
  institutionName: string
}

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Escanear QR', href: '/admin/scan', icon: ScanLine },
  { title: 'Estudiantes', href: '/admin/students', icon: Users },
  { title: 'Credenciales', href: '/admin/credentials', icon: IdCard },
  { title: 'Reportes', href: '/admin/reports', icon: BarChart3 },
  { title: 'Personal', href: '/admin/staff', icon: UserCog },
  { title: 'Niveles/Grupos', href: '/admin/levels', icon: GraduationCap },
  { title: 'Turnos', href: '/admin/shifts', icon: Clock },
  { title: 'Puntos de Entrada', href: '/admin/scanpoints', icon: MapPin },
  { title: 'Configuracion', href: '/admin/settings', icon: Settings },
]

function getRoleLabel(role: string): string {
  switch (role) {
    case 'director':
      return 'Director'
    case 'admin':
      return 'Administracion'
    case 'porter':
      return 'Portero'
    default:
      return role
  }
}

function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'director':
      return 'default'
    case 'admin':
      return 'secondary'
    default:
      return 'outline'
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function SidebarNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-2">
        Menu Principal
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                  )}
                >
                  <Link href={item.href} onClick={onNavigate}>
                    <item.icon
                      className={cn(
                        'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                        isActive
                          ? 'text-white'
                          : 'text-stone-400 group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-300'
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function SidebarUserInfo({ name, role, onLogout }: { name: string; role: string; onLogout: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50">
      <Avatar className="h-9 w-9 ring-2 ring-teal-600/20">
        <AvatarFallback className="bg-teal-100 text-teal-700 text-xs font-semibold dark:bg-teal-900 dark:text-teal-300">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate text-stone-900 dark:text-stone-100">{name}</p>
        <Badge
          variant={getRoleBadgeVariant(role)}
          className={cn(
            'mt-0.5 text-[10px] px-1.5 py-0 h-4 font-medium',
            role === 'director' && 'bg-teal-600 text-white hover:bg-teal-700',
            role === 'admin' && 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200'
          )}
        >
          {getRoleLabel(role)}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLogout}
        className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors duration-200 shrink-0"
        title="Cerrar sesion"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function AdminSidebar({ name, role, institutionName }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <Sidebar className="border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
      <SidebarHeader className="p-4 pb-2">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/25 transition-transform duration-200 group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold truncate text-stone-900 dark:text-stone-100">
              {institutionName || 'SchoolAssist'}
            </span>
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium">
              Sistema de Asistencia
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-4" />

      <SidebarContent className="px-2 py-2">
        <SidebarNavigation pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mb-3" />
        <SidebarUserInfo name={name} role={role} onLogout={handleLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export function MobileSidebarTrigger({ name, role, institutionName }: AdminSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    setOpen(false)
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 bg-white dark:bg-stone-950">
        <SheetTitle className="sr-only">Menu de navegacion</SheetTitle>
        {/* Header */}
        <div className="p-4 pb-2 border-b border-stone-200 dark:border-stone-800">
          <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate text-stone-900 dark:text-stone-100">
                {institutionName || 'SchoolAssist'}
              </span>
              <span className="text-[11px] text-stone-400 dark:text-stone-500 font-medium">
                Sistema de Asistencia
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="mb-2 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Menu Principal
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0 transition-colors duration-200',
                      isActive
                        ? 'text-white'
                        : 'text-stone-400 group-hover:text-stone-600 dark:text-stone-500 dark:group-hover:text-stone-300'
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Info Footer */}
        <div className="border-t border-stone-200 dark:border-stone-800 p-3">
          <SidebarUserInfo name={name} role={role} onLogout={handleLogout} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
