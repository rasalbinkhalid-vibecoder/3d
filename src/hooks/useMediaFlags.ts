import { useEffect } from 'react'
import { useProgressStore } from '../store/progressStore'

export function useMediaFlags() {
  const setReducedMotion = useProgressStore((s) => s.setReducedMotion)
  const setIsMobile = useProgressStore((s) => s.setIsMobile)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 767px)')

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
