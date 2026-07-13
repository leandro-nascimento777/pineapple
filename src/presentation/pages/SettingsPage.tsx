import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/presentation/components/PageHeader'
import { CompanyManager } from '@/presentation/components/admin/CompanyManager'
import { SystemUserManager } from '@/presentation/components/admin/SystemUserManager'

type Tab = 'sistema' | 'clientes'

export function SettingsPage() {
  const { state } = useAccessResolution()
  const [tab, setTab] = useState<Tab>('sistema')

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type !== 'admin') {
    const isStaff = state.resolution.type === 'dev'
    return <Navigate to={isStaff ? '/empresas' : state.resolution.type === 'company' ? '/projetos' : '/acesso-nao-configurado'} replace />
  }

  return (
    <div>
      <PageHeader
        title="Configurações"
        action={
          <div className="flex gap-2">
            <Button variant={tab === 'sistema' ? 'default' : 'outline'} size="sm" onClick={() => setTab('sistema')}>
              Sistema
            </Button>
            <Button variant={tab === 'clientes' ? 'default' : 'outline'} size="sm" onClick={() => setTab('clientes')}>
              Clientes
            </Button>
          </div>
        }
      />

      {tab === 'sistema' ? <SystemUserManager /> : <CompanyManager />}
    </div>
  )
}
