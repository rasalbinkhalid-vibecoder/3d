import { ParticleField } from './particles/ParticleField'

interface SteamProps {
  activeRef: React.MutableRefObject<number>
  mobile: boolean
  origin?: [number, number, number]
  /** 'subtle' keeps steam as a light wisp so it never obscures the chicken itself */
  intensity?: 'normal' | 'subtle'
}

export function Steam({ activeRef, mobile, origin = [0, 0, 0], intensity = 'normal' }: SteamProps) {
  const subtle = intensity === 'subtle'
  return (
    <ParticleField
      behavior="steam"
      colorA="#fff8ec"
      colorB="#f4e6cf"
      count={mobile ? (subtle ? 12 : 24) : subtle ? 22 : 55}
      size={subtle ? 12 : 28}
      spread={subtle ? 0.4 : 0.55}
      origin={origin}
      activeRef={activeRef}
    />
  )
}
