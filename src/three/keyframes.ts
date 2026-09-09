export interface CamKey {
  pos: [number, number, number]
  look: [number, number, number]
  fov: number
}

// index 0..6 correspond to act starts: hero, chicken, marinade, coating, fryer, reveal, drop
// index 7 is the "drop" chapter end / handoff to the menu section
export const CAMERA_KEYS: CamKey[] = [
  { pos: [0, 0.05, 6.4], look: [0, 0, 0], fov: 32 }, // 0 hero start
  { pos: [0, 0, 4.5], look: [0, 0, 0], fov: 32 }, // 1 chicken
  { pos: [0.65, 0.2, 3.65], look: [0, 0.05, 0], fov: 30 }, // 2 marinade
  { pos: [-0.3, 0.15, 2.5], look: [0, 0.05, 0], fov: 28 }, // 3 coating (macro)
  { pos: [0.1, -0.35, 2.9], look: [0, -0.55, 0], fov: 34 }, // 4 fryer dive
  { pos: [0.35, 0.35, 3.3], look: [0, 0, 0], fov: 30 }, // 5 reveal
  { pos: [0, 0.35, 5.6], look: [0, -0.25, 0], fov: 32 }, // 6 drop / assembly
  { pos: [0, 0.55, 7.4], look: [0, -0.2, 0], fov: 34 }, // 7 handoff
]

export const BG_KEYS: string[] = [
  '#fbf3e6', // hero
  '#fbf3e6', // chicken
  '#c23a1d', // marinade
  '#f4e6cf', // coating
  '#1b1310', // fryer
  '#241a15', // reveal
  '#fbf3e6', // drop
  '#fbf3e6', // handoff
]

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1)
  return c * c * (3 - 2 * c)
}

export function sampleKeys<T extends { pos: number[]; look: number[]; fov: number }>(
  keys: T[],
  playhead: number,
) {
  const clamped = Math.min(Math.max(playhead, 0), keys.length - 1)
  const i0 = Math.min(Math.floor(clamped), keys.length - 2)
  const i1 = i0 + 1
  const t = smoothstep(clamped - i0)

  const a = keys[i0]
  const b = keys[i1]

  const lerp3 = (u: number[], v: number[]): [number, number, number] => [
    u[0] + (v[0] - u[0]) * t,
    u[1] + (v[1] - u[1]) * t,
    u[2] + (v[2] - u[2]) * t,
  ]

  return {
    pos: lerp3(a.pos, b.pos),
    look: lerp3(a.look, b.look),
    fov: a.fov + (b.fov - a.fov) * t,
  }
}

export function sampleColor(colors: string[], playhead: number) {
  const clamped = Math.min(Math.max(playhead, 0), colors.length - 1)
  const i0 = Math.min(Math.floor(clamped), colors.length - 2)
  const t = smoothstep(clamped - i0)
  return { i0, t }
}
