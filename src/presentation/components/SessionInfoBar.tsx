import { useEffect, useState } from 'react'
import type { AccessResolutionState } from '@/application/hooks/useAccessResolution'
import { formatFullDateTime } from '@/lib/format'

interface SessionInfoBarProps {
  state: AccessResolutionState
}

export function SessionInfoBar({ state }: SessionInfoBarProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [])

  if (state.status !== 'resolved' || state.resolution.type === 'pending') {
    return null
  }

  const { resolution } = state
  const companyName = resolution.type === 'company' ? resolution.company.name : null

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-hairline bg-panel px-4 py-2 text-sm">
      <span className="text-muted-foreground">
        Olá, <span className="font-medium text-foreground">{resolution.name}</span>
        {companyName && (
          <>
            {' · '}
            <span className="font-medium text-foreground">{companyName}</span>
          </>
        )}
      </span>
      <span className="font-mono text-xs text-dim">{formatFullDateTime(now)}</span>
    </div>
  )
}
