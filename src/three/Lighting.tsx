import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { liveProgress } from '../store/progressStore'

const smoothstep = THREE.MathUtils.smoothstep
const tmpA = new THREE.Color()
const tmpB = new THREE.Color()

interface Stop {
  at: number
  key: string
  fill: string
  rim: string
  keyIntensity: number
  ambient: number
}

// one lighting "mood" per chapter boundary; interpolated smoothly between them
const STOPS: Stop[] = [
  { at: 0, key: '#fff1d8', fill: '#ffe6cf', rim: '#ff8a4c', keyIntensity: 1.6, ambient: 0.6 }, // intro
  { at: 12, key: '#ffffff', fill: '#fbe8d0', rim: '#ffb27a', keyIntensity: 2.1, ambient: 0.55 }, // fresh: soft bright studio
  { at: 25, key: '#ffd8c0', fill: '#e1361c', rim: '#ff5a3c', keyIntensity: 1.8, ambient: 0.42 }, // marinade: red/orange rim
  { at: 40, key: '#ffffff', fill: '#fff6e9', rim: '#ffffff', keyIntensity: 2.4, ambient: 0.7 }, // coating: high-key
  { at: 55, key: '#ffb04d', fill: '#7a3c06', rim: '#ffcf7a', keyIntensity: 2.0, ambient: 0.32 }, // frying: deep gold
  { at: 72, key: '#ffb870', fill: '#140907', rim: '#ff9a3c', keyIntensity: 2.3, ambient: 0.2 }, // reveal: dark + hero spot
  { at: 86, key: '#fff3df', fill: '#f4e6cf', rim: '#f0b23c', keyIntensity: 1.9, ambient: 0.55 }, // meal: clean commercial
  { at: 100, key: '#fff3df', fill: '#f4e6cf', rim: '#f0b23c', keyIntensity: 1.9, ambient: 0.55 },
]

function sample(p: number) {
  const clamped = THREE.MathUtils.clamp(p, STOPS[0].at, STOPS[STOPS.length - 1].at)
  let i0 = STOPS.length - 2
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (clamped >= STOPS[i].at && clamped <= STOPS[i + 1].at) {
      i0 = i
      break
    }
  }
  const a = STOPS[i0]
  const b = STOPS[i0 + 1]
  const t = smoothstep(clamped, a.at, b.at)
  return { a, b, t }
}

export function Lighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null)
  const fillRef = useRef<THREE.PointLight>(null)
  const ambientRef = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const p = liveProgress.value
    const { a, b, t } = sample(p)

    tmpA.set(a.key)
    tmpB.set(b.key)
    tmpA.lerp(tmpB, t)
    if (keyRef.current) {
      keyRef.current.color.copy(tmpA)
      keyRef.current.intensity = THREE.MathUtils.lerp(a.keyIntensity, b.keyIntensity, t)
    }

    tmpA.set(a.rim)
    tmpB.set(b.rim)
    tmpA.lerp(tmpB, t)
    if (fillRef.current) {
      fillRef.current.color.copy(tmpA)
    }

    tmpA.set(a.fill)
    tmpB.set(b.fill)
    tmpA.lerp(tmpB, t)
    if (ambientRef.current) {
      ambientRef.current.color.copy(tmpA)
      ambientRef.current.intensity = THREE.MathUtils.lerp(a.ambient, b.ambient, t)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.55} />
      <directionalLight ref={keyRef} position={[3, 5, 4]} intensity={1.8} />
      <pointLight ref={fillRef} position={[-3, 0.5, -2]} intensity={1.1} distance={8} />
    </>
  )
}
