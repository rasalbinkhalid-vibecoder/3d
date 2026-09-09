import { useLanguage } from '../i18n/LanguageContext'
import { LogoMark } from './LogoMark'
import './header.css'

export function Header() {
  const { t, lang, setLang } = useLanguage()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand-mark" href="#top" aria-label={t.brandName}>
          <LogoMark />
          <span className="brand-mark-text">
            <span className="brand-mark-name">{t.brandName}</span>
            <span className="brand-mark-tagline">{t.brandTagline}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          <a href="#menu">{t.nav.menu}</a>
          <a href="#top">{t.nav.story}</a>
          <a href="#locations">{t.nav.locations}</a>
        </nav>

        <div className="site-header-actions">
          <button type="button" className="icon-btn" aria-label="Search">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <line x1="14" y1="14" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <span className="header-divider" aria-hidden="true" />

          <button
            type="button"
            className="lang-toggle"
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'EN' : 'ع'}
            <svg viewBox="0 0 12 8" width="10" height="7" aria-hidden="true">
              <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <a href="#order" className="btn btn-primary site-order-btn">
            {t.nav.order}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </header>
  )
}
