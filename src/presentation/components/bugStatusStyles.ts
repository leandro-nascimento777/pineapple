import type { BugStatus } from '@/domain/entities/Bug'

export const STATUS_LABEL: Record<BugStatus, string> = {
  aberto: 'Em fila',
  em_tratamento: 'Em análise',
  resolvido: 'Resolvido',
}

export const STATUS_BADGE_CLASSES: Record<BugStatus, string> = {
  aberto: 'border-border bg-muted text-foreground',
  em_tratamento:
    'border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-300',
  resolvido:
    'border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-900/30 dark:text-emerald-300',
}

export const STATUS_CARD_CLASSES: Record<BugStatus, string> = {
  aberto: 'border-t-4 border-t-slate-400 dark:border-t-slate-500',
  em_tratamento: 'border-t-4 border-t-amber-400',
  resolvido: 'border-t-4 border-t-emerald-500',
}

export const COLUMN_HEADER_CLASSES: Record<BugStatus, string> = {
  aberto: 'bg-slate-600',
  em_tratamento: 'bg-amber-500',
  resolvido: 'bg-emerald-600',
}
