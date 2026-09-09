import { useEffect, useMemo, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { useStoryStore } from '../store/storyStore'
import './finalCta.css'

const CRUMB_COUNT = 26

export function FinalCta() {
  const { t } = useLanguage()
  const reducedMotion = useStoryStore((s) => s.reducedMotion)
  const sectionRef = useRef<HTMLDivElement>(null)
  const crumbRefs = useRef<(HTMLSpanElement | null)[]>([])

  const crumbs = useMemo(
    () =>
      Array.from({ length: CRUMB_COUNT }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 8,
      })),
    [],
  )

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top

      crumbRefs.current.forEach((el) => {
        if (!el) return
        const cx = parseFloat(el.dataset.left ?? '0') * rect.width / 100
        const cy = parseFloat(el.dataset.top ?? '0') * rect.height / 100
        const dx = cx - px
        const dy = cy - py
        const dist = Math.hypot(dx, dy)
        const radius = 140
        if (dist < radius) {
          const force = (1 - dist / radius) * 26
          const angle = Math.atan2(dy, dx)
          el.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`
        } else {
          el.style.transform = 'translate(0, 0)'
        }
      })
    }

    section.addEventListener('pointermove', handlePointerMove)
    return () => section.removeEventListener('pointermove', handlePointerMove)
  }, [reducedMotion])

  return (
    <section id="order" ref={sectionRef} className="final-cta">
      <div className="final-cta-crumbs" aria-hidden="true">
        {crumbs.map((c, i) => (
          <span
            key={i}
            ref={(el) => {
              crumbRefs.current[i] = el
            }}
            className="final-cta-crumb"
            data-top={c.top}
            data-left={c.left}
            style={{ top: `${c.top}%`, left: `${c.left}%`, width: c.size, height: c.size }}
          />
        ))}
      </div>

      <div className="container final-cta-inner">
        <h2>{t.finalCta.title}</h2>
        <a href="#" className="btn btn-primary final-cta-btn">
          {t.finalCta.button} →
        </a>

        <div className="final-cta-links">
          <a href="#" className="final-cta-link">
            {t.finalCta.locations}
          </a>
          <span className="final-cta-divider" aria-hidden="true" />
          <div className="final-cta-social">
            <span className="final-cta-follow">{t.finalCta.follow}</span>
            <a href="#" aria-label="Instagram">
              IG
            </a>
            <a href="#" aria-label="TikTok">
              TT
            </a>
            <a href="#" aria-label="X">
              X
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
