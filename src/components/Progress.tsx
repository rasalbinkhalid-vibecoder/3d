import { CHAPTERS } from '../animation/chapters'
import { useProgressStore } from '../store/progressStore'
import './progress.css'

const LABELS: Record<string, string> = {
  intro: 'Intro',
  fresh: 'Fresh',
  marinade: 'Marinade',
  coating: 'Coating',
  frying: 'Frying',
  reveal: 'Reveal',
  meal: 'Meal',
}

export function Progress() {
  const activeChapterIndex = useProgressStore((s) => s.activeChapterIndex)

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-dots">
        {CHAPTERS.map((c, i) => (
          <span key={c.id} className={`scroll-progress-dot${i === activeChapterIndex ? ' is-active' : ''}`} />
        ))}
      </div>
      <span className="scroll-progress-label">
        {LABELS[CHAPTERS[activeChapterIndex].id]} · {String(activeChapterIndex + 1).padStart(2, '0')}/
        {String(CHAPTERS.length).padStart(2, '0')}
      </span>
    </div>
  )
}
