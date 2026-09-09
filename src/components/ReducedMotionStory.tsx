import { useLanguage } from '../i18n/LanguageContext'
import { useInView } from '../hooks/useInView'
import './reducedStory.css'

const STAGE_COLORS = ['#e8a99b', '#c25a3a', '#e9d3ab', '#e8a53f', '#9a4c17', '#7a3d10']

function RevealRow({
  index,
  title,
  title2,
  copy,
  tags,
  cta,
  cta2,
}: {
  index: number
  title: string
  title2?: string
  copy: string
  tags?: readonly string[]
  cta?: string
  cta2?: string
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`rstory-row ${inView ? 'is-visible' : ''}`}>
      <div className="rstory-badge" style={{ background: STAGE_COLORS[index % STAGE_COLORS.length] }} aria-hidden="true" />
      <div>
        <h2 className="rstory-title">{title}</h2>
        {title2 ? <h2 className="rstory-title">{title2}</h2> : null}
        <p className="rstory-copy">{copy}</p>
        {tags ? (
          <ul className="story-tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        {cta ? (
          <div className="story-cta-row">
            <a href="#order" className="btn btn-primary">
              {cta}
            </a>
            {cta2 ? (
              <a href="#menu" className="btn btn-ghost">
                {cta2}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function ReducedMotionStory() {
  const { t } = useLanguage()

  return (
    <section className="rstory" aria-label="The making of LIKE fried chicken">
      <p className="visually-hidden">{t.reducedMotionNote}</p>
      <div className="container rstory-hero">
        <h1 className="rstory-hero-title">{t.hero.title}</h1>
        <p className="story-hero-sub">{t.hero.sub}</p>
      </div>
      <div className="container rstory-list">
        {t.chapters.map((c, i) => (
          <RevealRow
            key={c.id}
            index={i}
            title={c.title}
            title2={c.title2}
            copy={c.copy}
            tags={c.tags}
            cta={c.cta}
            cta2={c.cta2}
          />
        ))}
      </div>
    </section>
  )
}
