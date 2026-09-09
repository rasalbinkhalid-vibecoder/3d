import { useEffect } from 'react'
import { useStoryStore } from '../store/storyStore'

export function useMediaFlags() {
  const setReducedMotion = useStoryStore((s) => s.setReducedMotion)
  const setIsMobile = useStoryStore((s) => s.setIsMobile)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 820px)')

    const applyMotion = () => setReducedMotion(motionQuery.matches)
    const applyMobile = () => setIsMobile(mobileQuery.matches)

    applyMotion()
    applyMobile()

    motionQuery.addEventListener('change', applyMotion)
    mobileQuery.addEventListener('change', applyMobile)
    return () => {
      motionQuery.removeEventListener('change', applyMotion)
      mobileQuery.removeEventListener('change', applyMobile)
    }
  }, [setReducedMotion, setIsMobile])
}
