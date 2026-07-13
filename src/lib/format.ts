export function formatShortId(id: string): string {
  return id.slice(0, 8).toUpperCase()
}

export function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
