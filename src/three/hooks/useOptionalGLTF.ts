import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

/**
 * Tries to load a real GLB from /public/models. If the file isn't there yet
 * (which is the case until real assets are supplied — see README in
 * /public/models), this fails quietly and the caller falls back to the
 * procedural drumstick. Drop a real raw-chicken.glb / fried-chicken.glb in
 * and it is picked up automatically, no code changes required.
 */
export function useOptionalGLTF(url: string) {
  const [scene, setScene] = useState<THREE.Group | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.load(
      url,
      (gltf) => {
        if (!cancelled) setScene(gltf.scene)
      },
      undefined,
      () => {
        if (!cancelled) setFailed(true)
      },
    )
    return () => {
      cancelled = true
    }
  }, [url])

  return { scene, failed }
}
