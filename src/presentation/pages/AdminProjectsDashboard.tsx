import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useProjects } from '@/application/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { ProjectPicker } from '@/presentation/components/ProjectPicker'

export function AdminProjectsDashboard() {
  const { state } = useAccessResolution()
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects(undefined)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type !== 'admin') {
    return <Navigate to={state.resolution.type === 'company' ? '/projetos' : '/acesso-nao-configurado'} replace />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Todos os projetos</h1>
          <p className="text-sm text-muted-foreground">Selecione um projeto para ver os bugs.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin">Gerenciar</Link>
        </Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando projetos...</p>
      ) : (
        <ProjectPicker
          projects={projects ?? []}
          groupByCompany
          onSelect={(project) => navigate(`/dashboard/${project.id}`)}
        />
      )}
    </div>
  )
}
