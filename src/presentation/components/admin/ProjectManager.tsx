import { useState, type FormEvent } from 'react'
import { useCreateProject } from '@/application/hooks/useCreateProject'
import { useProjects } from '@/application/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProjectManagerProps {
  companyId: string
}

export function ProjectManager({ companyId }: ProjectManagerProps) {
  const { data: projects, isLoading } = useProjects(companyId)
  const createProject = useCreateProject()
  const [name, setName] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createProject.mutateAsync({ companyId, name })
    setName('')
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="project-name">Novo projeto</Label>
          <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <Button type="submit" disabled={createProject.isPending}>
          {createProject.isPending ? 'Salvando...' : 'Adicionar'}
        </Button>
      </form>
      {createProject.isError && <p className="text-sm text-destructive">Erro ao criar projeto.</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : projects && projects.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {projects.map((project) => (
            <li key={project.id} className="border-b py-1.5 last:border-0">
              {project.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum projeto cadastrado nesta empresa ainda.</p>
      )}
    </div>
  )
}
