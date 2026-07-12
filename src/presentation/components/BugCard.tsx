import type { Bug, BugStatus } from '@/domain/entities/Bug'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const STATUS_LABEL: Record<BugStatus, string> = {
  aberto: 'Em fila',
  em_tratamento: 'Em análise',
  resolvido: 'Resolvido',
}

const STATUS_VARIANT: Record<BugStatus, 'destructive' | 'default' | 'secondary'> = {
  aberto: 'destructive',
  em_tratamento: 'default',
  resolvido: 'secondary',
}

export function BugStatusBadge({ status }: { status: BugStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}

interface BugCardProps {
  bug: Bug
  onClick?: () => void
}

export function BugCard({ bug, onClick }: BugCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer transition hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{bug.titulo}</CardTitle>
          <BugStatusBadge status={bug.status} />
        </div>
        <CardDescription>{bug.setorNome}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{bug.descricao}</p>
      </CardContent>
    </Card>
  )
}
