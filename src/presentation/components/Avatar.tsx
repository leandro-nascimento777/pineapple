import { avatarColorFor, initialsFor } from '@/lib/avatar'
import { cn } from '@/lib/utils'

interface AvatarProps {
  label: string
  className?: string
}

export function Avatar({ label, className }: AvatarProps) {
  return (
    <span
      title={label}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white',
        avatarColorFor(label),
        className,
      )}
    >
      {initialsFor(label)}
    </span>
  )
}
