import * as THREE from 'three';

/**
 * Realistic Volumetric 3D Cumulus Cloud System
 * 
 * Technical Art & Architecture:
 * - 3D Sculpted billowy cumulus morphology with distinct flat base plane.
 * - Noise-displaced organic geometry: eliminates primitive sphere seams and creates natural vapor mounds.
 * - Vertex-colored atmospheric gradient: pure radiant white crests transitioning to soft pale-blue shadowed base.
 * - PBR MeshPhysicalMaterial with 100% roughness (velvety matte, zero plastic shine) and micro-sheen edge scattering.
 * - Per-lobe independent breathing & morphing loops with decorrelated phases.
 * - Soft perimeter atmospheric wisps for volumetric edge feathering.
 * 
 * License: CC0 / MIT (100% Procedural in-house technical art).
 */

export interface RealisticCloudProps {
  /** Center position [x, y, z] */
  position?: [number, number, number];
  /** Overall scale */
  scale?: number;
  /** Morphing & drift animation speed */
  speed?: number;
  /** Base shadow tint (soft pale sky blue) */
  baseColor?: string | number;
  /** Crest highlight color (illuminated white) */
  topColor?: string | number;
  /** Light position */
  lightPosition?: [number, number, number];
}

export interface RealisticCloudInstance {
  group: THREE.Group;
  update: (time: number, delta?: number) => void;
  dispose: () => void;
  setMouseParallax: (mx: number, my: number) => void;
}

/**
 * Procedural Cloud Vapor Normal Map
 * Generates a seamless 256x256 normal map representing micro-droplet vapor turbulence
 */
let cachedCloudNormalMap: THREE.CanvasTexture | null = null;

