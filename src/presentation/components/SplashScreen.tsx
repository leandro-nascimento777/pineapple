import { useEffect, useState } from 'react'
import { PineappleIcon } from './PineappleLogo'

const TERMINAL_LINE = '> inicializando pineapple.sys...'

const PHASE_DURATIONS = {
  icon: 700,
  terminal: 1400,
  scan: 1100,
  wordmark: 1200,
  fadeout: 600,
} as const

type Phase = 'icon' | 'terminal' | 'scan' | 'wordmark' | 'fadeout'

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>('icon')

  useEffect(() => {
    const order: Phase[] = ['icon', 'terminal', 'scan', 'wordmark', 'fadeout']
    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    order.forEach((step, index) => {
      elapsed += PHASE_DURATIONS[step]
      const next = order[index + 1]
      if (next) {
        timers.push(setTimeout(() => setPhase(next), elapsed))
      } else {
        timers.push(setTimeout(onFinish, elapsed))
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [onFinish])

  const showTerminal = phase === 'terminal' || phase === 'scan'
  const showScanline = phase === 'scan'
  const showWordmark = phase === 'wordmark' || phase === 'fadeout'

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden bg-void ${
        phase === 'fadeout' ? 'splash-fade-out' : ''
      }`}
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 40%, rgba(231, 180, 74, 0.12), transparent 60%)',
      }}
    >
      <div className="relative flex flex-col items-center gap-6">
        {showScanline && (
          <div
            aria-hidden="true"
            className="splash-scanline pointer-events-none absolute inset-x-[-50%] top-0 h-16 bg-gradient-to-b from-transparent via-gold/25 to-transparent"
          />
        )}

        {showWordmark ? (
          <img
            src="/logo/pineapple-full-dark.png"
            alt="Pineapple"
            className="splash-wordmark h-14 w-auto"
          />
        ) : (
          <PineappleIcon variant="dark" className="splash-icon h-16 w-auto" />
        )}

        {showTerminal && (
          <p className="splash-typewriter font-mono text-sm text-gold">{TERMINAL_LINE}</p>
        )}
      </div>
    </div>
  )
}
