import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { createDrumstickGeometry } from './geometry/drumstick'
import { createRawMaterial } from './glsl/rawMaterial'
import { useOptionalGLTF } from './hooks/useOptionalGLTF'

export interface RawChickenHandles {
  setOpacity: (v: number) => void
}

interface RawChickenProps {
  mobile: boolean
  marinadeRef: React.MutableRefObject<number>
  seasonRef: React.MutableRefObject<number>
  opacityRef: React.MutableRefObject<number>
}

/** /public/models/raw-chicken.glb — see /public/models/README.md */
const MODEL_URL = '/models/raw-chicken.glb'

export function RawChicken({ mobile, marinadeRef, seasonRef, opacityRef }: RawChickenProps) {
  const { scene, failed } = useOptionalGLTF(MODEL_URL)
  const geometry = useMemo(() => createDrumstickGeometry({ segments: mobile ? 26 : 40 }), [mobile])
  const { material, uniforms } = useMemo(() => createRawMaterial(), [])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uMarinade.value = marinadeRef.current
    uniforms.uSeasonSpecks.value = seasonRef.current
    uniforms.uOpacity.value = opacityRef.current
    material.visible = opacityRef.current > 0.001
  })

  if (scene && !failed) {
    // a real asset was dropped into /public/models — render it directly.
    // (hook up the same progress uniforms via scene.traverse + material userData
    // once real GLBs with a matching shader are supplied.)
    return <primitive object={scene} />
  }

  return <mesh geometry={geometry} material={material} />
}
