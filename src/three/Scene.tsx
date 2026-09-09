import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ChickenModel } from './ChickenModel'
import { ParticleField } from './particles/ParticleField'
import { CAMERA_KEYS, BG_KEYS, sampleKeys, sampleColor } from './keyframes'
import { liveStory } from '../store/storyStore'

const tmpColorA = new THREE.Color()
const tmpColorB = new THREE.Color()
const tmpLook = new THREE.Vector3()

function CameraRig() {
  const { camera } = useThree()

  useFrame(() => {
    const k = sampleKeys(CAMERA_KEYS, liveStory.playhead)
    camera.position.set(k.pos[0], k.pos[1], k.pos[2])
    tmpLook.set(k.look[0], k.look[1], k.look[2])
    camera.lookAt(tmpLook)
    if ('fov' in camera) {
      const persp = camera as THREE.PerspectiveCamera
      if (Math.abs(persp.fov - k.fov) > 0.01) {
        persp.fov = k.fov
        persp.updateProjectionMatrix()
      }
    }
  })

  return null
}

function BackgroundRig() {
  const { scene, gl } = useThree()
  useFrame(() => {
    const { i0, t } = sampleColor(BG_KEYS, liveStory.playhead)
    tmpColorA.set(BG_KEYS[i0])
    tmpColorB.set(BG_KEYS[Math.min(i0 + 1, BG_KEYS.length - 1)])
    tmpColorA.lerp(tmpColorB, t)
    if (!scene.background || !(scene.background instanceof THREE.Color)) {
      scene.background = tmpColorA.clone()
    } else {
      ;(scene.background as THREE.Color).copy(tmpColorA)
    }
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(tmpColorA)
    }
    gl.setClearColor(tmpColorA)
  })
  return null
}

function ShadowBlob() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!ref.current) return
    const p = liveStory.playhead
    const fryer = Math.max(0, 1 - Math.abs(p - 4.3))
    ref.current.position.y = -0.72 - fryer * 0.15
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.clamp(0.35 - fryer * 0.15, 0.08, 0.35)
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
      <circleGeometry args={[0.85, 40]} />
      <meshBasicMaterial color="#1b1310" transparent opacity={0.3} />
    </mesh>
  )
}

function OilSurface() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const p = liveStory.playhead
    const inFryer = THREE.MathUtils.smoothstep(p, 3.6, 4.1) * (1 - THREE.MathUtils.smoothstep(p, 5.2, 5.7))
    if (meshRef.current) {
      meshRef.current.position.y = -0.95
      meshRef.current.visible = inFryer > 0.01
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.01)
    }
    if (matRef.current) {
      matRef.current.opacity = inFryer * 0.92
      matRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.15
    }
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.95, 0]}>
      <circleGeometry args={[2.4, 48]} />
      <meshStandardMaterial
        ref={matRef}
        color="#7a3c06"
        emissive="#c9660f"
        emissiveIntensity={0.5}
        roughness={0.25}
        metalness={0.1}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

function MealBox() {
  const ref = useRef<THREE.Group>(null)
  useFrame(() => {
    if (!ref.current) return
    const p = liveStory.playhead
    const t = THREE.MathUtils.smoothstep(p, 6.0, 6.7)
    ref.current.visible = t > 0.001
    ref.current.position.y = -0.9 + (1 - t) * -0.4
    ref.current.scale.setScalar(0.7 + t * 0.3)
  })
  return (
    <group ref={ref} position={[0, -0.9, 0]}>
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
    </group>
  )
}

function AssemblyChickenPiece({ offset }: { offset: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null)
  const progressRef = useRef(5.4)
  const crackleRef = useRef(0)
  useFrame(() => {
    if (!ref.current) return
    const p = liveStory.playhead
    const t = THREE.MathUtils.smoothstep(p, 6.0, 6.8)
    ref.current.visible = t > 0.001
    ref.current.position.set(offset[0] * t, -0.35 + (1 - t) * 1.5 + offset[1] * 0, offset[2] * t)
    ref.current.rotation.set(0.3, t * 2, 0.15)
    ref.current.scale.setScalar(0.55)
  })
  return (
    <group ref={ref}>
      <ChickenModel progressRef={progressRef} crackleRef={crackleRef} mobile />
    </group>
  )
}

interface SceneProps {
  isMobile: boolean
}

