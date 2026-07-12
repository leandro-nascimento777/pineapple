import type { Bug, BugStatus } from '@/domain/entities/Bug'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from './Avatar'
import { STATUS_BADGE_CLASSES, STATUS_CARD_CLASSES, STATUS_LABEL } from './bugStatusStyles'

export function BugStatusBadge({ status }: { status: BugStatus }) {
  return (
    <Badge variant="outline" className={STATUS_BADGE_CLASSES[status]}>
      {STATUS_LABEL[status]}
    </Badge>
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
      className={cn('cursor-pointer transition hover:shadow-md', STATUS_CARD_CLASSES[bug.status])}
    >
      <CardHeader>
        <CardTitle className="text-base">{bug.titulo}</CardTitle>
        <CardDescription>
          {bug.projectName ? `${bug.projectName} · ` : ''}
          {bug.setorNome}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{bug.descricao}</p>
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
