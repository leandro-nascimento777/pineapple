import type { Project } from '@/domain/entities/Project'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

interface ProjectPickerProps {
  projects: Project[]
  groupByCompany?: boolean
  onSelect: (project: Project) => void
}

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  return (
    <Card onClick={() => onSelect(project)} className="cursor-pointer transition hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{project.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export function ProjectPicker({ projects, groupByCompany = false, onSelect }: ProjectPickerProps) {
  if (projects.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum projeto disponível.</p>
  }

  if (!groupByCompany) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={onSelect} />
        ))}
      </div>
    )
  }

  const groups = new Map<string, { companyName: string; projects: Project[] }>()
  for (const project of projects) {
    const group = groups.get(project.companyId) ?? { companyName: project.companyName, projects: [] }
    group.projects.push(project)
    groups.set(project.companyId, group)
  }

  return (
    <div className="space-y-6">
      {Array.from(groups.values()).map((group) => (
        <div key={group.companyName} className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">{group.companyName}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.projects.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
