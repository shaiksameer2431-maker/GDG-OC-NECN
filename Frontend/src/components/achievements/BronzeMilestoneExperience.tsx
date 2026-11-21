import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { COMMUNITY_BRONZE_MILESTONE, COMMUNITY_SILVER_MILESTONE } from '../../config/communityTiers';
import './BronzeMilestoneExperience.css';

export interface BronzeMilestoneExperienceProps {
  onExploreLeaderboard?: () => void;
  className?: string;
  id?: string;
  isIntro?: boolean;
  initialTier?: 'bronze' | 'silver';
  onTransformStart?: () => void;
  onTransformComplete?: () => void;
}

export const BronzeMilestoneExperience: React.FC<BronzeMilestoneExperienceProps> = ({
  className = '',
  id = 'bronze-milestone-experience',
  isIntro = false,
  initialTier,
  onTransformStart,
  onTransformComplete,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [activeTier, setActiveTier] = useState<'bronze' | 'silver'>(
    isIntro ? 'bronze' : (initialTier || 'silver')
  );
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(0);

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Target tier trigger ref for manual toggling when embedded on Overview
  const targetTierRef = useRef<'bronze' | 'silver'>(activeTier);

  // Callbacks refs to avoid stale closures in requestAnimationFrame loop
  const onTransformStartRef = useRef(onTransformStart);
  const onTransformCompleteRef = useRef(onTransformComplete);
  useEffect(() => {
    onTransformStartRef.current = onTransformStart;
    onTransformCompleteRef.current = onTransformComplete;
  });

  const bronzeData = useMemo(() => COMMUNITY_BRONZE_MILESTONE, []);
  const silverData = useMemo(() => COMMUNITY_SILVER_MILESTONE, []);
  const currentData = activeTier === 'bronze' ? bronzeData : silverData;

  // Handle tier toggle on Overview page (when not in full-screen intro mode)
  const handleSelectTier = useCallback((tier: 'bronze' | 'silver') => {
    if (isIntro || isTransforming || tier === activeTier) return;
    targetTierRef.current = tier;
    setIsTransforming(true);
  }, [isIntro, isTransforming, activeTier]);

  // Three.js Scene Setup & Animation Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    // Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const maxDpr = isMobile ? 1.75 : 2.0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.className = 'bme-canvas-element';

    // Camera Framing (Hexagonal shield: Width: 4.33, Height: 5.0)
    const adjustCamera = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      camera.aspect = aspect;
      const halfFovRad = (camera.fov * Math.PI) / 360;
      const tanHalfFov = Math.tan(halfFovRad);

      const targetHeight = 5.80;
      const targetWidth = 5.15;

      const zForHeight = targetHeight / (2 * tanHalfFov);
      const zForWidth = targetWidth / (2 * tanHalfFov * aspect);
      camera.position.z = Math.max(zForHeight, zForWidth);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    adjustCamera(width, height);

    // -------------------------------------------------------------------------
    // PROCEDURAL TEXTURE GENERATION (BRONZE & SILVER SHIELD FACES)
    // -------------------------------------------------------------------------
    const createShieldTextures = (tier: 'bronze' | 'silver') => {
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 1024;
      cCanvas.height = 1024;
      const ctx = cCanvas.getContext('2d');

      const bCanvas = document.createElement('canvas');
      bCanvas.width = 1024;
      bCanvas.height = 1024;
      const bCtx = bCanvas.getContext('2d');

      if (!ctx || !bCtx) return { colorMap: null, bumpMap: null };

      const cx = 512;
      const cy = 512;
      const hexRadius = 450;

      const drawHexPath = (targetCtx: CanvasRenderingContext2D, r: number) => {
        targetCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = -Math.PI / 2 + (i * Math.PI) / 3;
          const hx = cx + Math.cos(angle) * r;
          const hy = cy + Math.sin(angle) * r;
          if (i === 0) targetCtx.moveTo(hx, hy);
          else targetCtx.lineTo(hx, hy);
        }
        targetCtx.closePath();
      };

      if (tier === 'bronze') {
        // Base Canvas Fill (Copper-bronze)
        ctx.fillStyle = '#8E523A';
        ctx.fillRect(0, 0, 1024, 1024);
        bCtx.fillStyle = '#404040';
        bCtx.fillRect(0, 0, 1024, 1024);

        ctx.save();
        drawHexPath(ctx, hexRadius);
        ctx.clip();

        // Satin Warm Copper-Bronze Radial Gradient Base
        const grad = ctx.createRadialGradient(cx, cy - 50, 30, cx, cy, hexRadius);
        grad.addColorStop(0, '#FFF2E6');
        grad.addColorStop(0.18, '#EEC39C');
        grad.addColorStop(0.48, '#CC9873');
        grad.addColorStop(0.78, '#B17656');
        grad.addColorStop(1, '#8E523A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Top Header: "GDG ON CAMPUS"
        ctx.font = 'bold 38px "Plus Jakarta Sans", "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(40, 15, 6, 0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('GDG ON CAMPUS', cx, cy - 230);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        bCtx.font = 'bold 38px "Plus Jakarta Sans", "Arial Black", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('GDG ON CAMPUS', cx, cy - 230);

        // Top Sub-header Pill: "NECN"
        const pillW = 150;
        const pillH = 40;
        const pillX = cx - pillW / 2;
        const pillY = cy - 182;
        ctx.fillStyle = '#5A2612';
        ctx.strokeStyle = '#EEC39C';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 22px "Plus Jakarta Sans", monospace, sans-serif';
        ctx.fillStyle = '#FFFDF8';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText('NECN', cx, pillY + pillH / 2);
        ctx.shadowBlur = 0;

        // MULTICOLOR GDG BRACKETS LOGO: { < / > }
        const logoY = cy - 35;
        ctx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4285F4'; ctx.shadowColor = 'rgba(66, 133, 244, 0.45)'; ctx.shadowBlur = 12;
        ctx.fillText('{', cx - 140, logoY);
        ctx.fillStyle = '#EA4335'; ctx.shadowColor = 'rgba(234, 67, 53, 0.45)';
        ctx.fillText('<', cx - 55, logoY);
        ctx.fillStyle = '#FBBC04'; ctx.shadowColor = 'rgba(251, 188, 4, 0.45)';
        ctx.fillText('>', cx + 55, logoY);
        ctx.fillStyle = '#34A853'; ctx.shadowColor = 'rgba(52, 168, 83, 0.45)';
        ctx.fillText('}', cx + 140, logoY);
        ctx.shadowBlur = 0;

        bCtx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('{ < > }', cx, logoY);

        // ENGRAVED TEXT: "BRONZE"
        ctx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
        ctx.letterSpacing = '6px';
        ctx.shadowColor = 'rgba(35, 12, 4, 0.95)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#2A0E05';
        ctx.fillText('BRONZE', cx, cy + 124);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const bronzeGrad = ctx.createLinearGradient(cx - 190, cy + 90, cx + 190, cy + 135);
        bronzeGrad.addColorStop(0, '#FFFFFF');
        bronzeGrad.addColorStop(0.25, '#FFF0E0');
        bronzeGrad.addColorStop(0.55, '#EEC39C');
        bronzeGrad.addColorStop(0.85, '#CC9873');
        bronzeGrad.addColorStop(1, '#8E523A');
        ctx.fillStyle = bronzeGrad;
        ctx.fillText('BRONZE', cx, cy + 120);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.0;
        ctx.strokeText('BRONZE', cx, cy + 120);

        bCtx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
        bCtx.letterSpacing = '6px';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('BRONZE', cx, cy + 120);

        // Ribbon pill: "★ MILESTONE ACHIEVED ★"
        const ribW = 460;
        const ribH = 50;
        const ribX = cx - ribW / 2;
        const ribY = cy + 175;
        ctx.fillStyle = 'rgba(50, 20, 8, 0.85)';
        ctx.strokeStyle = '#EEC39C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(ribX, ribY, ribW, ribH, 25);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '5px';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('★ MILESTONE ACHIEVED ★', cx, ribY + ribH / 2 + 1);
        ctx.shadowBlur = 0;

        bCtx.font = '900 28px "Plus Jakarta Sans", sans-serif';
        bCtx.letterSpacing = '5px';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('★ MILESTONE ACHIEVED ★', cx, ribY + ribH / 2 + 1);

        ctx.restore();
      } else {
        // SILVER TEXTURE
        ctx.fillStyle = '#64748B';
        ctx.fillRect(0, 0, 1024, 1024);
        bCtx.fillStyle = '#404040';
        bCtx.fillRect(0, 0, 1024, 1024);

        ctx.save();
        drawHexPath(ctx, hexRadius);
        ctx.clip();

        // Satin Platinum-Silver Radial Gradient Base
        const silverGradBase = ctx.createRadialGradient(cx, cy - 60, 30, cx, cy, hexRadius);
        silverGradBase.addColorStop(0, '#FFFFFF');
        silverGradBase.addColorStop(0.18, '#F8FAFC');
        silverGradBase.addColorStop(0.48, '#E2E8F0');
        silverGradBase.addColorStop(0.78, '#CBD5E1');
        silverGradBase.addColorStop(1, '#94A3B8');
        ctx.fillStyle = silverGradBase;
        ctx.fillRect(0, 0, 1024, 1024);

        // Top Header: "GDG ON CAMPUS"
        ctx.font = 'bold 38px "Plus Jakarta Sans", "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(15, 23, 42, 0.85)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('GDG ON CAMPUS', cx, cy - 230);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        bCtx.font = 'bold 38px "Plus Jakarta Sans", "Arial Black", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('GDG ON CAMPUS', cx, cy - 230);

        // Top Sub-header Pill: "NECN"
        const pillW = 150;
        const pillH = 40;
        const pillX = cx - pillW / 2;
        const pillY = cy - 182;
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 20);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 22px "Plus Jakarta Sans", monospace, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText('NECN', cx, pillY + pillH / 2);
        ctx.shadowBlur = 0;

        // MULTICOLOR GDG BRACKETS LOGO: { < / > }
        const logoY = cy - 35;
        ctx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#4285F4'; ctx.shadowColor = 'rgba(66, 133, 244, 0.45)'; ctx.shadowBlur = 12;
        ctx.fillText('{', cx - 140, logoY);
        ctx.fillStyle = '#EA4335'; ctx.shadowColor = 'rgba(234, 67, 53, 0.45)';
        ctx.fillText('<', cx - 55, logoY);
        ctx.fillStyle = '#FBBC04'; ctx.shadowColor = 'rgba(251, 188, 4, 0.45)';
        ctx.fillText('>', cx + 55, logoY);
        ctx.fillStyle = '#34A853'; ctx.shadowColor = 'rgba(52, 168, 83, 0.45)';
        ctx.fillText('}', cx + 140, logoY);
        ctx.shadowBlur = 0;

        bCtx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('{ < > }', cx, logoY);

        // ENGRAVED TEXT: "SILVER"
        ctx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
        ctx.letterSpacing = '6px';
        ctx.shadowColor = 'rgba(15, 23, 42, 0.95)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#0F172A';
        ctx.fillText('SILVER', cx, cy + 124);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const silverGradText = ctx.createLinearGradient(cx - 190, cy + 90, cx + 190, cy + 135);
        silverGradText.addColorStop(0, '#FFFFFF');
        silverGradText.addColorStop(0.25, '#F8FAFC');
        silverGradText.addColorStop(0.55, '#E2E8F0');
        silverGradText.addColorStop(0.85, '#CBD5E1');
        silverGradText.addColorStop(1, '#64748B');
        ctx.fillStyle = silverGradText;
        ctx.fillText('SILVER', cx, cy + 120);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.0;
        ctx.strokeText('SILVER', cx, cy + 120);

        bCtx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
        bCtx.letterSpacing = '6px';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('SILVER', cx, cy + 120);

        // Ribbon pill: "★ SILVER MILESTONE ACHIEVED ★"
        const ribW = 500;
        const ribH = 50;
        const ribX = cx - ribW / 2;
        const ribY = cy + 175;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(ribX, ribY, ribW, ribH, 25);
        ctx.fill();
        ctx.stroke();

        ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '4px';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('★ SILVER MILESTONE ACHIEVED ★', cx, ribY + ribH / 2 + 1);
        ctx.shadowBlur = 0;

        bCtx.font = '900 26px "Plus Jakarta Sans", sans-serif';
        bCtx.letterSpacing = '4px';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fillText('★ SILVER MILESTONE ACHIEVED ★', cx, ribY + ribH / 2 + 1);

        ctx.restore();
      }

      const colorTexture = new THREE.CanvasTexture(cCanvas);
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      const bumpTexture = new THREE.CanvasTexture(bCanvas);

      return { colorMap: colorTexture, bumpMap: bumpTexture };
    };

    const bronzeTextures = createShieldTextures('bronze');
    const silverTextures = createShieldTextures('silver');

    // -------------------------------------------------------------------------
    // 3D MULTI-LAYER HEXAGONAL SHIELD MESH
    // -------------------------------------------------------------------------
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Initial tier status
    const startAsSilver = !isIntro && (initialTier === 'silver' || !initialTier);
    let currentMorphProgress = startAsSilver ? 1.0 : 0.0;
    let targetMorphProgress = startAsSilver ? 1.0 : 0.0;

    // Palette Colors
    const cBronzeBase = new THREE.Color(0xB17656);
    const cSilverBase = new THREE.Color(0x94A3B8);

    const cBronzeFrame = new THREE.Color(0xCC9873);
    const cSilverFrame = new THREE.Color(0xCBD5E1);

    const cBronzeRidge = new THREE.Color(0xEEC39C);
    const cSilverRidge = new THREE.Color(0xF1F5F9);

    const cBronzeBack = new THREE.Color(0x8E523A);
    const cSilverBack = new THREE.Color(0x64748B);

    const cBronzeRivet = new THREE.Color(0xEEC39C);
    const cSilverRivet = new THREE.Color(0xFFFFFF);

    // Dynamic Materials
    const baseMat = new THREE.MeshStandardMaterial({
      color: startAsSilver ? cSilverBase.clone() : cBronzeBase.clone(),
      metalness: startAsSilver ? 0.82 : 0.35,
      roughness: startAsSilver ? 0.24 : 0.38,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: startAsSilver ? cSilverFrame.clone() : cBronzeFrame.clone(),
      metalness: startAsSilver ? 0.88 : 0.38,
      roughness: startAsSilver ? 0.18 : 0.28,
    });

    const ridgeMat = new THREE.MeshStandardMaterial({
      color: startAsSilver ? cSilverRidge.clone() : cBronzeRidge.clone(),
      metalness: startAsSilver ? 0.94 : 0.40,
      roughness: startAsSilver ? 0.12 : 0.20,
    });

    const backMat = new THREE.MeshStandardMaterial({
      color: startAsSilver ? cSilverBack.clone() : cBronzeBack.clone(),
      metalness: startAsSilver ? 0.80 : 0.32,
      roughness: startAsSilver ? 0.26 : 0.40,
    });

    const rivetMat = new THREE.MeshStandardMaterial({
      color: startAsSilver ? cSilverRivet.clone() : cBronzeRivet.clone(),
      metalness: startAsSilver ? 0.95 : 0.42,
      roughness: startAsSilver ? 0.10 : 0.20,
    });

    // 1. Foundation Hexagon Plate (Layer 1)
    const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.24, 6);
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    shieldGroup.add(baseMesh);

    // 2. Bevelled Outer Hexagonal Frame (Layer 2)
    const frameGeo = new THREE.CylinderGeometry(2.38, 2.38, 0.28, 6);
    frameGeo.rotateX(Math.PI / 2);
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    shieldGroup.add(frameMesh);

    // 3. Highlight Bevel Ridge (Layer 3)
    const ridgeGeo = new THREE.CylinderGeometry(2.26, 2.26, 0.3, 6);
    ridgeGeo.rotateX(Math.PI / 2);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, ridgeMat);
    shieldGroup.add(ridgeMesh);

    // 4. Dual Front Shield Faces (Bronze & Silver cross-fading surfaces)
    const faceRadius = 2.14;
    const faceGeo = new THREE.CylinderGeometry(faceRadius, faceRadius, 0.05, 6);
    faceGeo.rotateX(Math.PI / 2);

    const pos = faceGeo.attributes.position;
    const uv = faceGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) > 0.01) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        uv.setXY(i, x / (2 * faceRadius) + 0.5, y / (2 * faceRadius) + 0.5);
      }
    }
    uv.needsUpdate = true;

    // Bronze Front Face
    const bronzeFaceMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      map: bronzeTextures.colorMap,
      bumpMap: bronzeTextures.bumpMap,
      bumpScale: 0.045,
      metalness: 0.25,
      roughness: 0.32,
      transparent: true,
      opacity: startAsSilver ? 0.0 : 1.0,
      depthWrite: false,
    });
    const bronzeFaceMesh = new THREE.Mesh(faceGeo, bronzeFaceMat);
    bronzeFaceMesh.position.z = 0.14;
    shieldGroup.add(bronzeFaceMesh);

    // Silver Front Face
    const silverFaceMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      map: silverTextures.colorMap,
      bumpMap: silverTextures.bumpMap,
      bumpScale: 0.045,
      metalness: 0.85,
      roughness: 0.18,
      transparent: true,
      opacity: startAsSilver ? 1.0 : 0.0,
      depthWrite: false,
    });
    const silverFaceMesh = new THREE.Mesh(faceGeo, silverFaceMat);
    silverFaceMesh.position.z = 0.141;
    shieldGroup.add(silverFaceMesh);

    // 5. Back Shield Face
    const backMesh = new THREE.Mesh(faceGeo, backMat);
    backMesh.position.z = -0.14;
    shieldGroup.add(backMesh);

    // 6. Glistening Corner Rivets
    const rivetGeo = new THREE.SphereGeometry(0.065, 14, 14);
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const rx = Math.cos(angle) * 2.36;
      const ry = Math.sin(angle) * 2.36;

      const rivetFront = new THREE.Mesh(rivetGeo, rivetMat);
      rivetFront.position.set(rx, ry, 0.16);
      shieldGroup.add(rivetFront);
    }

    // -------------------------------------------------------------------------
    // FLOATING GOLD PARTICLES (Overview mode only)
    // -------------------------------------------------------------------------
    const particleColors = [
      new THREE.Color(0xFFD700), // Gold
      new THREE.Color(0xF3E5AB), // Champagne
      new THREE.Color(0xCBD5E1), // Silver
      new THREE.Color(0x4285F4), // Google Blue
      new THREE.Color(0xEA4335), // Google Red
      new THREE.Color(0xFBBC04), // Google Yellow
      new THREE.Color(0x34A853), // Google Green
    ];

    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColorArray = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const rad = 2.8 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[p * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePositions[p * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePositions[p * 3 + 2] = rad * Math.cos(phi) * 0.8;

      const color = particleColors[p % particleColors.length];
      particleColorArray[p * 3] = color.r;
      particleColorArray[p * 3 + 1] = color.g;
      particleColorArray[p * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    if (!isIntro) {
      scene.add(particles);
    }

    // -------------------------------------------------------------------------
    // CINEMATIC LIGHTING
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xFFFBF5, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 3.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xE2E8F0, 2.2);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4285F4, 1.2);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    const sweepLight = new THREE.PointLight(0xFFFFFF, 3.2, 9);
    sweepLight.position.set(-3.5, 1.2, 2.4);
    scene.add(sweepLight);

    // -------------------------------------------------------------------------
    // ENTRANCE & TRANSFORMATION ANIMATION TIMELINE
    // -------------------------------------------------------------------------
    let isVisible = true;
    let animId: number;
    let startTime = 0;
    const entranceDuration = isIntro ? 1.6 : 1.0;
    const transformStartTime = 3.2; // Starts at 3.2s
    const transformDuration = 1.8;  // Finishes at 5.0s

    let hasTriggeredTransformStart = false;
    let hasTriggeredTransformComplete = false;
    let hasFlippedHtmlTier = false;

    if (!isReduced) {
      shieldGroup.scale.set(0.60, 0.60, 0.60);
      shieldGroup.position.y = -0.30;
      shieldGroup.rotation.y = -0.45;
      shieldGroup.rotation.x = 0.14;
    }

    renderer.render(scene, camera);

    let cachedRect: DOMRect | null = null;
    const updateRect = () => {
      if (container) cachedRect = container.getBoundingClientRect();
    };
    updateRect();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: rw, height: rh } = entry.contentRect;
        if (rw > 0 && rh > 0) {
          updateRect();
          adjustCamera(rw, rh);
        }
      }
    });
    resizeObserver.observe(container);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isIntro) isVisible = entry.isIntersecting;
        if (entry.isIntersecting) updateRect();
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (!isIntro && typeof document !== 'undefined' && document.querySelector('.bmi-overlay:not(.bmi-exiting)')) {
        return;
      }

      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;

      // 1. Entrance Stage: 0.0s -> 1.5s
      if (elapsed < entranceDuration && !isReduced) {
        const p = Math.min(elapsed / entranceDuration, 1);
        const easeOut = 1 - Math.pow(1 - p, 3);

        const currentScale = 0.60 + 0.40 * easeOut;
        shieldGroup.scale.set(currentScale, currentScale, currentScale);
        shieldGroup.position.y = -0.30 * (1 - easeOut);
        shieldGroup.rotation.y = -0.45 * (1 - easeOut);
        shieldGroup.rotation.x = 0.14 * (1 - easeOut);

        sweepLight.position.x = -4.5 + 9.0 * easeOut;
        sweepLight.intensity = 1.0 + 3.0 * Math.sin(p * Math.PI);
      } else {
        shieldGroup.scale.set(1.0, 1.0, 1.0);

        // 2. Automated Intro Transformation Timeline (isIntro Mode)
        let spinAngle = 0;
        if (isIntro && !isReduced) {
          if (elapsed >= transformStartTime && elapsed < (transformStartTime + transformDuration)) {
            const t = (elapsed - transformStartTime) / transformDuration;
            const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            currentMorphProgress = ease;

            // Trigger gold confetti burst
            if (t >= 0.08 && !hasTriggeredTransformStart) {
              hasTriggeredTransformStart = true;
              onTransformStartRef.current?.();
            }

            // Flip HTML Typography & Pill at mid-point
            if (t >= 0.45 && !hasFlippedHtmlTier) {
              hasFlippedHtmlTier = true;
              setActiveTier('silver');
            }

            // Elegant 360-degree majestic spin
            spinAngle = ease * Math.PI * 2;

            // High-specular light gleam flaring across the medal as it turns
            sweepLight.position.x = -4.5 + 9.0 * ease;
            sweepLight.intensity = 2.0 + 5.5 * Math.sin(t * Math.PI);
          } else if (elapsed >= (transformStartTime + transformDuration)) {
            currentMorphProgress = 1.0;
            if (!hasTriggeredTransformComplete) {
              hasTriggeredTransformComplete = true;
              onTransformCompleteRef.current?.();
            }
          }
        } else if (!isIntro) {
          // Manual toggle morph on Overview page
          const targetP = targetTierRef.current === 'silver' ? 1.0 : 0.0;
          if (Math.abs(currentMorphProgress - targetP) > 0.01) {
            currentMorphProgress += (targetP - currentMorphProgress) * 0.08;
            spinAngle = (1 - currentMorphProgress) * Math.PI * 0.35;
          } else {
            currentMorphProgress = targetP;
            setIsTransforming(false);
            setActiveTier(targetTierRef.current);
          }
        }

        // Apply Material Lerp (Bronze <-> Silver)
        baseMat.color.lerpColors(cBronzeBase, cSilverBase, currentMorphProgress);
        frameMat.color.lerpColors(cBronzeFrame, cSilverFrame, currentMorphProgress);
        ridgeMat.color.lerpColors(cBronzeRidge, cSilverRidge, currentMorphProgress);
        backMat.color.lerpColors(cBronzeBack, cSilverBack, currentMorphProgress);
        rivetMat.color.lerpColors(cBronzeRivet, cSilverRivet, currentMorphProgress);

        baseMat.metalness = THREE.MathUtils.lerp(0.35, 0.85, currentMorphProgress);
        baseMat.roughness = THREE.MathUtils.lerp(0.35, 0.22, currentMorphProgress);
        frameMat.metalness = THREE.MathUtils.lerp(0.38, 0.90, currentMorphProgress);
        frameMat.roughness = THREE.MathUtils.lerp(0.28, 0.16, currentMorphProgress);
        ridgeMat.metalness = THREE.MathUtils.lerp(0.40, 0.95, currentMorphProgress);
        ridgeMat.roughness = THREE.MathUtils.lerp(0.20, 0.10, currentMorphProgress);

        // Cross-fade Face Textures
        bronzeFaceMat.opacity = Math.max(0, 1 - currentMorphProgress);
        silverFaceMat.opacity = Math.min(1, currentMorphProgress);

        // Interactive 3D Perspective Tilt & Gentle Idle Bobbing
        if (!isReduced) {
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

          const idleBob = Math.sin(elapsed * 0.8) * 0.045;
          const idleYaw = Math.sin(elapsed * 0.45) * 0.075;
          const idlePitch = Math.cos(elapsed * 0.6) * 0.035;

          shieldGroup.position.y = idleBob;
          shieldGroup.rotation.y = idleYaw + spinAngle + mouseRef.current.x * 0.35;
          shieldGroup.rotation.x = idlePitch - mouseRef.current.y * 0.25;

          if (elapsed > (transformStartTime + transformDuration)) {
            const sweepCycle = (elapsed % 5.5) / 5.5;
            if (sweepCycle < 0.26) {
              const norm = sweepCycle / 0.26;
              sweepLight.position.x = -4.0 + 8.0 * norm;
              sweepLight.intensity = 3.2 * Math.sin(norm * Math.PI);
            } else {
              sweepLight.intensity = 1.0;
            }
          }
        }
      }

      if (!isIntro) {
        particles.rotation.y = elapsed * 0.04;
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Pointer event listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) updateRect();
      const rect = cachedRect!;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (!cachedRect) updateRect();
        const touch = e.touches[0];
        const rect = cachedRect!;
        const nx = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;
        mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
        mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', updateRect);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', updateRect, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!container) return;
      updateRect();
      adjustCamera(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRect);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', updateRect);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', updateRect);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);

      // Disposal
      baseGeo.dispose();
      frameGeo.dispose();
      ridgeGeo.dispose();
      faceGeo.dispose();
      rivetGeo.dispose();
      particleGeometry.dispose();

      baseMat.dispose();
      frameMat.dispose();
      ridgeMat.dispose();
      backMat.dispose();
      rivetMat.dispose();
      bronzeFaceMat.dispose();
      silverFaceMat.dispose();
      particleMaterial.dispose();

      bronzeTextures.colorMap?.dispose();
      bronzeTextures.bumpMap?.dispose();
      silverTextures.colorMap?.dispose();
      silverTextures.bumpMap?.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, isIntro, initialTier]);

  // Count-up animation for student target count
  useEffect(() => {
    let countAnimId: number;
    const target = currentData.studentTarget;
    const startTime = performance.now();
    const duration = isIntro ? 2200 : 1200;

    const countTick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayCount(Math.round(target * ease));
      if (p < 1) {
        countAnimId = requestAnimationFrame(countTick);
      }
    };
    countAnimId = requestAnimationFrame(countTick);
    return () => cancelAnimationFrame(countAnimId);
  }, [currentData.studentTarget, isIntro, activeTier]);

  return (
    <section
      id={id}
      className={`bme-section ${className}`}
      aria-label="Official GDG NECN Chapter Milestone Achievement Announcement"
    >
      {/* Dynamic Ambient Radial Glow (Warm bronze transitioning to golden-silver) */}
      <div
        className={`bme-bg-radial ${activeTier === 'silver' ? 'bme-bg-radial-silver' : ''}`}
        aria-hidden="true"
      />

      <div className="bme-container">
        
        {/* Tier switcher tabs when viewing embedded on Overview Page */}
        {!isIntro && (
          <div className="bme-tier-tabs mb-3" role="tablist" aria-label="Milestone Tiers">
            <button
              onClick={() => handleSelectTier('bronze')}
              className={`bme-tier-tab ${activeTier === 'bronze' ? 'bme-tier-tab-active-bronze' : ''}`}
              role="tab"
              aria-selected={activeTier === 'bronze'}
            >
              <span>✓ Bronze Tier</span>
            </button>
            <button
              onClick={() => handleSelectTier('silver')}
              className={`bme-tier-tab ${activeTier === 'silver' ? 'bme-tier-tab-active-silver' : ''}`}
              role="tab"
              aria-selected={activeTier === 'silver'}
            >
              <span className="text-amber-500">★</span>
              <span>Silver Tier (Current)</span>
            </button>
          </div>
        )}

        {/* ACHIEVEMENT UNLOCKED! Celebration Badge */}
        <div
          className={`bme-unlocked-pill ${activeTier === 'silver' ? 'bme-unlocked-pill-silver' : ''}`}
          aria-label={activeTier === 'silver' ? 'Silver Milestone Achieved' : 'Achievement Unlocked'}
        >
          <span className="bme-sparkle" aria-hidden="true">✦</span>
          <span>{activeTier === 'silver' ? 'SILVER MILESTONE ACHIEVED' : 'ACHIEVEMENT UNLOCKED!'}</span>
        </div>

        {/* Bold Italic Achievement Heading */}
        <h2 className={`bme-heading ${activeTier === 'silver' ? 'bme-silver-heading' : ''}`}>
          {currentData.milestoneTitle}
        </h2>

        {/* Subheading */}
        <p className="bme-subheading">
          Official Google Cloud Learn with Communities 2026 Chapter Milestone
        </p>

        {/* Central 3D Hexagonal Shield (Zero-Cropping Responsive) */}
        <div className="bme-stage-wrapper">
          {webglSupported ? (
            <div
              ref={mountRef}
              className="w-full h-full flex items-center justify-center select-none"
              title={activeTier === 'silver' ? '3D Silver Shield' : '3D Bronze Shield'}
            />
          ) : (
            <div className={`bme-fallback-shield ${activeTier === 'silver' ? 'bme-fallback-shield-silver' : ''}`}>
              <div className="text-[11px] font-bold tracking-widest text-slate-200 uppercase mb-2">
                GDG ON CAMPUS NECN
              </div>
              <div className="text-3xl font-black italic tracking-wider text-white">
                {activeTier === 'silver' ? 'SILVER' : 'BRONZE'}
              </div>
              <div className="text-xs font-bold tracking-widest text-slate-100 uppercase mt-1">
                MILESTONE ACHIEVED
              </div>
            </div>
          )}
        </div>

        {/* Rounded White Statistics Container */}
        <div className={`bme-stat-card ${activeTier === 'silver' ? 'bme-stat-card-silver' : ''}`}>
          <div className="bme-stat-metric-row">
            <div className="bme-stat-icon-wrap" aria-hidden="true">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#4285F4" />
                <circle cx="9" cy="7" r="4" stroke="#EA4335" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#FBBC04" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#34A853" />
              </svg>
            </div>

            {/* Target Count */}
            <div className="flex items-baseline gap-1.5">
              <span className="bme-stat-number">{displayCount}+</span>
              <span className={`bme-stat-students-label ${activeTier === 'silver' ? 'text-slate-800' : ''}`}>
                STUDENTS
              </span>
            </div>
          </div>

          {/* Badge completion descriptor */}
          <div className="bme-stat-badge-desc">
            <span className="bme-check-circle" aria-hidden="true">✓</span>
            <span>COMPLETED {currentData.badgeThreshold}+ BADGES!</span>
          </div>

          {/* Real-time cohort milestone achievement confirmation */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Verified Achievers: <strong className="text-slate-800">{currentData.actualStudentsCompleted5Plus} Students</strong></span>
            <span className="text-[#34A853] font-bold">
              {Math.round((currentData.actualStudentsCompleted5Plus / currentData.studentTarget) * 100)}% of Target Achieved ✓
            </span>
          </div>
        </div>

        {/* Tagline: Together, we Learn. We Build. We Grow. */}
        <div className="bme-tagline">
          <span className="bme-tagline-prefix">{currentData.tagline.prefix}</span>
          <span className="bme-tagline-learn">{currentData.tagline.learn}</span>
          <span className="bme-tagline-build">We {currentData.tagline.build}</span>
          <span className="bme-tagline-grow">We {currentData.tagline.grow}</span>
        </div>

      </div>
    </section>
  );
};

export default BronzeMilestoneExperience;
