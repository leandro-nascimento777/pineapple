import { Navigate, useNavigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useProjects } from '@/application/hooks/useProjects'
import { PageHeader } from '@/presentation/components/PageHeader'
import { ProjectPicker } from '@/presentation/components/ProjectPicker'

export function ProjectSelection() {
  const { state } = useAccessResolution()
  const navigate = useNavigate()
  const companyId = state.status === 'resolved' && state.resolution.type === 'company' ? state.resolution.company.id : undefined
  const { data: projects, isLoading } = useProjects(companyId)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type !== 'company') {
    const isStaff = state.resolution.type === 'admin' || state.resolution.type === 'dev'
    return <Navigate to={isStaff ? '/empresas' : '/acesso-nao-configurado'} replace />
  }

  const company = state.resolution.company

  return (
    <div>
      <PageHeader title={company.name} description="Selecione um projeto para ver os bugs." />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando projetos...</p>
      ) : (
        <ProjectPicker projects={projects ?? []} onSelect={(project) => navigate(`/dashboard/${project.id}`)} />
      )}
    </div>
  )
}
