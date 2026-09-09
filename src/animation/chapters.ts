export interface ChapterDef {
  id: 'intro' | 'fresh' | 'marinade' | 'coating' | 'frying' | 'reveal' | 'meal'
  start: number
  end: number
}

/** The single source of truth for the 0-100 scroll timeline. */
export const CHAPTERS: ChapterDef[] = [
  { id: 'intro', start: 0, end: 12 },
  { id: 'fresh', start: 12, end: 25 },
  { id: 'marinade', start: 25, end: 40 },
  { id: 'coating', start: 40, end: 55 },
  { id: 'frying', start: 55, end: 72 },
  { id: 'reveal', start: 72, end: 86 },
  { id: 'meal', start: 86, end: 100 },
]

/** Hidden hero-swap: hero LIKE logo -> raw chicken, concealed by the intro particle burst. */
export const LOGO_SWAP = { start: 9, end: 12 }

/** Hidden model-swap: raw -> fried, concealed at peak flour coverage. */
export const CHICKEN_SWAP = { start: 46, end: 49.5 }

export function chapterAt(progress: number): ChapterDef {
  for (const c of CHAPTERS) {
    if (progress < c.end || c.id === 'meal') return c
  }
  return CHAPTERS[CHAPTERS.length - 1]
}
