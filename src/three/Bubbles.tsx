import { ParticleField } from './particles/ParticleField'

interface BubblesProps {
  activeRef: React.MutableRefObject<number>
  mobile: boolean
  originY: number
}

export function Bubbles({ activeRef, mobile, originY }: BubblesProps) {
  return (
    <ParticleField
      behavior="rise"
      colorA="#ffd980"
      colorB="#f0b23c"
      count={mobile ? 40 : 90}
      size={7}
      spread={0.85}
      origin={[0, originY, 0]}
      activeRef={activeRef}
    />
  )
}
