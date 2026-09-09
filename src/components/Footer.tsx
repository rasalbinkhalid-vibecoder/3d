import { content } from '../content'
import './footer.css'

export function Footer() {
  return (
    <footer id="locations" className="site-footer">
      <div className="container site-footer-inner">
        <span>{content.brandName}</span>
        <span className="site-footer-locations">{content.footer.locations}</span>
        <span>{content.footer.follow}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
