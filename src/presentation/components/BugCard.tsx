import type { Bug, BugStatus } from '@/domain/entities/Bug'
import { formatShortId, formatTimestamp } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from './Avatar'
import { STATUS_CARD_CLASSES, STATUS_LABEL, STATUS_SIGNAL_CLASSES } from './bugStatusStyles'

export function BugStatusBadge({ status }: { status: BugStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-hairline bg-panel px-2.5 py-1 font-mono text-[11px] font-medium tracking-wider uppercase',
        STATUS_SIGNAL_CLASSES[status],
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  )
}

interface BugCardProps {
  bug: Bug
  onClick?: () => void
}

export function BugCard({ bug, onClick }: BugCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/[0.04] hover:shadow-xl',
        STATUS_CARD_CLASSES[bug.status],
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{bug.titulo}</CardTitle>
          <BugStatusBadge status={bug.status} />
        </div>
        <CardDescription className="flex flex-wrap items-center gap-2">
          {bug.projectName && <span>{bug.projectName}</span>}
          <span className="rounded border border-hairline bg-panel px-1.5 py-0.5 font-mono text-[11px] text-dim">
            {bug.setorNome}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{bug.descricao}</p>
        <div className="flex items-center gap-3 font-mono text-[11px] text-dim">
          <span>#{formatShortId(bug.id)}</span>
          <span>{formatTimestamp(bug.createdAt)}</span>
        </div>
        {bug.assumidoPorNome && (
          <div className="flex items-center gap-2">
            <Avatar label={bug.assumidoPorNome} />
            <span className="text-xs text-muted-foreground">{bug.assumidoPorNome}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
