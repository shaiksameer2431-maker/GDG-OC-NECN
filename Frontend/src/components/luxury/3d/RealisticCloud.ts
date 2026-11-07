import * as THREE from 'three';

/**
 * Realistic Volumetric Cloud System
 * 
 * Technical Art & Shading Architecture:
 * - Volumetric multi-octave puff cluster with flattened base plane (cumulus morphology).
 * - Procedural turbulence alpha texture with Gaussian falloff (0 KB external download, 100% CC0).
 * - Subsurface light-scattering shader with vertical pale-blue to illuminated-white gradient.
 * - Organic per-puff breathing/morphing animation loops (decorrelated phases).
 * - ACESFilmic tone-mapping compatible, soft directional wrap lighting, non-specular.
 * 
 * License: CC0 / MIT (Completely custom procedural implementation).
 */

export interface RealisticCloudProps {
  /** Center position [x, y, z] */
  position?: [number, number, number];
  /** Overall scale multiplier */
  scale?: number;
  /** Morphing & drift animation speed */
  speed?: number;
  /** Cloud opacity (0.0 to 1.0) */
  opacity?: number;
  /** Base shadow tint (cool pale sky blue) */
  baseColor?: string | number;
  /** Crest highlight color (illuminated white) */
  topColor?: string | number;
  /** Light position for forward scattering */
  lightPosition?: [number, number, number];
  /** Light intensity */
  lightIntensity?: number;
  /** Enable flat base cumulus clipping */
  flatBase?: boolean;
  /** Billow count */
  puffCount?: number;
}

export interface RealisticCloudInstance {
  group: THREE.Group;
  update: (time: number, delta?: number) => void;
  dispose: () => void;
  setMouseParallax: (mx: number, my: number) => void;
}

/**
 * Procedural Cloud Puff Texture Generator
 * Generates a smooth, wispy cumulus puff texture with radial Gaussian falloff and fractal turbulence.
 */
let cachedPuffTexture: THREE.CanvasTexture | null = null;

export function getProceduralCloudTexture(): THREE.CanvasTexture {
  if (cachedPuffTexture) return cachedPuffTexture;

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    // Fallback to empty canvas texture if 2D context fails
    return new THREE.CanvasTexture(canvas);
  }

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;
  const center = size / 2;
  const radius = size * 0.46;

  // Simple pseudo-random permutation hash for turbulence
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  };

  // Smooth bilinear noise
  const noise = (x: number, y: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const wx = fx * fx * (3.0 - 2.0 * fx);
    const wy = fy * fy * (3.0 - 2.0 * fy);

    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);

    return a + (b - a) * wx + (c - a) * wy + (a - b - c + d) * wx * wy;
  };

  // 3-octave fractal Brownian motion for wispy cloud contour
  const fbm = (x: number, y: number) => {
    let v = 0.0;
    let a = 0.55;
    let shiftX = 0;
    let shiftY = 0;
    for (let i = 0; i < 3; i++) {
      v += a * noise(x + shiftX, y + shiftY);
      x *= 2.15;
      y *= 2.15;
      shiftX += 1.3;
      shiftY += 1.7;
      a *= 0.48;
    }
    return v;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist >= radius) {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 0;
        continue;
      }

      // Normalized radial falloff: dense opaque core with feathered wispy boundary
      const normDist = dist / radius;
      const coreDensity = Math.min(1.0, Math.pow(Math.cos(normDist * (Math.PI / 2)), 0.65));
      const turb = fbm(x * 0.022, y * 0.022);
      const edgeTurbulence = 0.75 + turb * 0.42;
      const alphaNorm = Math.max(0.0, Math.min(1.0, coreDensity * edgeTurbulence));
      const alphaVal = Math.floor(Math.pow(alphaNorm, 1.05) * 255);

      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = alphaVal;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  cachedPuffTexture = texture;

  return texture;
}

/**
 * Creates a Volumetric Light-Scattering Cloud Material
 */
