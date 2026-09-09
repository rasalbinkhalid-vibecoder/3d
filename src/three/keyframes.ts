export interface CamKey {
  pos: [number, number, number]
  look: [number, number, number]
  fov: number
}

// stops align with CHAPTERS boundaries: 0, 12, 25, 40, 55, 72, 86, 100
export const CAMERA_KEYS: CamKey[] = [
  { pos: [0, 0.05, 6.4], look: [0, 0, 0], fov: 32 }, // 0   intro start: hero object at rest
  { pos: [0, 0, 4.6], look: [0, 0, 0], fov: 32 }, // 12  end of intro dolly-forward
  { pos: [0.5, 0.15, 4.0], look: [0, 0.1, 0], fov: 30 }, // 25  fresh: gentle orbital move
  { pos: [-0.3, 0.1, 3.6], look: [0, 0.1, 0], fov: 34 }, // 40  marinade: closer macro framing (whole leg stays in frame)
  { pos: [0.15, -0.2, 3.0], look: [0, -0.15, 0], fov: 42 }, // 55  coating: camera slightly below, wide macro push
  { pos: [0.1, -0.4, 3.1], look: [0, -0.4, 0], fov: 42 }, // 72  frying: camera follows the chicken down
  { pos: [0.4, 0.2, 2.9], look: [0, 0.05, 0], fov: 42 }, // 86  reveal: close but still whole, dramatic orbit
  { pos: [0, 0.1, 8.2], look: [0, -0.6, 0], fov: 34 }, // 100 meal: camera pulls back to fit chicken + box + fries
]

export const CAMERA_STOPS = [0, 12, 25, 40, 55, 72, 86, 100]

export const BG_KEYS: string[] = [
  '#fff5e8', // intro
  '#fff5e8', // fresh
  '#e41436', // marinade
  '#fff8f0', // coating (high-key)
  '#1c1008', // frying
  '#140907', // reveal
  '#fff5e8', // meal
  '#fff5e8', // handoff
]

function smoothstep(t: number) {
  const c = Math.min(Math.max(t, 0), 1)
  return c * c * (3 - 2 * c)
}

function locate(progress: number) {
  const clamped = Math.min(Math.max(progress, 0), 100)
  let i0 = CAMERA_STOPS.length - 2
  for (let i = 0; i < CAMERA_STOPS.length - 1; i++) {
    if (clamped >= CAMERA_STOPS[i] && clamped <= CAMERA_STOPS[i + 1]) {
      i0 = i
      break
    }
  }
  const span = CAMERA_STOPS[i0 + 1] - CAMERA_STOPS[i0] || 1
  const t = smoothstep((clamped - CAMERA_STOPS[i0]) / span)
  return { i0, t }
}

export function sampleKeys(keys: CamKey[], progress: number) {
  const { i0, t } = locate(progress)
  const a = keys[i0]
  const b = keys[i0 + 1]

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

export function sampleColor(colors: string[], progress: number) {
  const { i0, t } = locate(progress)
  return { i0, t }
}
