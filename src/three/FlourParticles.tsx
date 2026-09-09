import { ParticleField } from './particles/ParticleField'

interface FlourParticlesProps {
  activeRef: React.MutableRefObject<number>
  mobile: boolean
}

/** Fine flour dust + coarser breading chunks/flakes — the cloud that conceals the model swap. */
export function FlourParticles({ activeRef, mobile }: FlourParticlesProps) {
  const n = mobile ? 60 : 140
  return (
    <>
      <ParticleField behavior="burst" colorA="#f6ecd9" colorB="#ffffff" count={n} size={9} spread={1.7} activeRef={activeRef} />
      <ParticleField
        behavior="burst"
        colorA="#e2c491"
        colorB="#c99a4f"
        count={Math.round(n * 0.45)}
        size={5}
        spread={1.4}
        activeRef={activeRef}
      />
    </>
  )
}
