import { useRef } from 'react'
import { useProgressStore } from '../store/progressStore'

interface MenuCardProps {
  name: string
  desc: string
  price: string
  accent: string
  icon: 'drumstick' | 'spicy' | 'burger' | 'tenders' | 'fries' | 'sauce'
}

const ICONS: Record<MenuCardProps['icon'], JSX.Element> = {
  drumstick: (
    <path d="M46 22c0 10-7 17-16 17-2 0-4 3-6 5-3 3-9 3-11-1-2-4 1-8 4-9 2-1 4-3 5-5-3-2-5-6-5-11C17 9 25 4 33 6c8 2 13 8 13 16z" />
  ),
  spicy: (
    <path d="M20 12c8-4 20-2 24 8 3 8-1 16-8 22-3 2-2 6 1 6-8 3-19-2-22-11-2-7 1-13 5-17-2-3-2-6 0-8z" />
  ),
  burger: (
    <path d="M8 24c0-8 11-14 24-14s24 6 24 14H8zm0 6h48v4c0 2-2 4-4 4H12c-2 0-4-2-4-4v-4zm2 12h44l-3 6c-1 2-3 3-5 3H18c-2 0-4-1-5-3l-3-6z" />
  ),
  tenders: (
    <path d="M10 18c6-6 14-6 19-1l21 21c4 4 4 10 0 14s-10 4-14 0L15 31c-5-5-5-13-5-13z" />
  ),
  fries: (
    <path d="M14 20h4v26h-4zM22 14h4v32h-4zM30 20h4v26h-4zM38 14h4v32h-4zM10 44h34l-2 4H12z" />
  ),
  sauce: (
    <path d="M24 8h12v6h4c2 0 4 2 4 4v26c0 2-2 4-4 4H20c-2 0-4-2-4-4V18c0-2 2-4 4-4h4V8z" />
  ),
}

export function MenuCard({ name, desc, price, accent, icon }: MenuCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useProgressStore((s) => s.reducedMotion)

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`)
    ref.current.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`)
    ref.current.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`)
  }

  const handleLeave = () => {
    if (!ref.current) return
    ref.current.style.setProperty('--rx', `0deg`)
    ref.current.style.setProperty('--ry', `0deg`)
  }

  return (
    <div
      ref={ref}
      className="menu-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      tabIndex={0}
    >
      <div className="menu-card-visual" style={{ background: accent }}>
        <svg viewBox="0 0 56 56" className="menu-card-icon" aria-hidden="true">
          {ICONS[icon]}
        </svg>
        <span className="menu-card-crumb menu-card-crumb--a" />
        <span className="menu-card-crumb menu-card-crumb--b" />
        <span className="menu-card-crumb menu-card-crumb--c" />
      </div>
      <div className="menu-card-body">
        <div className="menu-card-row">
          <h3>{name}</h3>
          <span className="menu-card-price">{price}</span>
        </div>
        <p>{desc}</p>
      </div>
    </div>
  )
}
