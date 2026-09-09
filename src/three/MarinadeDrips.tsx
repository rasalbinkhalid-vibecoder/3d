import { ParticleField } from './particles/ParticleField'

interface MarinadeDripsProps {
  activeRef: React.MutableRefObject<number>
  mobile: boolean
}

/** Glossy marinade droplets and trails raining down over the seasoned skin. */
export function MarinadeDrips({ activeRef, mobile }: MarinadeDripsProps) {
  return (
    <ParticleField
      behavior="fall"
      colorA="#7a2410"
      colorB="#c14a24"
      count={mobile ? 30 : 70}
      size={7}
      spread={1.1}
      origin={[0, 0.85, 0]}
      activeRef={activeRef}
    />
  )
}
