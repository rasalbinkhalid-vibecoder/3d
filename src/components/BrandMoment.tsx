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
        <svg viewBox="0 0 40 40">
          <circle cx="13" cy="8.5" r="4" />
          <circle cx="19.5" cy="5.5" r="4.6" />
          <circle cx="26" cy="8.5" r="4" />
          <path d="M29 16.5l7.5 3.5-7.5 3.5z" />
          <rect x="5.5" y="10.5" width="27" height="24" rx="13" />
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
