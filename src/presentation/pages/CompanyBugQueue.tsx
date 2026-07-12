import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useBugRealtime } from '@/application/hooks/useBugRealtime'
import { useBugsByCompany } from '@/application/hooks/useBugsByCompany'
import { useCompanies } from '@/application/hooks/useCompanies'
import { Button } from '@/components/ui/button'
import { BugDetail } from '@/presentation/components/BugDetail'
import { BugList } from '@/presentation/components/BugList'
import { PageHeader } from '@/presentation/components/PageHeader'

export function CompanyBugQueue() {
  const { state } = useAccessResolution()
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null)

  const { data: companies } = useCompanies()
  const { data: bugs, isLoading } = useBugsByCompany(companyId)
  useBugRealtime()

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  const isStaff = state.resolution.type === 'admin' || state.resolution.type === 'dev'
  if (!isStaff) {
    return <Navigate to={state.resolution.type === 'company' ? '/projetos' : '/acesso-nao-configurado'} replace />
  }
  if (!companyId) {
    return <Navigate to="/empresas" replace />
  }

  const currentUserId = state.session.user.id
  const company = companies?.find((c) => c.id === companyId)
  const selectedBug = bugs?.find((bug) => bug.id === selectedBugId) ?? null

  return (
    <div>
      {selectedBug ? (
        <BugDetail
          bug={selectedBug}
          canManage
          currentUserId={currentUserId}
          onBack={() => setSelectedBugId(null)}
        />
      ) : (
        <>
          <PageHeader
            title={company?.name ?? 'Empresa'}
            description="Fila de bugs de todos os projetos desta empresa."
            action={
              <Button variant="outline" size="sm" onClick={() => navigate('/empresas')}>
                Voltar
              </Button>
            }
          />
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando bugs...</p>
          ) : (
            <BugList bugs={bugs ?? []} onSelectBug={(bug) => setSelectedBugId(bug.id)} />
          )}
        </>
      )}
    </div>
  )
}
