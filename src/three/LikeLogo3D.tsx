import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface LikeLogo3DProps {
  opacityRef: React.MutableRefObject<number>
}

/**
 * The LIKE chicken-symbol mark, built as a real dimensional object: an
 * inflated orange body with a red three-lobed comb and a small red beak —
 * glossy and soft-touch via MeshPhysicalMaterial's clearcoat.
 */
export function LikeLogo3D({ opacityRef }: LikeLogo3DProps) {
  const groupRef = useRef<THREE.Group>(null)

  const bodyGeo = useMemo(() => new THREE.SphereGeometry(0.42, 48, 48), [])
  const combGeo = useMemo(() => new THREE.SphereGeometry(0.16, 24, 24), [])
  const beakGeo = useMemo(() => new THREE.ConeGeometry(0.09, 0.22, 20), [])

  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f3893a',
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        transparent: true,
      }),
    [],
  )
  const combMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#e1361c',
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        transparent: true,
      }),
    [],
  )

  useFrame((state) => {
    const o = opacityRef.current
    if (groupRef.current) {
      groupRef.current.visible = o > 0.001
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25
      const s = THREE.MathUtils.lerp(0.9, 1, 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 1.4))
      groupRef.current.scale.setScalar(s)
    }
    bodyMat.opacity = o
    combMat.opacity = o
  })

  return (
    <group ref={groupRef} scale={1.35}>
      <mesh geometry={bodyGeo} material={bodyMat} scale={[1, 1.12, 0.92]} />
      <mesh geometry={combGeo} material={combMat} position={[-0.19, 0.34, 0]} />
      <mesh geometry={combGeo} material={combMat} position={[0, 0.42, 0]} />
      <mesh geometry={combGeo} material={combMat} position={[0.19, 0.34, 0]} />
      <mesh geometry={beakGeo} material={combMat} position={[0.42, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]} />
    </group>
  )
}
