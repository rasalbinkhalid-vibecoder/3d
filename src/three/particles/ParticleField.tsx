import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export type ParticleBehavior = 'burst' | 'fall' | 'rise' | 'steam' | 'drift'

const MODE_MAP: Record<ParticleBehavior, number> = {
  burst: 0,
  fall: 1,
  rise: 2,
  steam: 3,
  drift: 4,
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uActive;
  uniform float uSize;
  uniform float uSpread;
  uniform int uMode;
  uniform vec3 uOrigin;

  attribute vec3 aSeed;
  attribute float aPhase;

  varying float vAlpha;
  varying float vSeed;

  void main() {
    vSeed = aPhase;
    float life = fract(uTime * 0.15 + aPhase);
    vec3 dir = normalize(aSeed - 0.5);
    vec3 p = uOrigin;
    float alpha = uActive;

    if (uMode == 0) {
      // burst: explode outward then settle, gated by uActive (0..1 acts as time-in-chapter)
      float t = clamp(uActive * 1.4 - aPhase * 0.4, 0.0, 1.0);
      float ease = 1.0 - pow(1.0 - t, 3.0);
      p += dir * uSpread * ease;
      p.y -= t * t * 0.6;
      alpha = uActive * (1.0 - smoothstep(0.75, 1.0, t)) * step(0.001, t);
    } else if (uMode == 1) {
      // fall: marinade droplets raining down and fading near origin
      float t = fract(life);
      p += vec3(dir.x, 0.0, dir.z) * uSpread * 0.35;
      p.y += 1.1 - t * 2.0;
      alpha = uActive * (1.0 - abs(t - 0.5) * 1.6);
    } else if (uMode == 2) {
      // rise: oil bubbles drifting upward with wobble
      float t = fract(life);
      p += vec3(dir.x, 0.0, dir.z) * uSpread * (0.3 + t * 0.4);
      p.x += sin(uTime * 3.0 + aPhase * 20.0) * 0.05;
      p.y += t * 1.4 - 0.4;
      alpha = uActive * sin(t * 3.14159);
    } else if (uMode == 3) {
      // steam: soft upward drifting wisps, wider and slower
      float t = fract(life * 0.6);
      p += vec3(dir.x, 0.0, dir.z) * uSpread * (0.4 + t * 1.1);
      p.y += t * 2.2;
      alpha = uActive * (1.0 - t) * 0.6;
    } else {
      // drift: gentle crumbs / seasoning orbiting the subject
      float ang = uTime * 0.2 + aPhase * 6.28318;
      p += vec3(cos(ang) * uSpread, sin(uTime * 0.6 + aPhase * 10.0) * 0.15, sin(ang) * uSpread) * (0.6 + 0.4 * aSeed.x);
      alpha = uActive;
    }

    vAlpha = clamp(alpha, 0.0, 1.0);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float mask = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, vSeed);
    gl_FragColor = vec4(color, mask * vAlpha);
    if (gl_FragColor.a < 0.01) discard;
  }
`

interface ParticleFieldProps {
  count?: number
  behavior: ParticleBehavior
  colorA: string
  colorB?: string
  size?: number
  spread?: number
  origin?: [number, number, number]
  activeRef: React.MutableRefObject<number>
}

export function ParticleField({
  count = 200,
  behavior,
  colorA,
  colorB,
  size = 10,
  spread = 1,
  origin = [0, 0, 0],
  activeRef,
}: ParticleFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const seeds = new Float32Array(count * 3)
    const phases = new Float32Array(count)
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      seeds[i * 3] = Math.random()
      seeds[i * 3 + 1] = Math.random()
      seeds[i * 3 + 2] = Math.random()
      phases[i] = Math.random()
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const uniforms = {
      uTime: { value: 0 },
      uActive: { value: 0 },
      uSize: { value: size },
      uSpread: { value: spread },
      uMode: { value: MODE_MAP[behavior] },
      uOrigin: { value: new THREE.Vector3(...origin) },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB ?? colorA) },
    }

    return { geometry: geo, uniforms }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, behavior])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uActive.value = activeRef.current
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
