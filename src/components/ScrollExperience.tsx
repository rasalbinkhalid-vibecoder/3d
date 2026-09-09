import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { StoryCanvas } from '../three/StoryCanvas'
import { HeroCopy } from './HeroCopy'
import { OrderCTA } from './OrderCTA'
import { Progress } from './Progress'
import { content } from '../content'
import { useProgressStore } from '../store/progressStore'
import { createMasterProgressTrigger, revealOnEnter, killAllScrollTriggers } from '../animation/scrollTimeline'
import './experience.css'

export function ScrollExperience() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const revealRefs = useRef<(HTMLDivElement | null)[]>([])
  const revealHeadingRef = useRef<HTMLDivElement>(null)
  const isMobile = useProgressStore((s) => s.isMobile)
  const reducedMotion = useProgressStore((s) => s.reducedMotion)

  const register = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el)
  }

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const ctx = gsap.context(() => {
      createMasterProgressTrigger(wrapper)
      revealRefs.current.forEach((el) => {
        if (el) revealOnEnter(el, reducedMotion)
      })

      // reveal chapter: "HEAR THAT?" crossfades to "THAT'S LIKE." on continued scroll
      const revealSection = document.getElementById('reveal')
      const line1 = revealHeadingRef.current?.querySelector<HTMLElement>('.reveal-line-1')
      const line2 = revealHeadingRef.current?.querySelector<HTMLElement>('.reveal-line-2')
      if (revealSection && line1 && line2) {
        gsap.set(line2, { autoAlpha: 0, position: 'absolute', inset: 0 })
        gsap.timeline({
          scrollTrigger: { trigger: revealSection, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
        })
          .to(line1, { autoAlpha: 1, duration: 0.25 }, 0.15)
          .to(line1, { autoAlpha: 0, duration: 0.2 }, 0.55)
          .to(line2, { autoAlpha: 1, duration: 0.25 }, 0.6)
      }
    }, wrapper)

    return () => {
      ctx.revert()
      killAllScrollTriggers()
    }
  }, [reducedMotion])

  return (
    <div ref={wrapperRef} className="scroll-experience">
      <StoryCanvas isMobile={isMobile} reducedMotion={reducedMotion} />
      <Progress />

      <section id="intro" className="chapter chapter--intro" aria-label="LIKE — Love it krispy-er">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <HeroCopy />
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-sub">{content.hero.sub}</p>
              <span className="scroll-cue">
                {content.hero.scroll} <span aria-hidden="true">↓</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="fresh" className="chapter chapter--fresh" aria-label="It starts fresh">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <p className="chapter-kicker">Chapter 02 — Fresh</p>
              <h2 className="chapter-title">{content.fresh.title}</h2>
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-copy">{content.fresh.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="marinade" className="chapter chapter--marinade" aria-label="Soaked in flavor">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <p className="chapter-kicker chapter-kicker--light">Chapter 03 — Marinade</p>
              <h2 className="chapter-title chapter-title--light">
                {content.marinade.titleLine1}
                <br />
                {content.marinade.titleLine2}
              </h2>
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-copy chapter-copy--light">{content.marinade.copy}</p>
              <ul className="chapter-callouts chapter-callouts--light">
                {content.marinade.callouts.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="coating" className="chapter chapter--coating" aria-label="Coated for the crunch">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <p className="chapter-kicker">Chapter 04 — Coating</p>
              <h2 className="chapter-title">
                {content.coating.titleLine1}
                <br />
                {content.coating.titleLine2}
              </h2>
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-copy">{content.coating.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="frying" className="chapter chapter--frying" aria-label="This is where the magic happens">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <p className="chapter-kicker chapter-kicker--light">Chapter 05 — Frying</p>
              <h2 className="chapter-title chapter-title--light">
                {content.frying.titleLine1}
                <br />
                {content.frying.titleLine2}
              </h2>
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-copy chapter-copy--light">{content.frying.copy}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="reveal" className="chapter chapter--reveal" aria-label="Hear that? That's LIKE.">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={revealHeadingRef} className="reveal-heading-stack">
              <h2 className="chapter-title chapter-title--light reveal-line-1">{content.reveal.title1}</h2>
              <h2 className="chapter-title chapter-title--light reveal-line-2">{content.reveal.title2}</h2>
            </div>
          </div>
          <div className="chapter-bottom" />
        </div>
      </section>

      <section id="meal" className="chapter chapter--meal" aria-label="Made to be krispy">
        <div className="chapter-sticky">
          <div className="chapter-top">
            <div ref={register} className="reveal-block">
              <p className="chapter-kicker">Chapter 07 — Meal</p>
              <h2 className="chapter-title">
                {content.meal.titleLine1}
                <br />
                {content.meal.titleLine2}
              </h2>
            </div>
          </div>
          <div className="chapter-bottom">
            <div ref={register} className="reveal-block">
              <p className="chapter-copy">{content.meal.copy}</p>
              <p className="chapter-copy-arabic" dir="rtl" lang="ar">
                {content.meal.arabic}
              </p>
              <OrderCTA primary={content.meal.cta} secondary={content.meal.cta2} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
