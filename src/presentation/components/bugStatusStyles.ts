import type { BugStatus } from '@/domain/entities/Bug'

export const STATUS_LABEL: Record<BugStatus, string> = {
  aberto: 'Em fila',
  em_tratamento: 'Em análise',
  resolvido: 'Resolvido',
}

/** cor de sinal por status: vermelho = urgente/aberto, dourado = em andamento, verde = resolvido. */
export const STATUS_SIGNAL_CLASSES: Record<BugStatus, string> = {
  aberto: 'text-signal-red shadow-[0_0_8px_rgba(255,107,107,0.45)]',
  em_tratamento: 'text-gold shadow-[0_0_8px_rgba(231,180,74,0.45)]',
  resolvido: 'text-signal-green shadow-[0_0_8px_rgba(53,211,153,0.45)]',
}

export const STATUS_CARD_CLASSES: Record<BugStatus, string> = {
  aberto: 'border-t-4 border-t-signal-red/70',
  em_tratamento: 'border-t-4 border-t-gold',
  resolvido: 'border-t-4 border-t-signal-green',
}

/** cabeçalho de coluna do board: painel escuro + friso inferior colorido, ao invés de bloco sólido saturado (mais alinhado ao visual escuro/premium). */
export const COLUMN_ACCENT_CLASSES: Record<BugStatus, string> = {
  aberto: 'border-signal-red text-signal-red',
  em_tratamento: 'border-gold text-gold',
  resolvido: 'border-signal-green text-signal-green',
}
