import { Navigate, useNavigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useProjects } from '@/application/hooks/useProjects'
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
    return <Navigate to={state.resolution.type === 'admin' ? '/admin/projetos' : '/acesso-nao-configurado'} replace />
  }

  const company = state.resolution.company

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{company.name}</h1>
        <p className="text-sm text-muted-foreground">Selecione um projeto para ver os bugs.</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando projetos...</p>
      ) : (
        <ProjectPicker projects={projects ?? []} onSelect={(project) => navigate(`/dashboard/${project.id}`)} />
      )}
    </div>
  )
}
