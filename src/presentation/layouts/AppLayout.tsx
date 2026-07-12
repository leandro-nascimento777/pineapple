import { Building2, LogOut, Settings } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { cn } from '@/lib/utils'
import { Avatar } from '@/presentation/components/Avatar'
import { PineappleLogo } from '@/presentation/components/PineappleLogo'

function NavLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string
  label: string
  icon: typeof Building2
  active: boolean
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  )
}

export function AppLayout() {
  const { state, signOut } = useAccessResolution()
  const location = useLocation()

  const resolved = state.status === 'resolved'
  const isAdmin = resolved && state.resolution.type === 'admin'
  const isStaff = resolved && (state.resolution.type === 'admin' || state.resolution.type === 'dev')
  const isCompanyUser = resolved && state.resolution.type === 'company'

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex h-16 items-center px-5">
          <PineappleLogo className="h-8 w-auto" />
        </div>

        {resolved && (
          <nav className="flex-1 space-y-1 px-3 py-2">
            {isStaff && (
              <NavLink
                to="/empresas"
                label="Empresas"
                icon={Building2}
                active={location.pathname.startsWith('/empresas')}
              />
            )}
            {isCompanyUser && (
              <NavLink
                to="/projetos"
                label="Projetos"
                icon={Building2}
                active={location.pathname.startsWith('/projetos') || location.pathname.startsWith('/dashboard')}
              />
            )}
            {isAdmin && (
              <NavLink
                to="/configuracoes"
                label="Configurações"
                icon={Settings}
                active={location.pathname.startsWith('/configuracoes')}
              />
            )}
          </nav>
        )}
        {!resolved && <div className="flex-1" />}

        {resolved && (
          <div className="space-y-2 border-t border-sidebar-border px-3 py-3">
            <div className="flex items-center gap-2 px-1">
              <Avatar label={state.session.user.email ?? '?'} />
              <span className="truncate text-xs text-sidebar-foreground/70">{state.session.user.email}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4 shrink-0" />
              Sair
            </button>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
