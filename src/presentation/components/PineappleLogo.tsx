interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export function PineappleIcon({ className, variant = 'light' }: LogoProps) {
  const src = variant === 'dark' ? '/logo/pineapple-icon-dark.png' : '/logo/pineapple-icon.png'
  return <img src={src} alt="" className={className} />
}

export function PineappleLogo({ className, variant = 'dark' }: LogoProps) {
  const src = variant === 'dark' ? '/logo/pineapple-full-dark.png' : '/logo/pineapple-full.png'
  return <img src={src} alt="Pineapple" className={className} />
}
