import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParticleField } from './particles/ParticleField'
import { liveProgress } from '../store/progressStore'

const smoothstep = THREE.MathUtils.smoothstep

interface OilProps {
  mobile: boolean
  surfaceY: number
}

/** The fryer: stainless rim, golden oil surface with gentle ripple, and the splash burst on contact. */
export function Oil({ mobile, surfaceY }: OilProps) {
  const basinRef = useRef<THREE.Mesh>(null)
  const surfaceRef = useRef<THREE.Mesh>(null)
  const surfaceMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const splashActive = useRef(0)
  const visibleRef = useRef(0)

  const surfaceGeo = useMemo(() => new THREE.CircleGeometry(1.4, mobile ? 32 : 56), [mobile])
  const rimGeo = useMemo(() => new THREE.TorusGeometry(1.42, 0.05, 12, mobile ? 32 : 48), [])

  useFrame((state) => {
    const p = liveProgress.value
    const visible = smoothstep(p, 54, 57) * (1 - smoothstep(p, 78, 82))
    visibleRef.current = visible
    splashActive.current = smoothstep(p, 58, 60.5) * (1 - smoothstep(p, 64, 68))

    if (basinRef.current) basinRef.current.visible = visible > 0.01
    if (surfaceRef.current) {
      surfaceRef.current.visible = visible > 0.01
      const t = state.clock.elapsedTime
      const pos = surfaceRef.current.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const r = Math.sqrt(x * x + y * y)
        const z = Math.sin(r * 8 - t * 2.4) * 0.012 * visible
        pos.setZ(i, z)
      }
      pos.needsUpdate = true
      surfaceRef.current.geometry.computeVertexNormals()
    }
    if (surfaceMatRef.current) {
      surfaceMatRef.current.emissiveIntensity = 0.55 + Math.sin(state.clock.elapsedTime * 3.2) * 0.15
      surfaceMatRef.current.opacity = visible
    }
  })

  return (
    <group position={[0, surfaceY, 0]}>
      <mesh ref={surfaceRef} geometry={surfaceGeo} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          ref={surfaceMatRef}
          color="#7a3c06"
          emissive="#c9660f"
          emissiveIntensity={0.55}
          roughness={0.22}
          metalness={0.15}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={basinRef} geometry={rimGeo} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#c9ccd1" roughness={0.28} metalness={0.9} />
      </mesh>
      <ParticleField behavior="burst" colorA="#ffd980" colorB="#f0b23c" count={mobile ? 30 : 70} size={7} spread={1.3} activeRef={splashActive} />
    </group>
  )
}
