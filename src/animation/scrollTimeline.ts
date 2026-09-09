import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useProgressStore } from '../store/progressStore'

gsap.registerPlugin(ScrollTrigger)

/**
 * The single scroll-linked source of truth: as the wrapper containing all
 * seven chapters scrolls from top to bottom, progress goes 0 -> 100 and
 * every 3D system (camera, chicken, lighting, particles) reads it.
 */
export function createMasterProgressTrigger(wrapper: HTMLElement) {
  return ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      useProgressStore.getState().setProgress(self.progress * 100)
    },
  })
}

/** Gentle fade-and-rise as a chapter's real HTML content scrolls into view. */
export function revealOnEnter(el: HTMLElement, reducedMotion: boolean) {
  return gsap.fromTo(
    el,
    reducedMotion ? { autoAlpha: 0 } : { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        end: 'top 40%',
        scrub: 0.5,
      },
    },
  )
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
}
