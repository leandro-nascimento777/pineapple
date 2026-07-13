import type { Bug, BugStatus } from '@/domain/entities/Bug'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
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
        'flex-row items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/[0.04] hover:shadow-xl',
        STATUS_CARD_CLASSES[bug.status],
      )}
    >
      <span className="truncate text-sm font-medium">{bug.titulo}</span>
      <BugStatusBadge status={bug.status} />
    </Card>
  )
}
