import { create } from 'zustand'
import { CHAPTERS, chapterAt } from '../animation/chapters'

interface ProgressState {
  /** 0..100 across the whole pinned 3D story */
  progress: number
  activeChapterIndex: number
  reducedMotion: boolean
  isMobile: boolean
  setProgress: (p: number) => void
  setReducedMotion: (v: boolean) => void
  setIsMobile: (v: boolean) => void
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: 0,
  activeChapterIndex: 0,
  reducedMotion: false,
  isMobile: false,
  setProgress: (p) =>
    set((s) => {
      const chapter = chapterAt(p)
      const idx = CHAPTERS.findIndex((c) => c.id === chapter.id)
      return s.activeChapterIndex === idx ? { progress: p } : { progress: p, activeChapterIndex: idx }
    }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setIsMobile: (v) => set({ isMobile: v }),
}))

/** Mutable, non-reactive mirror for the R3F render loop (avoids React re-renders at 60fps). */
export const liveProgress = { value: 0 }

useProgressStore.subscribe((s) => {
  liveProgress.value = s.progress
})
