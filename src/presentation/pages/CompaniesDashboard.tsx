import { Navigate, useNavigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useCompanies } from '@/application/hooks/useCompanies'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/presentation/components/PageHeader'

export function CompaniesDashboard() {
  const { state } = useAccessResolution()
  const navigate = useNavigate()
  const { data: companies, isLoading } = useCompanies()

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

  return (
    <div>
      <PageHeader title="Empresas" description="Selecione uma empresa para ver a fila de bugs." />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando empresas...</p>
      ) : companies && companies.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card
              key={company.id}
              onClick={() => navigate(`/empresas/${company.id}`)}
              className="cursor-pointer transition hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-base">{company.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
      )}
    </div>
  )
}
