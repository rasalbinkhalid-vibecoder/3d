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
  const sideLabelRefs = useRef<(HTMLDivElement | null)[]>([])
  const scriptRefs = useRef<(HTMLDivElement | null)[]>([])
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([])
  const hintRef = useRef<HTMLDivElement>(null)
  const hintLabelRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])

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
      }

      chapterRefs.current.forEach((el, i) => {
        if (!el) return
        const start = i + 1 // acts index 1..6
        const group = [el, sideLabelRefs.current[i], scriptRefs.current[i], badgeRefs.current[i]].filter(
          (node): node is HTMLDivElement => Boolean(node),
        )
        tl.fromTo(group, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.3 }, start - 0.28)
        const isLast = i === chapterRefs.current.length - 1
        if (!isLast) {
          tl.to(group, { autoAlpha: 0, y: -30, duration: 0.28 }, start + 0.62)
        } else {
          tl.to(group, { autoAlpha: 0, y: -20, duration: 0.25 }, ACTS - 0.15)
        }

        tl.call(
          () => {
            dotRefs.current.forEach((d, idx) => d?.classList.toggle('is-active', idx === i + 1))
            if (counterRef.current) {
              counterRef.current.textContent = `${String(i + 2).padStart(2, '0')} / ${String(ACTS).padStart(2, '0')}`
            }
            if (hintLabelRef.current) {
              hintLabelRef.current.textContent = t.chapters[i].scrollLabel
            }
          },
          undefined,
          start,
        )
      })

      tl.call(
        () => {
          dotRefs.current.forEach((d, idx) => d?.classList.toggle('is-active', idx === 0))
          if (counterRef.current) counterRef.current.textContent = `01 / ${String(ACTS).padStart(2, '0')}`
          if (hintLabelRef.current) hintLabelRef.current.textContent = t.hero.scroll
        },
        undefined,
        0,
      )
    }, wrap)

    return () => ctx.revert()
  }, [reducedMotion, setPlayhead, t])

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
              <h2 className="story-chapter-title">{c.title}</h2>
              {c.title2 ? <h2 className="story-chapter-title story-chapter-title--2">{c.title2}</h2> : null}
              <p className="story-chapter-copy">{c.copy}</p>
              {c.tags ? (
                <ul className="story-tags">
                  {c.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
              {c.cta ? (
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

          {t.chapters.map((c, i) => (
            <div
              key={`side-${c.id}`}
              ref={(el) => {
                sideLabelRefs.current[i] = el
              }}
              className={`story-side-label story-side-label--${c.id}`}
              style={{ opacity: 0 }}
            >
              {c.sideLabel.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span className="story-side-label-rule" aria-hidden="true" />
            </div>
          ))}

          {t.chapters.map((c, i) => (
            <div
              key={`script-${c.id}`}
              ref={(el) => {
                scriptRefs.current[i] = el
              }}
              className={`story-script story-script--${c.id}`}
              style={{ opacity: 0 }}
            >
              {c.script}
            </div>
          ))}

          {t.chapters.map((c, i) => (
            <div
              key={`badge-${c.id}`}
              ref={(el) => {
                badgeRefs.current[i] = el
              }}
              className={`story-badge story-badge--${c.id}`}
              style={{ opacity: 0 }}
            >
              <span className="story-badge-inner">
                {c.badge.top}
                <span className="story-badge-heart" aria-hidden="true">
                  ♥
                </span>
                {c.badge.bottom}
              </span>
            </div>
          ))}
        </div>

        <div ref={hintRef} className="story-hint" style={{ opacity: 0 }}>
          <span className="story-hint-mouse" aria-hidden="true">
            <span className="story-hint-dot" />
          </span>
          <span className="story-hint-label">
            <span ref={hintLabelRef}>{t.hero.scroll}</span>
            <span aria-hidden="true">↓</span>
          </span>
        </div>

        <div className="story-progress" aria-hidden="true">
          <div className="story-progress-dots">
            {Array.from({ length: ACTS }).map((_, i) => (
              <span
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el
                }}
                className={`story-progress-dot${i === 0 ? ' is-active' : ''}`}
              />
            ))}
          </div>
          <span ref={counterRef} className="story-progress-counter">
            01 / {String(ACTS).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
