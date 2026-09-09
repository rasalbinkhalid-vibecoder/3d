import { ParticleField } from './particles/ParticleField'

interface SeasoningParticlesProps {
  activeRef: React.MutableRefObject<number>
  mobile: boolean
}

/** Paprika, cracked pepper, garlic flecks and herbs spiraling toward the drumstick. */
export function SeasoningParticles({ activeRef, mobile }: SeasoningParticlesProps) {
  const n = mobile ? 26 : 60
  return (
    <>
      <ParticleField behavior="drift" colorA="#e1361c" colorB="#f3893a" count={n} size={6} spread={1.05} activeRef={activeRef} />
      <ParticleField behavior="drift" colorA="#2b2016" colorB="#4a3a26" count={Math.round(n * 0.6)} size={4} spread={0.95} activeRef={activeRef} />
      <ParticleField behavior="drift" colorA="#7a8a4a" colorB="#93a35e" count={Math.round(n * 0.5)} size={5} spread={1.15} activeRef={activeRef} />
      <ParticleField behavior="drift" colorA="#f6ecd9" colorB="#ffffff" count={Math.round(n * 0.4)} size={3.5} spread={1.0} activeRef={activeRef} />
    </>
  )
}
