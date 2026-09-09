import { useLanguage } from '../i18n/LanguageContext'
import './footer.css'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span>{t.brandName}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
