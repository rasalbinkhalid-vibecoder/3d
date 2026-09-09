import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RawChicken } from './RawChicken'
import { FriedChicken } from './FriedChicken'
import { LikeLogo3D } from './LikeLogo3D'
import { liveProgress } from '../store/progressStore'
import { LOGO_SWAP, CHICKEN_SWAP } from '../animation/chapters'

const smoothstep = THREE.MathUtils.smoothstep

interface ChickenProps {
  mobile: boolean
  reducedMotion: boolean
}

/**
 * The persistent hero: one shared transform (position/rotation/scale) driving
 * three meshes that are never all visible at once — the LIKE logo, the raw
 * drumstick, and the fried drumstick. Two short, particle-concealed opacity
 * crossfades (never a hard cut, never a visible "swap") move between them:
 *   logo -> raw   at LOGO_SWAP   (hidden by the intro's particle flash)
 *   raw  -> fried at CHICKEN_SWAP (hidden by peak flour coverage)
 */
export function Chicken({ mobile, reducedMotion }: ChickenProps) {
  const groupRef = useRef<THREE.Group>(null)

  const logoOpacity = useRef(1)
  const rawOpacity = useRef(0)
  const friedOpacity = useRef(0)
  const marinadeRef = useRef(0)
  const seasonRef = useRef(0)
  const fryRef = useRef(0)
  const crackleRef = useRef(0)

  useFrame((state) => {
    const p = liveProgress.value

    logoOpacity.current = 1 - smoothstep(p, LOGO_SWAP.start, LOGO_SWAP.end)
    const rawIn = smoothstep(p, LOGO_SWAP.start, LOGO_SWAP.end)
    const rawOut = smoothstep(p, CHICKEN_SWAP.start, CHICKEN_SWAP.end)
    rawOpacity.current = rawIn * (1 - rawOut)
    friedOpacity.current = rawOut

    seasonRef.current = smoothstep(p, 24, 30)
    marinadeRef.current = smoothstep(p, 27, 39)
    fryRef.current = smoothstep(p, 56, 71)
    const crackleWindow = smoothstep(p, 72, 74) * (1 - smoothstep(p, 79, 83))
    crackleRef.current = crackleWindow

    // shared transform: identical for every stage, so the swap is invisible.
    const t = state.clock.elapsedTime
    const bob = reducedMotion ? 0 : Math.sin(t * 0.9) * 0.045
    const goingDown = smoothstep(p, 56, 61)
    const comingUp = smoothstep(p, 72, 78)
    const diveScale = reducedMotion ? 0.4 : 0.85
    const diveAmount = -diveScale * goingDown * (1 - comingUp)
    const toBox = smoothstep(p, 88, 96)
    const rotationSpeed = reducedMotion ? 0.04 : 0.18

    if (groupRef.current) {
      groupRef.current.position.y = bob + diveAmount * (1 - toBox) - toBox * 0.55
      groupRef.current.position.x = toBox * 0.5
      groupRef.current.position.z = toBox * 0.3
      groupRef.current.rotation.y = t * rotationSpeed + toBox * 2.4
      groupRef.current.rotation.z = reducedMotion ? 0 : Math.sin(t * 0.5) * 0.03
      const scaleDown = 1 - toBox * 0.32
      groupRef.current.scale.setScalar(scaleDown)
    }
  })

  return (
    <group ref={groupRef}>
      <LikeLogo3D opacityRef={logoOpacity} />
      <RawChicken mobile={mobile} marinadeRef={marinadeRef} seasonRef={seasonRef} opacityRef={rawOpacity} />
      <FriedChicken mobile={mobile} fryRef={fryRef} crackleRef={crackleRef} opacityRef={friedOpacity} />
    </group>
  )
}
