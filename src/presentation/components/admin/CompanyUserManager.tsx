import { useEffect, useState, type FormEvent } from 'react'
import { useInviteUser } from '@/application/hooks/useInviteUser'
import { useProfiles } from '@/application/hooks/useProfiles'
import { useProjectIdsByProfile } from '@/application/hooks/useProjectIdsByProfile'
import { useProjects } from '@/application/hooks/useProjects'
import { useReplaceProfileProjectAccess } from '@/application/hooks/useReplaceProfileProjectAccess'
import { useUpdateProfile } from '@/application/hooks/useUpdateProfile'
import type { Profile } from '@/domain/entities/Profile'
import type { Project } from '@/domain/entities/Project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ResetPasswordControl } from './ResetPasswordControl'

function ProjectCheckboxes({
  projects,
  selected,
  onToggle,
}: {
  projects: Project[]
  selected: string[]
  onToggle: (projectId: string) => void
}) {
  if (projects.length === 0) {
    return <p className="text-xs text-muted-foreground">Cadastre um projeto nesta empresa primeiro.</p>
  }

  return (
    <div className="flex flex-wrap gap-3">
      {projects.map((project) => (
        <label key={project.id} className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={selected.includes(project.id)}
            onChange={() => onToggle(project.id)}
          />
          {project.name}
        </label>
      ))}
    </div>
  )
}

function CompanyUserRow({
  profile,
  projects,
  companyId,
}: {
  profile: Profile
  projects: Project[]
  companyId: string
}) {
  const { data: grantedProjectIds } = useProjectIdsByProfile(profile.id)
  const updateProfile = useUpdateProfile()
  const replaceAccess = useReplaceProfileProjectAccess()
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([])

  useEffect(() => {
    if (grantedProjectIds) setSelectedProjectIds(grantedProjectIds)
  }, [grantedProjectIds])

  function toggleProject(projectId: string) {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  async function handleSave() {
    if (profile.role === 'pending') {
      await updateProfile.mutateAsync({ userId: profile.id, role: 'user', companyId })
    }
    await replaceAccess.mutateAsync({ profileId: profile.id, projectIds: selectedProjectIds })
  }

  const isPending = profile.role === 'pending'
  const isSaving = updateProfile.isPending || replaceAccess.isPending

  return (
    <li className="space-y-2 rounded-lg border border-hairline bg-void/40 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">{profile.name}</p>
          {isPending && <p className="text-xs text-muted-foreground">Aguardando atribuição a esta empresa</p>}
        </div>
        <Button size="sm" onClick={handleSave} disabled={isSaving || selectedProjectIds.length === 0}>
          {isPending ? 'Atribuir a esta empresa' : 'Salvar acesso'}
        </Button>
      </div>
      <ProjectCheckboxes projects={projects} selected={selectedProjectIds} onToggle={toggleProject} />
      <ResetPasswordControl profileId={profile.id} />
    </li>
  )
}

interface CompanyUserManagerProps {
  companyId: string
}

export function CompanyUserManager({ companyId }: CompanyUserManagerProps) {
  const { data: profiles, isLoading } = useProfiles()
  const { data: projects } = useProjects(companyId)
  const inviteUser = useInviteUser()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [inviteProjectIds, setInviteProjectIds] = useState<string[]>([])

  function toggleInviteProject(projectId: string) {
    setInviteProjectIds((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId],
    )
  }

  async function handleInvite(event: FormEvent) {
    event.preventDefault()
    await inviteUser.mutateAsync({ email, name, password, role: 'user', companyId, projectIds: inviteProjectIds })
    setEmail('')
    setName('')
    setPassword('')
    setInviteProjectIds([])
  }

  const visibleProfiles = (profiles ?? []).filter(
    (p) => p.role === 'pending' || (p.role === 'user' && p.companyId === companyId),
  )

  return (
    <div className="space-y-6">
      <form onSubmit={handleInvite} className="space-y-3 border-b border-hairline pb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="user-invite-name">Nome</Label>
            <Input id="user-invite-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-invite-email">Email</Label>
            <Input
              id="user-invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="user-invite-password">Senha</Label>
            <Input
              id="user-invite-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={inviteUser.isPending || inviteProjectIds.length === 0}>
            {inviteUser.isPending ? 'Convidando...' : 'Convidar usuário'}
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label>Acesso aos projetos</Label>
          <ProjectCheckboxes
            projects={projects ?? []}
            selected={inviteProjectIds}
            onToggle={toggleInviteProject}
          />
        </div>
      </form>
      {inviteUser.isError && <p className="text-sm text-destructive">{inviteUser.error.message}</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : visibleProfiles.length > 0 ? (
        <ul className="space-y-2">
          {visibleProfiles.map((profile) => (
            <CompanyUserRow key={profile.id} profile={profile} projects={projects ?? []} companyId={companyId} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum usuário desta empresa ainda.</p>
      )}
    </div>
  )
}
