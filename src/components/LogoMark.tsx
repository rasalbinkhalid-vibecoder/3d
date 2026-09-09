export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      <circle cx="13" cy="8.5" r="4" fill="#e1361c" />
      <circle cx="19.5" cy="5.5" r="4.6" fill="#e1361c" />
      <circle cx="26" cy="8.5" r="4" fill="#e1361c" />
      <path d="M29 16.5l7.5 3.5-7.5 3.5z" fill="#e1361c" />
      <rect x="5.5" y="10.5" width="27" height="24" rx="13" fill="#f3893a" />
    </svg>
  )
}
