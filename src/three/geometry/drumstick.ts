import * as THREE from 'three'

/**
 * A chicken drumstick read instantly, at a glance, in silhouette:
 * thin bone tip -> a distinct wider knuckle bump -> a pinched "waist" ->
 * a big asymmetric meat bulb (fullest in the lower half) -> a broad ROUNDED
 * dome at the bottom (never a point — a pointed base reads as a teardrop,
 * not a leg). Built as a lathe plus a gentle lengthwise bend and very light
 * asymmetric noise so it doesn't read as a turned/lathed object.
 *
 * position.y is preserved by the bend/noise pass, so shaders can use raw
 * `position.y` to mask the bone vs. the meat without any extra attribute.
 */

const TOP: Array<[radius: number, y: number]> = [
  [0.0, 1.0], // bone tip
  [0.022, 0.93],
  [0.04, 0.82],
  [0.048, 0.72],
  [0.125, 0.64], // knuckle: distinctly wider than the bone shaft
  [0.07, 0.56], // neck: pinched waist, narrower than the knuckle
  [0.095, 0.48],
  [0.16, 0.36],
  [0.225, 0.22],
  [0.285, 0.06],
  [0.335, -0.1],
  [0.355, -0.26], // fullest point of the bulb, in the lower half
  [0.33, -0.42],
]

// a genuine quarter-circle arc for the base, so it rounds off into a broad
// dome instead of tapering to a point.
const BASE_RADIUS = 0.33
const BASE_START_Y = -0.42
function roundedBase(steps = 7): Array<[number, number]> {
  const pts: Array<[number, number]> = []
  for (let i = 0; i <= steps; i++) {
    const theta = (Math.PI / 2) * (i / steps)
    pts.push([BASE_RADIUS * Math.cos(theta), BASE_START_Y - BASE_RADIUS * Math.sin(theta)])
  }
  return pts.slice(1) // skip i=0, already the last TOP point
}

const PROFILE: Array<[radius: number, y: number]> = [...TOP, ...roundedBase()]

export interface DrumstickOptions {
  segments?: number
  bend?: number
  asymmetry?: number
}

export function createDrumstickGeometry({ segments = 40, bend = 0.07, asymmetry = 0.012 }: DrumstickOptions = {}) {
  const points = PROFILE.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y))
  const geometry = new THREE.LatheGeometry(points, segments, 0, Math.PI * 2)

  const pos = geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)

    const t = THREE.MathUtils.clamp((y + 0.75) / 1.75, 0, 1) // 0 base .. 1 bone tip
    const bendAmount = bend * Math.pow(t, 2.1)

    const angle = Math.atan2(z, x)
    const wobble = 1 + asymmetry * Math.sin(angle * 3 + y * 6) + asymmetry * 0.6 * Math.sin(angle * 5 - y * 3)

    pos.setXYZ(i, x * wobble, y, z * wobble + bendAmount)
  }

  pos.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}
