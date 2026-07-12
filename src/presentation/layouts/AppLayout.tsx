import { Link, Outlet } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { Button } from '@/components/ui/button'
import { PineappleLogo } from '@/presentation/components/PineappleLogo'

export function AppLayout() {
  const { state, signOut } = useAccessResolution()
  const isAdmin = state.status === 'resolved' && state.resolution.type === 'admin'

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between border-b pb-4">
        <PineappleLogo />
        {state.status === 'resolved' && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{state.session.user.email}</span>
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sair
            </Button>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
