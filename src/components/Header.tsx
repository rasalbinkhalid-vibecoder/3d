import { useLanguage } from '../i18n/LanguageContext'
import './header.css'

export function Header() {
  const { t, lang, setLang } = useLanguage()

  return (
    <header className="site-header">
      <div className="site-header-inner">
      <a className="brand-mark" href="#top" aria-label={t.brandName}>
        <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
          <circle cx="32" cy="32" r="32" fill="#e1361c" />
          <path
            d="M32 14c9 0 15 6.5 15 14.5 0 3-1 5.6-2.7 7.8 1.6.6 2.9 2.1 2.9 4.3 0 3.3-3 5.4-6.4 5.4-1.7 0-3.2-.6-4.3-1.6-1.4.7-3 .1-3-1.6h-3c0 1.7-1.6 2.3-3 1.6-1.1 1-2.6 1.6-4.3 1.6-3.4 0-6.4-2.1-6.4-5.4 0-2.2 1.3-3.7 2.9-4.3C18 34.1 17 31.5 17 28.5 17 20.5 23 14 32 14z"
            fill="#fff6e9"
          />
          <circle cx="26.5" cy="27" r="2.4" fill="#241712" />
          <circle cx="37.5" cy="27" r="2.4" fill="#241712" />
        </svg>
        <span>{t.brandName}</span>
      </a>

      <nav className="site-nav" aria-label="Primary">
        <a href="#menu">{t.nav.menu}</a>
        <a href="#top">{t.nav.story}</a>
      </nav>

      <div className="site-header-actions">
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
          aria-label="Toggle language"
        >
          {lang === 'en' ? 'ع' : 'EN'}
        </button>
        <a href="#order" className="btn btn-primary site-order-btn">
          {t.nav.order}
        </a>
      </div>
      </div>
    </header>
  )
}
