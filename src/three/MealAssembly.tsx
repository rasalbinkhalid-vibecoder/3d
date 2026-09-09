import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createDrumstickGeometry } from './geometry/drumstick'
import { createFriedInstanceMaterial } from './FriedChicken'
import { liveProgress } from '../store/progressStore'

const smoothstep = THREE.MathUtils.smoothstep

interface MealAssemblyProps {
  mobile: boolean
}

function ExtraChickenPiece({ offset }: { offset: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  const geometry = useMemo(() => createDrumstickGeometry({ segments: 22 }), [])
  const material = useMemo(() => createFriedInstanceMaterial(), [])

  useFrame(() => {
    const p = liveProgress.value
    const t = smoothstep(p, 88, 96)
    if (!ref.current) return
    ref.current.visible = t > 0.001
    ref.current.position.set(offset[0] * t, -0.35 + (1 - t) * 1.4, offset[2] * t)
    ref.current.rotation.set(0.4, t * 2.4, 0.2)
    ref.current.scale.setScalar(0.5)
  })

  return (
    <group ref={ref}>
      <mesh geometry={geometry} material={material} />
    </group>
  )
}

export function MealAssembly({ mobile }: MealAssemblyProps) {
  const boxRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = liveProgress.value
    const t = smoothstep(p, 87, 95)
    if (!boxRef.current) return
    boxRef.current.visible = t > 0.001
    boxRef.current.position.y = -0.95 + (1 - t) * -0.5
    boxRef.current.scale.setScalar(0.65 + t * 0.35)
  })

  return (
    <>
      <group ref={boxRef} position={[0, -0.95, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[1.7, 0.55, 1.15]} />
          <meshStandardMaterial color="#e1361c" roughness={0.55} />
        </mesh>
        <mesh position={[-0.55, 0.3, 0.15]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.55, 8]} />
          <meshStandardMaterial color="#f0b23c" roughness={0.6} />
        </mesh>
        <mesh position={[-0.4, 0.32, -0.1]} rotation={[0, -0.2, 0.1]}>
          <cylinderGeometry args={[0.08, 0.1, 0.6, 8]} />
          <meshStandardMaterial color="#f0b23c" roughness={0.6} />
        </mesh>
        <mesh position={[0.5, 0.18, 0.2]}>
          <cylinderGeometry args={[0.18, 0.14, 0.22, 16]} />
          <meshStandardMaterial color="#fbf3e6" roughness={0.4} />
        </mesh>
        <mesh position={[0.5, 0.02, -0.25]}>
          <cylinderGeometry args={[0.12, 0.1, 0.14, 16]} />
          <meshStandardMaterial color="#e1361c" roughness={0.4} />
        </mesh>
      </group>
      {!mobile && <ExtraChickenPiece offset={[0.85, 0, -0.1]} />}
    </>
  )
}
