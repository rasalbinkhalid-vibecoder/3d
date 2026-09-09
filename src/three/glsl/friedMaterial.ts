import * as THREE from 'three'
import { snoise3 } from './noise'

export interface FriedUniforms {
  uTime: { value: number }
  uFry: { value: number } // 0 pale just-coated .. 1 fully golden-fried
  uCrackle: { value: number } // 0..1 crunch reveal pulse
  uLightDir: { value: THREE.Vector3 }
  uLightDir2: { value: THREE.Vector3 }
  uLightColor: { value: THREE.Color }
  uRimColor: { value: THREE.Color }
  uOpacity: { value: number }
}

const vertexShader = /* glsl */ `
  uniform float uFry;
  uniform float uCrackle;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vY;
  varying vec3 vPos;
  varying float vCrust;

  ${snoise3}

  void main() {
    vec3 n = normalize(normal);

    float crustNoise = snoise(position * 7.5) * 0.55 + snoise(position * 15.0) * 0.3 + snoise(position * 28.0) * 0.15;
    float crustAmt = mix(0.72, 1.0, uFry);
    float bump = crustNoise * crustAmt * 0.05;
    float crack = snoise(position * 4.0 + 9.0) * uCrackle * 0.05;

    vec3 displaced = position + n * (bump + crack);
    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * n);
    vViewDir = normalize(-mvPosition.xyz);
    vY = position.y;
    vPos = position;
    vCrust = crustNoise;

    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uFry;
  uniform vec3 uLightDir;
  uniform vec3 uLightDir2;
  uniform vec3 uLightColor;
  uniform vec3 uRimColor;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vY;
  varying vec3 vPos;
  varying float vCrust;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    vec3 bonePale = vec3(0.95, 0.9, 0.8);
    vec3 boneToasted = vec3(0.86, 0.72, 0.5);
    float boneMask = smoothstep(0.5, 0.68, vY);

    vec3 crustPale = vec3(0.93, 0.85, 0.66);
    vec3 crustGolden = vec3(0.82, 0.53, 0.19);
    vec3 crustDeep = vec3(0.46, 0.24, 0.08);

    vec3 crust = mix(crustPale, crustGolden, smoothstep(0.0, 0.6, uFry));
    crust = mix(crust, crustDeep, smoothstep(0.55, 1.0, uFry));

    float fleck = smoothstep(0.1, 0.9, vCrust);
    vec3 fleckColor = mix(crust * 0.5, crustDeep * 0.7, 0.5);
    crust = mix(crust, fleckColor, fleck * smoothstep(0.1, 0.5, uFry) * 0.65);

    vec3 bone = mix(bonePale, boneToasted, uFry * 0.6);
    vec3 color = mix(crust, bone, boneMask);

    float diff = max(dot(N, uLightDir), 0.0);
    float diff2 = max(dot(N, uLightDir2), 0.0) * 0.45;
    float ambient = 0.4;

    vec3 halfV = normalize(uLightDir + V);
    float spec = pow(max(dot(N, halfV), 0.0), 22.0) * mix(0.3, 0.85, uFry);

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.4);
    vec3 rim = uRimColor * fresnel * (0.3 + uFry * 0.55);

    vec3 lit = color * (ambient + diff * 0.9 + diff2) * uLightColor + spec * vec3(1.0, 0.9, 0.7) + rim;

    // warm interior glow while actively frying
    float fryGlow = smoothstep(0.05, 0.4, uFry) * (1.0 - smoothstep(0.75, 1.0, uFry));
    lit += vec3(0.3, 0.14, 0.02) * fryGlow * 0.5;

    lit *= 1.5; // exposure so mid-tones keep their brightness under the tonemap below
    lit = lit / (1.0 + lit); // soft-knee tonemap so hot highlights roll off instead of clipping to white
    gl_FragColor = vec4(lit, uOpacity);
  }
`

export function createFriedMaterial() {
  const uniforms: FriedUniforms = {
    uTime: { value: 0 },
    uFry: { value: 0 },
    uCrackle: { value: 0 },
    uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6).normalize() },
    uLightDir2: { value: new THREE.Vector3(-0.6, 0.2, -0.4).normalize() },
    uLightColor: { value: new THREE.Color('#ffffff') },
    uRimColor: { value: new THREE.Color('#ffb84d') },
    uOpacity: { value: 0 },
  }
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: uniforms as unknown as { [k: string]: THREE.IUniform },
    transparent: true,
  })
  return { material, uniforms }
}
