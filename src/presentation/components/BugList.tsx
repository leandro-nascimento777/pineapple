import type { Bug } from '@/domain/entities/Bug'
import { BugCard } from './BugCard'

interface BugListProps {
  bugs: Bug[]
  onSelectBug: (bug: Bug) => void
}

export function BugList({ bugs, onSelectBug }: BugListProps) {
  if (bugs.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum bug registrado neste projeto ainda.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bugs.map((bug) => (
        <BugCard key={bug.id} bug={bug} onClick={() => onSelectBug(bug)} />
      ))}
    </div>
  )
}
