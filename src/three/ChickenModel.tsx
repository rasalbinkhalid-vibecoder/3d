import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createChickenMaterial } from './glsl/chickenMaterial'

function buildMeatGeometry(mobile: boolean) {
  const geo = new THREE.CapsuleGeometry(0.62, 0.55, mobile ? 6 : 10, mobile ? 20 : 32)
  const pos = geo.attributes.position as THREE.BufferAttribute

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)

    // taper the upper half into a drumstick "handle", keep the lower half plump
    const t = THREE.MathUtils.clamp((y + 0.2) / 1.1, 0, 1)
    const taper = THREE.MathUtils.lerp(1.05, 0.42, Math.pow(t, 1.4))
    // gentle forward curve like a real drumstick
    const curve = Math.pow(t, 2) * 0.22

    pos.setXYZ(i, x * taper, y, z * taper + curve)
  }

  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

function buildBoneGeometry() {
  const group = new THREE.CylinderGeometry(0.05, 0.065, 0.62, 12, 1)
  return group
}

interface ChickenModelProps {
  mobile?: boolean
  progressRef: React.MutableRefObject<number>
  crackleRef: React.MutableRefObject<number>
}

export function ChickenModel({ mobile = false, progressRef, crackleRef }: ChickenModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meatGeo = useMemo(() => buildMeatGeometry(mobile), [mobile])
  const boneGeo = useMemo(() => buildBoneGeometry(), [])
  const { material, uniforms } = useMemo(() => createChickenMaterial(), [])
  const boneMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f6ecd9', roughness: 0.55, metalness: 0.02 }),
    [],
  )

  useFrame((state) => {
    uniforms.uProgress.value = progressRef.current
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uCrackle.value = crackleRef.current
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={meatGeo} material={material} castShadow receiveShadow rotation={[0, 0, Math.PI]} />
      <mesh geometry={boneGeo} material={boneMat} position={[0, -0.62, 0.15]} rotation={[0.25, 0, 0]} />
    </group>
  )
}
