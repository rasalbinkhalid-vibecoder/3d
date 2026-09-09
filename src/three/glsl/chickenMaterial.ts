import * as THREE from 'three'
import { snoise3 } from './noise'

export interface ChickenUniforms {
  uProgress: { value: number } // 0 raw .. 1 marinated .. 2 coated .. 3 fried/golden .. 4 rested
  uTime: { value: number }
  uCrackle: { value: number } // 0..1 crunch break reveal pulse
  uLightDir: { value: THREE.Vector3 }
  uLightDir2: { value: THREE.Vector3 }
  uColorRaw: { value: THREE.Color }
  uColorMarinated: { value: THREE.Color }
  uColorFlour: { value: THREE.Color }
  uColorGoldenLight: { value: THREE.Color }
  uColorGoldenDeep: { value: THREE.Color }
}

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uCrackle;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;
  varying float vBump;
  varying float vNoise;

  ${snoise3}

  void main() {
    vec3 pos = position;
    vec3 n = normalize(normal);

    // organic base wobble (raw/marinated skin) fades as breading takes over
    float wobble = snoise(pos * 1.6 + uTime * 0.05) * 0.02;

    // craggy fried coating grows in during the coating chapter (progress ~2.8 -> 3.6)
    float coatAmt = smoothstep(2.8, 3.6, uProgress);
    float crustNoise = snoise(pos * 6.5) * 0.5 + snoise(pos * 13.0) * 0.25;
    float bump = crustNoise * coatAmt * 0.085;

    // crunch reveal: crust fractures / puffs slightly outward
    float crack = snoise(pos * 4.2 + 11.0) * uCrackle * 0.06;

    vBump = coatAmt;
    vNoise = crustNoise;

    vec3 displaced = pos + n * (wobble + bump + crack);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * n);
    vViewDir = normalize(-mvPosition.xyz);
    vPos = displaced;

    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uLightDir;
  uniform vec3 uLightDir2;
  uniform vec3 uColorRaw;
  uniform vec3 uColorMarinated;
  uniform vec3 uColorFlour;
  uniform vec3 uColorGoldenLight;
  uniform vec3 uColorGoldenDeep;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vPos;
  varying float vBump;
  varying float vNoise;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    // stage blends keyed to the story chapters:
    // 0 hero/raw -> 1 chicken(raw) -> 2 marinade -> 3 coating(flour) -> 4 fryer(golden) -> 5 reveal(deep golden)
    float toMarinade = smoothstep(1.6, 2.6, uProgress);
    float toFlour = smoothstep(2.6, 3.4, uProgress);
    float toFryStart = smoothstep(3.7, 4.5, uProgress);
    float toFryDeep = smoothstep(4.3, 5.3, uProgress);

    vec3 color = mix(uColorRaw, uColorMarinated, toMarinade);
    color = mix(color, uColorFlour, toFlour);
    color = mix(color, uColorGoldenLight, toFryStart);
    color = mix(color, uColorGoldenDeep, toFryDeep);

    // hero: the piece begins life as a glowing brand-red "logo" object
    float logoTint = 1.0 - smoothstep(0.0, 1.0, uProgress);
    color = mix(color, vec3(0.88, 0.21, 0.1), logoTint * 0.85);

    // crust fleck variation once fried
    float fleck = smoothstep(0.15, 0.85, vNoise);
    vec3 fleckColor = mix(color * 0.55, uColorGoldenDeep * 0.6, 0.5);
    color = mix(color, fleckColor, fleck * toFryStart * 0.6);

    // lighting: two soft directional lights + ambient
    float diff = max(dot(N, uLightDir), 0.0);
    float diff2 = max(dot(N, uLightDir2), 0.0) * 0.45;
    float ambient = 0.42;

    vec3 halfV = normalize(uLightDir + V);
    float specPower = mix(48.0, 18.0, toFlour * (1.0 - toFryStart)); // glossy marinade, matte flour, then glossy fry
    float glossBoost = mix(0.25, 0.95, toFryStart);
    float spec = pow(max(dot(N, halfV), 0.0), specPower) * glossBoost;

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.5);
    vec3 rim = mix(vec3(0.9, 0.5, 0.3), vec3(1.0, 0.78, 0.35), toFryStart) * fresnel * (0.35 + toFryStart * 0.5);

    vec3 lit = color * (ambient + diff * 0.85 + diff2) + spec * vec3(1.0, 0.92, 0.78) + rim;

    // subtle warm glow while frying
    float fryGlow = smoothstep(3.8, 4.4, uProgress) * (1.0 - smoothstep(4.8, 5.4, uProgress));
    lit += vec3(0.35, 0.16, 0.02) * fryGlow * (0.4 + 0.3 * sin(uTime * 3.0 + vPos.x * 4.0));
    lit += vec3(0.22, 0.07, 0.03) * logoTint;

    gl_FragColor = vec4(lit, 1.0);
  }
`

export function createChickenMaterial() {
  const uniforms: ChickenUniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uCrackle: { value: 0 },
    uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
    uLightDir2: { value: new THREE.Vector3(-0.6, 0.2, -0.4).normalize() },
    uColorRaw: { value: new THREE.Color('#e8a99b') },
    uColorMarinated: { value: new THREE.Color('#c25a3a') },
    uColorFlour: { value: new THREE.Color('#e9d3ab') },
    uColorGoldenLight: { value: new THREE.Color('#e8a53f') },
    uColorGoldenDeep: { value: new THREE.Color('#9a4c17') },
  }

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as unknown as { [uniform: string]: THREE.IUniform },
  })

  return { material, uniforms }
}
