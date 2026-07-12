const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-emerald-500',
  'bg-pink-500',
  'bg-indigo-500',
]

export function initialsFor(value: string): string {
  const trimmed = value.trim()
  if (trimmed.includes(' ')) {
    const [first, second] = trimmed.split(/\s+/)
    return (first[0] + (second?.[0] ?? '')).toUpperCase()
  }
  const local = trimmed.split('@')[0]
  return local.slice(0, 2).toUpperCase()
}

export function avatarColorFor(value: string): string {
  let hash = 0
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}
