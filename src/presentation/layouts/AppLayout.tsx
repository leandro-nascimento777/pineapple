import { Building2, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAccessResolution, type AccessResolutionState } from '@/application/hooks/useAccessResolution'
import { cn } from '@/lib/utils'
import { Avatar } from '@/presentation/components/Avatar'
import { PineappleIcon, PineappleLogo } from '@/presentation/components/PineappleLogo'
import { SessionInfoBar } from '@/presentation/components/SessionInfoBar'

const SIDEBAR_COLLAPSED_KEY = 'pineapple_sidebar_collapsed'

function NavLink({
  to,
  label,
  icon: Icon,
  active,
  collapsed,
  onNavigate,
}: {
  to: string
  label: string
  icon: typeof Building2
  active: boolean
  collapsed?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-gold/25',
        collapsed && 'justify-center px-0',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && label}
    </Link>
  )
}

function SidebarContent({
  state,
  signOut,
  collapsed,
  onNavigate,
}: {
  state: AccessResolutionState
  signOut: () => void
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const location = useLocation()

  const resolved = state.status === 'resolved'
  const isAdmin = resolved && state.resolution.type === 'admin'
  const isStaff = resolved && (state.resolution.type === 'admin' || state.resolution.type === 'dev')
  const isCompanyUser = resolved && state.resolution.type === 'company'

  return (
    <>
      <div className="hidden h-16 items-center px-5 md:flex">
        {collapsed ? (
          <PineappleIcon variant="dark" className="mx-auto h-7 w-auto" />
        ) : (
          <PineappleLogo className="h-8 w-auto" />
        )}
      </div>

      {resolved && (
        <nav className="flex-1 space-y-1 px-3 py-2">
          {isStaff && (
            <NavLink
              to="/empresas"
              label="Empresas"
              icon={Building2}
              active={location.pathname.startsWith('/empresas')}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          )}
          {isCompanyUser && (
            <NavLink
              to="/projetos"
              label="Projetos"
              icon={Building2}
              active={location.pathname.startsWith('/projetos') || location.pathname.startsWith('/dashboard')}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          )}
          {isAdmin && (
            <NavLink
              to="/configuracoes"
              label="Configurações"
              icon={Settings}
              active={location.pathname.startsWith('/configuracoes')}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          )}
        </nav>
      )}
      {!resolved && <div className="flex-1" />}

      {resolved && (
        <div className="space-y-2 border-t border-sidebar-border px-3 py-3">
          <div className={cn('flex items-center gap-2 px-1', collapsed && 'justify-center px-0')}>
            <Avatar label={state.session.user.email ?? '?'} />
            {!collapsed && (
              <span className="truncate text-xs text-sidebar-foreground">{state.session.user.email}</span>
            )}
          </div>
          <button
            onClick={() => signOut()}
            title={collapsed ? 'Sair' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-gold/25',
              collapsed && 'justify-center px-0',
            )}
          >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && 'Sair'}
          </button>
        </div>
      )}
    </>
  )
}

export function AppLayout() {
  const { state, signOut } = useAccessResolution()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true',
  )

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed))
  }, [sidebarCollapsed])

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex',
          sidebarCollapsed ? 'w-16' : 'w-56',
        )}
      >
        <SidebarContent state={state} signOut={signOut} collapsed={sidebarCollapsed} />
        <div className="hidden justify-center border-t border-sidebar-border py-2 md:flex">
          <button
            type="button"
            aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="flex size-8 items-center justify-center rounded-lg text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-3 focus-visible:ring-gold/25"
          >
            {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:min-h-0">
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground md:hidden">
          <PineappleLogo className="h-7 w-auto" />
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-3 focus-visible:ring-gold/25"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMobileNavOpen(false)}
              className="absolute inset-0 bg-black/60"
            />
            <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl">
              <div className="flex h-14 items-center justify-between px-4">
                <PineappleLogo className="h-7 w-auto" />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent/60 focus-visible:ring-3 focus-visible:ring-gold/25"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent state={state} signOut={signOut} onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
            <SessionInfoBar state={state} />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
