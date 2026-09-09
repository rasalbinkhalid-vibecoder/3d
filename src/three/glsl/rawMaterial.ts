import * as THREE from 'three'
import { snoise3 } from './noise'

export interface RawUniforms {
  uTime: { value: number }
  uMarinade: { value: number } // 0 fresh raw .. 1 fully soaked/glossy
  uSeasonSpecks: { value: number } // 0..1 tiny dark fleck density (pepper/herbs stuck to skin)
  uLightDir: { value: THREE.Vector3 }
  uLightDir2: { value: THREE.Vector3 }
  uLightColor: { value: THREE.Color }
  uRimColor: { value: THREE.Color }
  uOpacity: { value: number }
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vY;
  varying vec3 vPos;

  ${snoise3}

  void main() {
    vec3 n = normalize(normal);
    float wobble = snoise(position * 2.2 + uTime * 0.04) * 0.006;
    vec3 displaced = position + n * wobble;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vNormal = normalize(normalMatrix * n);
    vViewDir = normalize(-mvPosition.xyz);
    vY = position.y;
    vPos = position;

    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uMarinade;
  uniform float uSeasonSpecks;
  uniform vec3 uLightDir;
  uniform vec3 uLightDir2;
  uniform vec3 uLightColor;
  uniform vec3 uRimColor;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vY;
  varying vec3 vPos;

  ${snoise3}

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    vec3 boneRaw = vec3(0.93, 0.87, 0.78);
    vec3 meatFresh = vec3(0.89, 0.62, 0.55);
    vec3 meatMarinated = vec3(0.66, 0.24, 0.14);

    float boneMask = smoothstep(0.5, 0.68, vY);

    float mottle = snoise(vPos * 5.0) * 0.5 + 0.5;
    vec3 meatColor = mix(meatFresh * mix(0.94, 1.04, mottle), meatFresh * 0.88, 0.0);
    meatColor = mix(meatColor, meatMarinated, uMarinade);

    vec3 color = mix(meatColor, boneRaw, boneMask);

    // pepper / herb specks once seasoning has landed, on the meat only
    float speckNoise = smoothstep(0.72, 0.98, snoise(vPos * 30.0));
    color = mix(color, color * 0.28, speckNoise * uSeasonSpecks * (1.0 - boneMask));

    float diff = max(dot(N, uLightDir), 0.0);
    float diff2 = max(dot(N, uLightDir2), 0.0) * 0.4;
    float ambient = 0.4;

    vec3 halfV = normalize(uLightDir + V);
    float glossy = mix(28.0, 70.0, uMarinade);
    float specStrength = mix(0.35, 0.85, uMarinade);
    float spec = pow(max(dot(N, halfV), 0.0), glossy) * specStrength;

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.2);
    vec3 rim = uRimColor * fresnel * (0.25 + uMarinade * 0.5);

    vec3 lit = color * (ambient + diff * 0.85 + diff2) * uLightColor + spec * vec3(1.0, 0.95, 0.85) + rim;

    lit *= 1.5; // exposure so mid-tones keep their brightness under the tonemap below
    lit = lit / (1.0 + lit); // soft-knee tonemap so hot highlights roll off instead of clipping to white
    gl_FragColor = vec4(lit, uOpacity);
  }
`

export function createRawMaterial() {
  const uniforms: RawUniforms = {
    uTime: { value: 0 },
    uMarinade: { value: 0 },
    uSeasonSpecks: { value: 0 },
    uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
    uLightDir2: { value: new THREE.Vector3(-0.6, 0.2, -0.4).normalize() },
    uLightColor: { value: new THREE.Color('#ffffff') },
    uRimColor: { value: new THREE.Color('#ff8a4c') },
    uOpacity: { value: 1 },
  }
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as unknown as { [k: string]: THREE.IUniform },
    transparent: true,
  })
  return { material, uniforms }
}