export function Scene({ isMobile }: SceneProps) {
  const chickenProgress = useRef(0)
  const chickenCrackle = useRef(0)
  const chickenY = useRef(0)

  const flourActive = useRef(0)
  const marinadeActive = useRef(0)
  const bubbleActive = useRef(0)
  const steamActive = useRef(0)
  const crumbActive = useRef(0)

  const heroScale = useRef(0.2)
  const chickenGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const p = liveStory.playhead
    chickenProgress.current = p

    // hero: scale up from a small glowing icon into the full hero object
    heroScale.current = THREE.MathUtils.lerp(0.22, 1, THREE.MathUtils.smoothstep(p, 0, 1))

    // dive into the fryer then rise back out
    const diveIn = THREE.MathUtils.smoothstep(p, 3.7, 4.3)
    const riseOut = THREE.MathUtils.smoothstep(p, 4.7, 5.4)
    chickenY.current = -diveIn * 0.75 + riseOut * 0.75

    // hide the hero piece once it flies into the assembled box
    const toBox = THREE.MathUtils.smoothstep(p, 6.0, 6.6)

    if (chickenGroupRef.current) {
      chickenGroupRef.current.scale.setScalar(heroScale.current)
      chickenGroupRef.current.position.y = chickenY.current - toBox * 1.3
      chickenGroupRef.current.position.x = toBox * -0.55
      chickenGroupRef.current.position.z = toBox * 0.2
      chickenGroupRef.current.rotation.y = liveStory.playhead * 0.35 + toBox * 3
      chickenGroupRef.current.visible = THREE.MathUtils.smoothstep(p, 6.9, 6.98) < 0.98
    }

    crumbActive.current = THREE.MathUtils.smoothstep(p, 0.15, 0.6) * (1 - THREE.MathUtils.smoothstep(p, 0.95, 1.3))
    marinadeActive.current = THREE.MathUtils.smoothstep(p, 1.9, 2.3) * (1 - THREE.MathUtils.smoothstep(p, 2.75, 3.1))
    flourActive.current = THREE.MathUtils.smoothstep(p, 2.85, 3.3) * (1 - THREE.MathUtils.smoothstep(p, 3.75, 4.1))
    bubbleActive.current = THREE.MathUtils.smoothstep(p, 3.75, 4.15) * (1 - THREE.MathUtils.smoothstep(p, 5.15, 5.6))
    steamActive.current = THREE.MathUtils.smoothstep(p, 4.6, 5.0) * (1 - THREE.MathUtils.smoothstep(p, 5.9, 6.3))

    const crackleWindow = THREE.MathUtils.smoothstep(p, 5.0, 5.25) * (1 - THREE.MathUtils.smoothstep(p, 5.65, 5.9))
    chickenCrackle.current = crackleWindow
  })

  const particleCount = isMobile ? 40 : 120

  return (
    <>
      <CameraRig />
      <BackgroundRig />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#fff3df', '#3a2418', 0.5]} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} color="#fff1d8" />
      <directionalLight position={[-4, 1.5, -3]} intensity={0.5} color="#7fa7ff" />

      <group ref={chickenGroupRef}>
        <ChickenModel progressRef={chickenProgress} crackleRef={chickenCrackle} mobile={isMobile} />
      </group>

      <ShadowBlob />
      <OilSurface />
      <MealBox />
      {!isMobile && (
        <>
          <AssemblyChickenPiece offset={[0.85, 0, -0.1]} />
        </>
      )}

      <ParticleField
        behavior="drift"
        colorA="#f0b23c"
        colorB="#e1361c"
        count={Math.round(particleCount * 0.6)}
        size={5}
        spread={1.1}
        activeRef={crumbActive}
      />
      <ParticleField
        behavior="fall"
        colorA="#8a2f16"
        colorB="#c25a3a"
        count={particleCount}
        size={6}
        spread={1.3}
        origin={[0, 0.9, 0]}
        activeRef={marinadeActive}
      />
      <ParticleField
        behavior="burst"
        colorA="#efe3c8"
        colorB="#e9d3ab"
        count={particleCount}
        size={7}
        spread={1.6}
        origin={[0, 0.1, 0]}
        activeRef={flourActive}
      />
      <ParticleField
        behavior="rise"
        colorA="#ffd980"
        colorB="#f0b23c"
        count={particleCount}
        size={8}
        spread={0.9}
        origin={[0, -0.9, 0]}
        activeRef={bubbleActive}
      />
      <ParticleField
        behavior="steam"
        colorA="#fff8ec"
        colorB="#f4e6cf"
        count={Math.round(particleCount * 0.5)}
        size={26}
        spread={0.6}
        origin={[0, 0, 0]}
        activeRef={steamActive}
      />
    </>
  )
}