export function createVolumetricCloudMaterial(options: {
  baseColor?: string | number;
  topColor?: string | number;
  lightPosition?: [number, number, number];
  opacity?: number;
}) {
  const texture = getProceduralCloudTexture();
  const baseCol = new THREE.Color(options.baseColor ?? '#eef4fc');
  const topCol = new THREE.Color(options.topColor ?? '#ffffff');
  const lightPos = new THREE.Vector3(...(options.lightPosition ?? [4, 6, 6])).normalize();
  const opacity = options.opacity ?? 0.96;

  // Custom volumetric scattering shader
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uBaseColor: { value: baseCol },
      uTopColor: { value: topCol },
      uLightDir: { value: lightPos },
      uLightColor: { value: new THREE.Color(0xffffff) },
      uOpacity: { value: opacity },
      uScatter: { value: 0.3 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying float vRelHeight;

      void main() {
        vUv = uv;
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vRelHeight = worldPos.y;
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec3 uBaseColor;
      uniform vec3 uTopColor;
      uniform vec3 uLightDir;
      uniform vec3 uLightColor;
      uniform float uOpacity;
      uniform float uScatter;
      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vWorldNormal;
      varying vec3 vViewDir;
      varying float vRelHeight;

      void main() {
        vec4 texColor = texture2D(uMap, vUv);
        if (texColor.a < 0.01) discard;

        // Local puff lighting: upper hemisphere of each billow catches direct sunlight
        float puffTopLit = clamp((vUv.y - 0.25) / 0.75, 0.0, 1.0);

        // Macro-cloud vertical gradient (subtle shadowed cloud floor -> radiant crest)
        float heightFactor = smoothstep(-0.35, 1.25, vRelHeight);
        vec3 gradientCol = mix(uBaseColor, uTopColor, heightFactor);

        // Directional wrap lighting (sun illuminating from top-right)
        float NdotL = dot(vWorldNormal, uLightDir);
        float wrapLight = max(0.0, (NdotL + 0.4) / 1.4);
        wrapLight = pow(wrapLight, 1.2);

        // Soft forward scattering glint
        float VdotL = dot(vViewDir, -uLightDir);
        float forwardScatter = pow(max(0.0, VdotL * 0.5 + 0.5), 2.5) * uScatter;

        // Combine: brilliant billowy white with delicate atmospheric occlusion
        vec3 litColor = gradientCol * (0.88 + 0.14 * puffTopLit + 0.12 * wrapLight) 
                      + (uLightColor * forwardScatter * 0.25);

        gl_FragColor = vec4(litColor, texColor.a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.NormalBlending,
    side: THREE.DoubleSide,
  });

  return material;
}

/**
 * Definition of a single puff inside the cumulus cloud cluster
 */
interface PuffData {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  baseScale: THREE.Vector3;
  baseRotZ: number;
  phase: number;
  speedMultiplier: number;
  isBasePuff: boolean;
}

/**
 * Creates a Realistic Volumetric Cloud
 * 
 * Features:
 * - Flat cumulus base structure.
 * - Organic multi-lobed billow domes.
 * - Non-specular, soft light scattering.
 * - Gentle puff morphing and independent breathing loops.
 * - Smooth mouse parallax reaction.
 */
export function createRealisticCloud(props: RealisticCloudProps = {}): RealisticCloudInstance {
  const {
    position = [0, 0, 0],
    scale = 1.0,
    speed = 1.0,
    opacity = 0.98,
    baseColor = '#eef4fc',
    topColor = '#ffffff',
    lightPosition = [4, 6, 6],
    flatBase = true,
  } = props;

  const group = new THREE.Group();
  group.position.set(position[0], position[1], position[2]);
  group.scale.set(scale, scale, scale);

  const material = createVolumetricCloudMaterial({
    baseColor,
    topColor,
    lightPosition,
    opacity,
  });

  // Reusable quad plane for the billowy puff sprites
  const puffGeometry = new THREE.PlaneGeometry(2.35, 2.35, 1, 1);
  const puffs: PuffData[] = [];

  // Carefully sculpted cumulus structure:
  // [x, y, z, scaleX, scaleY, scaleZ, isBasePuff]
  // 1. Flat Base Puffs (y between -0.45 and -0.75, widened horizontally to form the distinct flat bottom)
  const basePuffConfigs: Array<[number, number, number, number, number, number]> = [
    [-1.6, -0.65, 0.1, 1.6, 0.7, 1.3],
    [-0.9, -0.7, -0.2, 1.8, 0.65, 1.4],
    [-0.1, -0.72, 0.3, 2.1, 0.7, 1.5],
    [0.8, -0.7, -0.15, 1.9, 0.68, 1.4],
    [1.5, -0.65, 0.2, 1.5, 0.65, 1.2],
    [-0.5, -0.75, 0.5, 1.7, 0.6, 1.3],
    [0.4, -0.75, -0.5, 1.7, 0.6, 1.3],
  ];

  // 2. Main Central Core and Billowing Crests (y between -0.2 and +1.1, layered depth)
  const domePuffConfigs: Array<[number, number, number, number, number, number]> = [
    // Central Main Dome (Highest crest)
    [0.05, 0.55, 0.05, 2.0, 1.8, 1.8],
    [-0.2, 0.85, -0.1, 1.7, 1.5, 1.5],
    [0.3, 0.9, 0.15, 1.6, 1.45, 1.45],
    
    // Left Flank Billows
    [-1.1, 0.25, 0.2, 1.6, 1.4, 1.4],
    [-1.4, 0.45, -0.15, 1.4, 1.3, 1.3],
    [-1.8, -0.05, 0.05, 1.3, 1.15, 1.15],
    [-0.7, 0.6, 0.35, 1.4, 1.35, 1.35],

    // Right Flank Billows
    [1.1, 0.2, -0.2, 1.7, 1.45, 1.45],
    [1.3, 0.5, 0.1, 1.5, 1.35, 1.35],
    [1.8, -0.1, -0.05, 1.3, 1.15, 1.15],
    [0.8, 0.65, -0.3, 1.45, 1.3, 1.3],

    // Front Volumetric Fill (Soft foreground layer)
    [-0.4, -0.15, 0.65, 1.65, 1.4, 1.4],
    [0.45, -0.1, 0.6, 1.6, 1.35, 1.35],
    [0.0, 0.25, 0.75, 1.35, 1.2, 1.2],

    // Back Volumetric Fill (Soft depth backdrop)
    [-0.3, 0.05, -0.65, 1.7, 1.4, 1.4],
    [0.5, 0.1, -0.6, 1.65, 1.35, 1.35],
    [-0.9, -0.2, -0.5, 1.4, 1.2, 1.2],
    [1.0, -0.15, -0.45, 1.45, 1.25, 1.25],
  ];

  const allConfigs: Array<[number, number, number, number, number, number, boolean]> = [
    ...basePuffConfigs.map((c) => [...c, true] as [number, number, number, number, number, number, boolean]),
    ...domePuffConfigs.map((c) => [...c, false] as [number, number, number, number, number, number, boolean]),
  ];

  allConfigs.forEach(([x, y, z, sx, sy, sz, isBase], index) => {
    const mesh = new THREE.Mesh(puffGeometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);

    // Initial subtle random tilt
    const rotZ = (Math.random() - 0.5) * 0.4;
    mesh.rotation.z = rotZ;

    // Decorrelated phase and breathing frequencies
    const phase = index * 0.78 + Math.random() * 0.5;
    const speedMultiplier = 0.75 + Math.random() * 0.5;

    group.add(mesh);
    puffs.push({
      mesh,
      basePos: new THREE.Vector3(x, y, z),
      baseScale: new THREE.Vector3(sx, sy, sz),
      baseRotZ: rotZ,
      phase,
      speedMultiplier,
      isBasePuff: isBase,
    });
  });

  // Target mouse parallax offsets
  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

  const update = (time: number, delta: number = 0.016) => {
    // Update shader uniform time
    material.uniforms.uTime.value = time;

    // Mouse parallax smooth interpolation
    currentMx += (targetMx - currentMx) * 0.06;
    currentMy += (targetMy - currentMy) * 0.06;

    // Organic breathing and morphing of each individual puff
    const t = time * speed;
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const ph = p.phase;
      const sm = p.speedMultiplier;

      // Gentle scale breathing (soft pulsing of billowy volume)
      const breathe = 1.0 + Math.sin(t * 0.85 * sm + ph) * 0.055;
      p.mesh.scale.x = p.baseScale.x * breathe;
      p.mesh.scale.y = p.baseScale.y * (p.isBasePuff ? breathe * 0.9 : breathe);
      p.mesh.scale.z = p.baseScale.z * breathe;

      // Micro-morphing translation (soft turbulent drifting inside the cloud mass)
      const morphX = Math.sin(t * 0.45 * sm + ph) * 0.045;
      const morphY = Math.cos(t * 0.65 * sm + ph * 1.2) * (p.isBasePuff ? 0.02 : 0.035);
      const morphZ = Math.sin(t * 0.55 * sm + ph * 0.7) * 0.035;

      p.mesh.position.x = p.basePos.x + morphX;
      p.mesh.position.y = p.basePos.y + morphY;
      p.mesh.position.z = p.basePos.z + morphZ;

      // Subtle rotation oscillation
      p.mesh.rotation.z = p.baseRotZ + Math.sin(t * 0.3 * sm + ph) * 0.04;
    }

    // Overarching slow drift & tilt of the entire cloud system
    const driftY = Math.sin(t * 0.7) * 0.08;
    const driftX = Math.sin(t * 0.35) * 0.06;

    group.position.x = position[0] + driftX + currentMx * 0.55;
    group.position.y = position[1] + driftY - currentMy * 0.45;

    // Subtle 3D volumetric rotation response to mouse
    group.rotation.y = Math.sin(t * 0.4) * 0.08 + currentMx * 0.22;
    group.rotation.x = -currentMy * 0.16;
  };

  const setMouseParallax = (mx: number, my: number) => {
    targetMx = mx;
    targetMy = my;
  };

  const dispose = () => {
    puffGeometry.dispose();
    material.dispose();
  };

  return {
    group,
    update,
    dispose,
    setMouseParallax,
  };
}

/**
 * Variant: Realistic Low-Profile Cloud Bed for Section Basements
 * Creates a soft, continuous cumulus fog bed along a horizontal plane (e.g., Campus section)
 */
export function createCloudBed(options: {
  width?: number;
  puffCount?: number;
  y?: number;
  baseColor?: string | number;
  topColor?: string | number;
  opacity?: number;
  speed?: number;
} = {}): RealisticCloudInstance {
  const {
    width = 12.0,
    puffCount = 18,
    y = -1.1,
    baseColor = '#d4e4fc',
    topColor = '#ffffff',
    opacity = 0.92,
    speed = 0.8,
  } = options;

  const group = new THREE.Group();
  group.position.set(0, y, 0);

  const material = createVolumetricCloudMaterial({
    baseColor,
    topColor,
    opacity,
  });

  const puffGeometry = new THREE.PlaneGeometry(2.4, 2.0, 1, 1);
  const puffs: PuffData[] = [];

  const step = width / (puffCount - 1);
  const startX = -width / 2;

  for (let i = 0; i < puffCount; i++) {
    const x = startX + i * step + (Math.random() - 0.5) * 0.4;
    const puffY = (Math.random() - 0.5) * 0.2;
    const z = 0.8 + Math.random() * 0.8;
    const sx = 1.3 + Math.random() * 0.6;
    const sy = 0.85 + Math.random() * 0.35;
    const sz = 1.0;

    const mesh = new THREE.Mesh(puffGeometry, material);
    mesh.position.set(x, puffY, z);
    mesh.scale.set(sx, sy, sz);

    const rotZ = (Math.random() - 0.5) * 0.3;
    mesh.rotation.z = rotZ;

    const phase = i * 0.9 + Math.random() * 0.5;

    group.add(mesh);
    puffs.push({
      mesh,
      basePos: new THREE.Vector3(x, puffY, z),
      baseScale: new THREE.Vector3(sx, sy, sz),
      baseRotZ: rotZ,
      phase,
      speedMultiplier: 0.7 + Math.random() * 0.5,
      isBasePuff: true,
    });
  }

  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

  const update = (time: number) => {
    material.uniforms.uTime.value = time;
    currentMx += (targetMx - currentMx) * 0.05;
    currentMy += (targetMy - currentMy) * 0.05;

    const t = time * speed;
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const ph = p.phase;
      const sm = p.speedMultiplier;

      const breathe = 1.0 + Math.sin(t * 0.7 * sm + ph) * 0.045;
      p.mesh.scale.x = p.baseScale.x * breathe;
      p.mesh.scale.y = p.baseScale.y * breathe;

      const morphY = Math.cos(t * 0.5 * sm + ph) * 0.03;
      p.mesh.position.y = p.basePos.y + morphY;
    }

    group.position.x = currentMx * 0.3;
  };

  const setMouseParallax = (mx: number, my: number) => {
    targetMx = mx;
    targetMy = my;
  };

  const dispose = () => {
    puffGeometry.dispose();
    material.dispose();
  };

  return {
    group,
    update,
    dispose,
    setMouseParallax,
  };
}
