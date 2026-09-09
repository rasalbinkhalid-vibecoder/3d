import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../i18n/LanguageContext'
import { useStoryStore } from '../store/storyStore'
import './brandMoment.css'

gsap.registerPlugin(ScrollTrigger)

export function BrandMoment() {
  const { t, lang } = useLanguage()
  const reducedMotion = useStoryStore((s) => s.reducedMotion)
  const sectionRef = useRef<HTMLDivElement>(null)
  const rowARef = useRef<HTMLDivElement>(null)
  const rowBRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const dir = lang === 'ar' ? -1 : 1

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowARef.current,
        { xPercent: -dir * 12 },
        {
          xPercent: dir * 4,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      gsap.fromTo(
        rowBRef.current,
        { xPercent: dir * 14 },
        {
          xPercent: -dir * 6,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      gsap.fromTo(
        iconRef.current,
        { rotate: -6, scale: 0.92 },
        {
          rotate: 6,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion, lang])

  return (
    <section ref={sectionRef} className="brand-moment">
      <div ref={iconRef} className="brand-moment-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path d="M32 14c9 0 15 6.5 15 14.5 0 3-1 5.6-2.7 7.8 1.6.6 2.9 2.1 2.9 4.3 0 3.3-3 5.4-6.4 5.4-1.7 0-3.2-.6-4.3-1.6-1.4.7-3 .1-3-1.6h-3c0 1.7-1.6 2.3-3 1.6-1.1 1-2.6 1.6-4.3 1.6-3.4 0-6.4-2.1-6.4-5.4 0-2.2 1.3-3.7 2.9-4.3C18 34.1 17 31.5 17 28.5 17 20.5 23 14 32 14z" />
        </svg>
      </div>
      <div className="brand-moment-rows">
        <div ref={rowARef} className="brand-moment-row">
          <span>{t.brandMoment.line1}</span>
          <span>{t.brandMoment.line1}</span>
          <span>{t.brandMoment.line1}</span>
        </div>
        <div ref={rowBRef} className="brand-moment-row brand-moment-row--outline">
          <span>{t.brandMoment.line2}</span>
          <span>{t.brandMoment.line2}</span>
          <span>{t.brandMoment.line2}</span>
        </div>
      </div>
    </section>
  )
}
