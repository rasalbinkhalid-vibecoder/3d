import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createDrumstickGeometry } from './geometry/drumstick'
import { createFriedMaterial } from './glsl/friedMaterial'
import { useOptionalGLTF } from './hooks/useOptionalGLTF'

/** /public/models/fried-chicken.glb — see /public/models/README.md */
const MODEL_URL = '/models/fried-chicken.glb'

interface FriedChickenProps {
  mobile: boolean
  fryRef: React.MutableRefObject<number>
  crackleRef: React.MutableRefObject<number>
  opacityRef: React.MutableRefObject<number>
}

export function FriedChicken({ mobile, fryRef, crackleRef, opacityRef }: FriedChickenProps) {
  const { scene, failed } = useOptionalGLTF(MODEL_URL)
  // identical proportions/params to RawChicken by design: same silhouette, same scale.
  const geometry = useMemo(() => createDrumstickGeometry({ segments: mobile ? 26 : 40 }), [mobile])
  const { material, uniforms } = useMemo(() => createFriedMaterial(), [])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uFry.value = fryRef.current
    uniforms.uCrackle.value = crackleRef.current
    uniforms.uOpacity.value = opacityRef.current
    material.visible = opacityRef.current > 0.001
  })

  if (scene && !failed) {
    return <primitive object={scene} />
  }

  return <mesh geometry={geometry} material={material} />
}

export function createFriedInstanceMaterial() {
  // used by MealAssembly for the extra pieces flying into the box — same
  // shader, fixed at "fully fried" so it never needs its own progress wiring.
  const { material, uniforms } = createFriedMaterial()
  uniforms.uFry.value = 1
  uniforms.uOpacity.value = 1
  return material as THREE.ShaderMaterial
}
