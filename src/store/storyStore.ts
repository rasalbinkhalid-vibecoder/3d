import { create } from 'zustand'

interface StoryState {
  /** continuous "playhead" position across the pinned 3D story: 0 (hero) .. 7 (handoff) */
  playhead: number
  reducedMotion: boolean
  isMobile: boolean
  setPlayhead: (p: number) => void
  setReducedMotion: (v: boolean) => void
  setIsMobile: (v: boolean) => void
}

export const useStoryStore = create<StoryState>((set) => ({
  playhead: 0,
  reducedMotion: false,
  isMobile: false,
  setPlayhead: (p) => set({ playhead: p }),
  setReducedMotion: (v) => set({ reducedMotion: v }),
  setIsMobile: (v) => set({ isMobile: v }),
}))

/** Mutable, non-reactive mirror for the R3F render loop (avoids React re-renders at 60fps). */
export const liveStory = {
  playhead: 0,
}

useStoryStore.subscribe((s) => {
  liveStory.playhead = s.playhead
})
