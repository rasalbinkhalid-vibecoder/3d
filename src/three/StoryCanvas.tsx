import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Experience } from './Experience'

interface StoryCanvasProps {
  isMobile: boolean
  reducedMotion: boolean
}

export function StoryCanvas({ isMobile, reducedMotion }: StoryCanvasProps) {
  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1.5, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      camera={{ position: [0, 0, 6.4], fov: 32, near: 0.1, far: 30 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <Experience isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  )
}
