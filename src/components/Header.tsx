import { useEffect, useState } from 'react'
import { content } from '../content'
import { LogoMark } from './LogoMark'
import './header.css'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand-mark" href="#top" aria-label={content.brandName}>
          <LogoMark />
          <span className="brand-mark-text">
            <span className="brand-mark-name">{content.brandName}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#menu">{content.nav.menu}</a>
          <a href="#top">{content.nav.story}</a>
          <a href="#locations">{content.nav.locations}</a>
        </nav>

        <div className="site-header-actions">
          <span className="lang-chip">EN</span>
          <a href="#order" className="btn btn-primary site-order-btn">
            {content.nav.order}
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu${menuOpen ? ' is-open' : ''}`}>
        <a href="#menu" onClick={() => setMenuOpen(false)}>
          {content.nav.menu}
        </a>
        <a href="#top" onClick={() => setMenuOpen(false)}>
          {content.nav.story}
        </a>
        <a href="#locations" onClick={() => setMenuOpen(false)}>
          {content.nav.locations}
        </a>
        <a href="#order" className="btn btn-primary mobile-menu-cta" onClick={() => setMenuOpen(false)}>
          {content.nav.order}
        </a>
      </div>
    </header>
  )
}
