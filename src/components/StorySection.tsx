import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { StoryCanvas } from '../three/StoryCanvas'
import { useStoryStore } from '../store/storyStore'
import { useLanguage } from '../i18n/LanguageContext'
import { ReducedMotionStory } from './ReducedMotionStory'
import './story.css'

gsap.registerPlugin(ScrollTrigger)

const ACTS = 7 // hero + 6 chapters

export function StorySection() {
  const { t } = useLanguage()
  const reducedMotion = useStoryStore((s) => s.reducedMotion)
  const isMobile = useStoryStore((s) => s.isMobile)
  const setPlayhead = useStoryStore((s) => s.setPlayhead)

  const wrapRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([])
  const hintRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return
    const wrap = wrapRef.current
    if (!wrap) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: (self) => {
            setPlayhead(self.progress * ACTS)
          },
        },
        defaults: { ease: 'none' },
      })

      if (heroRef.current) {
        tl.to(heroRef.current, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.05)
        tl.to(heroRef.current, { autoAlpha: 0, y: -30, duration: 0.3 }, 0.72)
      }
      if (hintRef.current) {
        tl.to(hintRef.current, { autoAlpha: 1, duration: 0.2 }, 0.15)
        tl.to(hintRef.current, { autoAlpha: 0, duration: 0.2 }, 0.55)
      }

      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        const start = i + 1 // acts index 1..6
        tl.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.3 }, start - 0.28)
        const isLast = i === chapterRefs.current.length - 1
        if (!isLast) {
          tl.to(el, { autoAlpha: 0, y: -30, duration: 0.28 }, start + 0.62)
        } else {
          tl.to(el, { autoAlpha: 0, y: -20, duration: 0.25 }, ACTS - 0.15)
        }
      })
    }, wrap)

    return () => ctx.revert()
  }, [reducedMotion, setPlayhead])

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  if (reducedMotion) {
    return <ReducedMotionStory />
  }

  return (
    <section
      ref={wrapRef}
      className="story"
      style={{ height: `${ACTS * 108}vh` }}
      aria-label="The making of LIKE fried chicken"
    >
      <div className="story-sticky">
        <StoryCanvas isMobile={isMobile} />

        <div className="story-overlay">
          <div ref={heroRef} className="story-hero" style={{ opacity: 0 }}>
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 className="story-hero-title">{t.hero.title}</h1>
            <p className="story-hero-sub">{t.hero.sub}</p>
          </div>

          {t.chapters.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                chapterRefs.current[i] = el
              }}
              className={`story-chapter story-chapter--${c.id}`}
              style={{ opacity: 0 }}
            >
              <p className="eyebrow">{c.kicker}</p>
              <h2 className="story-chapter-title">{c.title}</h2>
              {'title2' in c && c.title2 ? <h2 className="story-chapter-title story-chapter-title--2">{c.title2}</h2> : null}
              <p className="story-chapter-copy">{c.copy}</p>
              {'tags' in c && c.tags ? (
                <ul className="story-tags">
                  {c.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              {'cta' in c && c.cta ? (
                <div className="story-cta-row">
                  <a href="#order" className="btn btn-primary">
                    {c.cta}
                  </a>
                  <a href="#menu" className="btn btn-ghost story-cta-ghost">
                    {c.cta2}
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div ref={hintRef} className="story-hint" style={{ opacity: 0 }}>
          <span>{t.hero.scroll}</span>
          <span className="story-hint-arrow" aria-hidden="true">
            ↓
          </span>
        </div>
      </div>
    </section>
  )
}
