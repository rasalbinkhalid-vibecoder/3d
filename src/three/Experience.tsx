import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Chicken } from './Chicken'
import { Lighting } from './Lighting'
import { SeasoningParticles } from './SeasoningParticles'
import { MarinadeDrips } from './MarinadeDrips'
import { FlourParticles } from './FlourParticles'
import { Oil } from './Oil'
import { Bubbles } from './Bubbles'
import { Steam } from './Steam'
import { MealAssembly } from './MealAssembly'
import { ParticleField } from './particles/ParticleField'
import { CAMERA_KEYS, BG_KEYS, sampleKeys, sampleColor } from './keyframes'
import { liveProgress } from '../store/progressStore'

const smoothstep = THREE.MathUtils.smoothstep
const tmpColorA = new THREE.Color()
const tmpColorB = new THREE.Color()
const tmpLook = new THREE.Vector3()

const OIL_SURFACE_Y = -0.95

function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree()
  const neutral = CAMERA_KEYS[0]
  useFrame(() => {
    const k = sampleKeys(CAMERA_KEYS, liveProgress.value)
    // reduced motion: hold close to the resting pose instead of the full cinematic travel
    const damp = reducedMotion ? 0.22 : 1
    const pos: [number, number, number] = reducedMotion
      ? [
          THREE.MathUtils.lerp(neutral.pos[0], k.pos[0], damp),
          THREE.MathUtils.lerp(neutral.pos[1], k.pos[1], damp),
          THREE.MathUtils.lerp(neutral.pos[2], k.pos[2], damp),
        ]
      : k.pos
    camera.position.set(pos[0], pos[1], pos[2])
    tmpLook.set(k.look[0], k.look[1] * damp, k.look[2])
    camera.lookAt(tmpLook)
    const persp = camera as THREE.PerspectiveCamera
    const fov = reducedMotion ? THREE.MathUtils.lerp(neutral.fov, k.fov, damp) : k.fov
    if (Math.abs(persp.fov - fov) > 0.01) {
      persp.fov = fov
      persp.updateProjectionMatrix()
    }
  })
  return null
}

function BackgroundRig() {
  const { scene, gl } = useThree()
  useFrame(() => {
    const { i0, t } = sampleColor(BG_KEYS, liveProgress.value)
    tmpColorA.set(BG_KEYS[i0])
    tmpColorB.set(BG_KEYS[Math.min(i0 + 1, BG_KEYS.length - 1)])
    tmpColorA.lerp(tmpColorB, t)
    if (!(scene.background instanceof THREE.Color)) scene.background = tmpColorA.clone()
    else scene.background.copy(tmpColorA)
    gl.setClearColor(tmpColorA)
  })
  return null
}

function ShadowBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!ref.current) return
    const p = liveProgress.value
    const dipped = smoothstep(p, 56, 61) * (1 - smoothstep(p, 72, 78))
    ref.current.position.y = -0.72 - dipped * 0.05
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.lerp(0.28, 0.05, dipped)
    ref.current.visible = smoothstep(p, 86, 90) < 0.5
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
      <circleGeometry args={[0.8, 40]} />
      <meshBasicMaterial color="#140907" transparent opacity={0.28} />
    </mesh>
  )
}

interface ExperienceProps {
  isMobile: boolean
  reducedMotion: boolean
}

export function Experience({ isMobile, reducedMotion }: ExperienceProps) {
  const seasoningActive = useRef(0)
  const marinadeActive = useRef(0)
  const flourActive = useRef(0)
  const bubblesActive = useRef(0)
  const steamFryActive = useRef(0)
  const steamRevealActive = useRef(0)
  const crumbActive = useRef(0)

  useFrame(() => {
    const p = liveProgress.value
    crumbActive.current = smoothstep(p, 2, 6) * (1 - smoothstep(p, 10, 13))
    seasoningActive.current = smoothstep(p, 20, 27) * (1 - smoothstep(p, 34, 39))
    marinadeActive.current = smoothstep(p, 30, 35) * (1 - smoothstep(p, 39, 43))
    flourActive.current = smoothstep(p, 41, 46) * (1 - smoothstep(p, 52, 56))
    bubblesActive.current = smoothstep(p, 57, 62) * (1 - smoothstep(p, 74, 79))
    steamFryActive.current = smoothstep(p, 58, 64) * (1 - smoothstep(p, 70, 74))
    steamRevealActive.current = smoothstep(p, 74, 78) * (1 - smoothstep(p, 84, 88))
  })

  return (
    <>
      <CameraRig reducedMotion={reducedMotion} />
      <BackgroundRig />
      <Lighting />

      <Chicken mobile={isMobile} reducedMotion={reducedMotion} />
      <ShadowBlob />
      <Oil mobile={isMobile} surfaceY={OIL_SURFACE_Y} />
      <MealAssembly mobile={isMobile} />

      <SeasoningParticles activeRef={seasoningActive} mobile={isMobile} />
      <MarinadeDrips activeRef={marinadeActive} mobile={isMobile} />
      <FlourParticles activeRef={flourActive} mobile={isMobile} />
      <Bubbles activeRef={bubblesActive} mobile={isMobile} originY={OIL_SURFACE_Y} />
      <Steam activeRef={steamFryActive} mobile={isMobile} origin={[0, OIL_SURFACE_Y + 0.1, 0]} />
      <Steam activeRef={steamRevealActive} mobile={isMobile} origin={[0, 0, 0]} intensity="subtle" />
      <ParticleField
        behavior="drift"
        colorA="#f0b23c"
        colorB="#e1361c"
        count={isMobile ? 16 : 34}
        size={4.5}
        spread={0.85}
        activeRef={crumbActive}
      />
    </>
  )
}