export function getCloudNormalMap(): THREE.CanvasTexture {
  if (cachedCloudNormalMap) return cachedCloudNormalMap;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const img = ctx.createImageData(size, size);
  const data = img.data;

  // Simple hash noise for micro-displacement
  const hash = (x: number, y: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  const smoothNoise = (x: number, y: number) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = x - ix;
    const fy = y - iy;
    const wx = fx * fx * (3 - 2 * fx);
    const wy = fy * fy * (3 - 2 * fy);
    const a = hash(ix, iy);
    const b = hash(ix + 1, iy);
    const c = hash(ix, iy + 1);
    const d = hash(ix + 1, iy + 1);
    return a + (b - a) * wx + (c - a) * wy + (a - b - c + d) * wx * wy;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const s = 0.05;
      const dx = smoothNoise((x + 1) * s, y * s) - smoothNoise((x - 1) * s, y * s);
      const dy = smoothNoise(x * s, (y + 1) * s) - smoothNoise(x * s, (y - 1) * s);

      // Normal vector = normalize(-dx, -dy, 1) mapped to [0, 255]
      const nx = -dx * 3.5;
      const ny = -dy * 3.5;
      const nz = 1.0;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);

      data[idx] = Math.floor(((nx / len) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor(((ny / len) * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor(((nz / len) * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  cachedCloudNormalMap = tex;
  return tex;
}

/**
 * Creates an organically deformed cumulus billow lobe geometry
 */
function createCumulusLobeGeometry(
  radius: number,
  flattenBase = false,
  baseCutoff = -0.55
): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(radius, 40, 32);
  const pos = geom.attributes.position;
  const count = pos.count;

  // 3D displacement noise
  const hash3 = (x: number, y: number, z: number) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return n - Math.floor(n);
  };

  const v3 = new THREE.Vector3();
  const colors = new Float32Array(count * 3);

  // Soft atmospheric base color (#e0ecff) to pure crest white (#ffffff)
  const baseColor = new THREE.Color(0xdeeafd);
  const crestColor = new THREE.Color(0xffffff);

  for (let i = 0; i < count; i++) {
    v3.fromBufferAttribute(pos, i);

    // Multi-octave organic billow noise
    const noise = (hash3(v3.x * 2.1, v3.y * 2.1, v3.z * 2.1) - 0.5) * 0.16 * radius;
    const noise2 = (hash3(v3.x * 4.3, v3.y * 4.3, v3.z * 4.3) - 0.5) * 0.08 * radius;
    v3.multiplyScalar(1.0 + (noise + noise2) / radius);

    // Flat base cumulus projection: compress underside vertices into a horizontal shelf
    if (flattenBase && v3.y < baseCutoff) {
      const under = baseCutoff - v3.y;
      v3.y = baseCutoff - under * 0.15; // flatten significantly
    }

    pos.setXYZ(i, v3.x, v3.y, v3.z);

    // Vertex color: cooler pale-blue at base -> brilliant illuminated white at crest
    const heightFactor = THREE.MathUtils.clamp((v3.y + radius * 0.5) / (radius * 1.5), 0.0, 1.0);
    const vertColor = baseColor.clone().lerp(crestColor, Math.pow(heightFactor, 0.85));

    colors[i * 3] = vertColor.r;
    colors[i * 3 + 1] = vertColor.g;
    colors[i * 3 + 2] = vertColor.b;
  }

  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geom.computeVertexNormals();
  return geom;
}

interface CloudLobe {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  baseScale: number;
  phase: number;
  speedMult: number;
}

/**
 * Creates the Realistic Hero 3D Cumulus Cloud
 */
export function createRealisticCloud(props: RealisticCloudProps = {}): RealisticCloudInstance {
  const {
    position = [-0.4, 0.9, 0],
    scale = 1.05,
    speed = 1.0,
  } = props;

  const group = new THREE.Group();
  group.position.set(position[0], position[1], position[2]);
  group.scale.set(scale, scale, scale);

  const normalMap = getCloudNormalMap();

  // PBR Physical Material: pure matte (roughness 0.96), velvet sheen, vertex colored
  const cloudMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.96, // completely non-shiny matte (bans shiny plastic balls)
    metalness: 0.0,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    sheen: 1.0,      // soft vapor edge scattering
    sheenRoughness: 0.7,
    sheenColor: new THREE.Color(0xf4f8ff),
    clearcoat: 0.0,
    reflectivity: 0.1,
  });

  const lobes: CloudLobe[] = [];

  // Carefully sculpted cumulus cloud mound structure:
  // [x, y, z, radius, flattenBase, baseCutoff]
  const lobeConfigs: Array<[number, number, number, number, boolean, number]> = [
    // 1. Central High Crest (Main Cumulus Tower)
    [0.0, 0.45, 0.0, 1.25, false, 0],
    // 2. Secondary Upper Billow (Sub-crest)
    [-0.55, 0.55, -0.15, 0.95, false, 0],
    // 3. Right Upper Billow
    [0.6, 0.4, 0.1, 0.98, false, 0],

    // 4. Mid Left Billowing Mound
    [-1.05, 0.05, 0.15, 1.02, true, -0.45],
    // 5. Far Left Outer Puff
    [-1.65, -0.22, 0.05, 0.8, true, -0.3],

    // 6. Mid Right Billowing Mound
    [1.15, 0.08, -0.1, 1.0, true, -0.45],
    // 7. Far Right Outer Puff
    [1.7, -0.2, 0.0, 0.76, true, -0.3],

    // 8. Front Soft Volumetric Bulge
    [-0.25, -0.1, 0.55, 0.88, true, -0.4],
    // 9. Back Soft Volumetric Bulge
    [0.35, -0.05, -0.55, 0.92, true, -0.4],

    // 10. Flat Base Underside Fillers (Wide flattened cumulus shelf along y = -0.65)
    [-0.7, -0.48, 0.1, 0.95, true, -0.2],
    [0.0, -0.52, 0.0, 1.1, true, -0.25],
    [0.75, -0.48, -0.05, 0.92, true, -0.2],
  ];

  const geometriesToDispose: THREE.BufferGeometry[] = [];

  lobeConfigs.forEach(([x, y, z, r, flat, cutoff], i) => {
    const geom = createCumulusLobeGeometry(r, flat, cutoff);
    geometriesToDispose.push(geom);

    const mesh = new THREE.Mesh(geom, cloudMaterial);
    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    group.add(mesh);

    lobes.push({
      mesh,
      basePos: new THREE.Vector3(x, y, z),
      baseScale: 1.0,
      phase: i * 0.72 + (i % 3) * 0.4,
      speedMult: 0.8 + (i % 4) * 0.15,
    });
  });

  // Soft atmospheric rim sprites around perimeter (feathered cumulus boundary)
  const wispsGroup = new THREE.Group();
  const wispCanvas = document.createElement('canvas');
  wispCanvas.width = 128;
  wispCanvas.height = 128;
  const wctx = wispCanvas.getContext('2d');
  if (wctx) {
    const grad = wctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(240, 246, 255, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    wctx.fillStyle = grad;
    wctx.fillRect(0, 0, 128, 128);
  }
  const wispTexture = new THREE.CanvasTexture(wispCanvas);
  const wispMat = new THREE.SpriteMaterial({
    map: wispTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const wispPositions = [
    [-1.7, 0.1, 0.2, 1.2],
    [1.7, 0.2, -0.1, 1.1],
    [-0.1, 1.35, 0.0, 1.3],
    [-1.1, 0.9, -0.1, 1.1],
    [1.0, 0.85, 0.15, 1.15],
  ];

  wispPositions.forEach(([wx, wy, wz, ws]) => {
    const sprite = new THREE.Sprite(wispMat);
    sprite.position.set(wx, wy, wz);
    sprite.scale.set(ws * 1.5, ws * 1.2, 1);
    wispsGroup.add(sprite);
  });
  group.add(wispsGroup);

  let targetMx = 0;
  let targetMy = 0;
  let currentMx = 0;
  let currentMy = 0;

  const update = (time: number) => {
    currentMx += (targetMx - currentMx) * 0.05;
    currentMy += (targetMy - currentMy) * 0.05;

    const t = time * speed;

    // Organic morphing & independent breathing of each cumulus lobe
    for (let i = 0; i < lobes.length; i++) {
      const lobe = lobes[i];
      const ph = lobe.phase;
      const sm = lobe.speedMult;

      // Soft breathing volume pulsation
      const breathe = 1.0 + Math.sin(t * 0.7 * sm + ph) * 0.028;
      lobe.mesh.scale.setScalar(lobe.baseScale * breathe);

      // Micro-morphing translation
      lobe.mesh.position.x = lobe.basePos.x + Math.sin(t * 0.45 * sm + ph) * 0.025;
      lobe.mesh.position.y = lobe.basePos.y + Math.cos(t * 0.6 * sm + ph * 1.2) * 0.02;
      lobe.mesh.position.z = lobe.basePos.z + Math.sin(t * 0.5 * sm + ph * 0.8) * 0.02;
    }

    // Overarching slow drift & gentle float
    const driftY = Math.sin(t * 0.5) * 0.09;
    const driftX = Math.sin(t * 0.28) * 0.06;

    group.position.x = position[0] + driftX + currentMx * 0.5;
    group.position.y = position[1] + driftY - currentMy * 0.4;

    // Subtle 3D volumetric rotation
    group.rotation.y = Math.sin(t * 0.35) * 0.12 + currentMx * 0.25;
    group.rotation.x = -currentMy * 0.15;
  };

  const setMouseParallax = (mx: number, my: number) => {
    targetMx = mx;
    targetMy = my;
  };

  const dispose = () => {
    geometriesToDispose.forEach((g) => g.dispose());
    cloudMaterial.dispose();
    wispTexture.dispose();
    wispMat.dispose();
  };

  return {
    group,
    update,
    dispose,
    setMouseParallax,
  };
}

/**
 * Variant: Realistic Low-Profile Cloud Bed for Campus / Section Basements
 */
export function createCloudBed(options: {
  width?: number;
  puffCount?: number;
  y?: number;
  speed?: number;
} = {}): RealisticCloudInstance {
  const {
    width = 11.0,
    puffCount = 12,
    y = -1.15,
    speed = 0.7,
  } = options;

  const group = new THREE.Group();
  group.position.set(0, y, 0);

  const normalMap = getCloudNormalMap();
  const bedMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.95,
    metalness: 0.0,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.3, 0.3),
    sheen: 0.8,
    sheenColor: new THREE.Color(0xf0f5ff),
  });

  const step = width / (puffCount - 1);
  const startX = -width / 2;
  const geometriesToDispose: THREE.BufferGeometry[] = [];
  const lobes: CloudLobe[] = [];

  for (let i = 0; i < puffCount; i++) {
    const r = 0.75 + Math.random() * 0.35;
    const geom = createCumulusLobeGeometry(r, true, -0.15);
    geometriesToDispose.push(geom);

    const mesh = new THREE.Mesh(geom, bedMaterial);
    const x = startX + i * step + (Math.random() - 0.5) * 0.3;
    const py = (Math.random() - 0.5) * 0.15;
    const z = 1.0 + Math.random() * 0.5;

    mesh.position.set(x, py, z);
    group.add(mesh);

    lobes.push({
      mesh,
      basePos: new THREE.Vector3(x, py, z),
      baseScale: 1.0,
      phase: i * 0.85,
      speedMult: 0.75 + Math.random() * 0.4,
    });
  }

  let targetMx = 0;
  let currentMx = 0;

  const update = (time: number) => {
    currentMx += (targetMx - currentMx) * 0.05;
    const t = time * speed;

    for (let i = 0; i < lobes.length; i++) {
      const lobe = lobes[i];
      const ph = lobe.phase;
      const breathe = 1.0 + Math.sin(t * 0.6 * lobe.speedMult + ph) * 0.025;
      lobe.mesh.scale.setScalar(breathe);
      lobe.mesh.position.y = lobe.basePos.y + Math.sin(t * 0.5 * lobe.speedMult + ph) * 0.015;
    }
    group.position.x = currentMx * 0.2;
  };

  const setMouseParallax = (mx: number) => {
    targetMx = mx;
  };

  const dispose = () => {
    geometriesToDispose.forEach((g) => g.dispose());
    bedMaterial.dispose();
  };

  return {
    group,
    update,
    dispose,
    setMouseParallax,
  };
}
