import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAccessResolution } from '@/application/hooks/useAccessResolution'
import { useBugRealtime } from '@/application/hooks/useBugRealtime'
import { useBugs } from '@/application/hooks/useBugs'
import { useProjects } from '@/application/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BugDetail } from '@/presentation/components/BugDetail'
import { BugForm } from '@/presentation/components/BugForm'
import { BugList } from '@/presentation/components/BugList'

export function CompanyDashboard() {
  const { state } = useAccessResolution()
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null)

  const isAdmin = state.status === 'resolved' && state.resolution.type === 'admin'
  const companyId = state.status === 'resolved' && state.resolution.type === 'company' ? state.resolution.company.id : undefined

  const { data: projects } = useProjects(isAdmin ? undefined : companyId)
  const { data: bugs, isLoading } = useBugs(projectId)
  useBugRealtime(projectId)

  if (state.status === 'loading') {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }
  if (state.status === 'logged_out') {
    return <Navigate to="/login" replace />
  }
  if (state.resolution.type === 'pending') {
    return <Navigate to="/acesso-nao-configurado" replace />
  }
  if (!projectId) {
    return <Navigate to={isAdmin ? '/admin/projetos' : '/projetos'} replace />
  }

  const currentUserId = state.session.user.id
  const project = projects?.find((p) => p.id === projectId)
  const selectedBug = bugs?.find((bug) => bug.id === selectedBugId) ?? null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project?.name ?? 'Projeto'}</h1>
          {isAdmin && project && <p className="text-sm text-muted-foreground">{project.companyName}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate(isAdmin ? '/admin/projetos' : '/projetos')}>
          Voltar
        </Button>
      </div>

      {selectedBug ? (
        <BugDetail
          bug={selectedBug}
          isAdmin={isAdmin}
          currentUserId={currentUserId}
          onBack={() => setSelectedBugId(null)}
        />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Novo bug</CardTitle>
            </CardHeader>
            <CardContent>
              {project && (
                <BugForm projectId={projectId} companyId={project.companyId} criadoPor={currentUserId} />
              )}
            </CardContent>
          </Card>

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
