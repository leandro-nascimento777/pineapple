export function PineappleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <clipPath id="pineapple-body-clip">
          <ellipse cx="12" cy="15.5" rx="6" ry="7" />
        </clipPath>
      </defs>
      <path d="M12 9 C 9 6 7 3 5.5 1" />
      <path d="M12 9 C 12 5 12 2 12 0.5" />
      <path d="M12 9 C 15 6 17 3 18.5 1" />
      <path d="M12 9 C 10 5.5 8.5 3.5 7 2" />
      <path d="M12 9 C 14 5.5 15.5 3.5 17 2" />
      <ellipse cx="12" cy="15.5" rx="6" ry="7" />
      <g clipPath="url(#pineapple-body-clip)" strokeWidth="0.9">
        <path d="M6 11 L 14 22" />
        <path d="M8 9 L 16 20" />
        <path d="M10 8 L 18 19" />
        <path d="M18 11 L 10 22" />
        <path d="M16 9 L 8 20" />
        <path d="M14 8 L 6 19" />
      </g>
    </svg>
  )
}

export function PineappleLogo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-wide">
      <PineappleIcon />
      PINEAPPLE
    </span>
  )
}
