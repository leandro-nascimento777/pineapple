import type { Bug, BugStatus } from '@/domain/entities/Bug'
import { cn } from '@/lib/utils'
import { BugCard } from './BugCard'
import { COLUMN_HEADER_CLASSES, STATUS_LABEL } from './bugStatusStyles'

const COLUMN_ORDER: BugStatus[] = ['aberto', 'em_tratamento', 'resolvido']

interface BugListProps {
  bugs: Bug[]
  onSelectBug: (bug: Bug) => void
}

export function BugList({ bugs, onSelectBug }: BugListProps) {
  if (bugs.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum bug registrado ainda.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMN_ORDER.map((status) => {
        const columnBugs = bugs.filter((bug) => bug.status === status)
        return (
          <div key={status} className="flex flex-col overflow-hidden rounded-xl border bg-muted/20">
            <div
              className={cn(
                'flex items-center justify-between px-4 py-3 text-sm font-semibold text-white',
                COLUMN_HEADER_CLASSES[status],
              )}
            >
              <span>{STATUS_LABEL[status]}</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs">
                {columnBugs.length}
              </span>
            </div>
            <div className="flex-1 space-y-3 p-3">
              {columnBugs.length === 0 ? (
                <p className="px-1 py-2 text-xs text-muted-foreground">Nenhum bug aqui.</p>
              ) : (
                columnBugs.map((bug) => <BugCard key={bug.id} bug={bug} onClick={() => onSelectBug(bug)} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
