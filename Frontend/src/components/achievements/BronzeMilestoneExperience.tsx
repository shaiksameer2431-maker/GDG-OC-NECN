import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { COMMUNITY_BRONZE_MILESTONE } from '../../config/communityTiers';
import './BronzeMilestoneExperience.css';

interface BronzeMilestoneExperienceProps {
  onExploreLeaderboard?: () => void;
  className?: string;
  id?: string;
  isIntro?: boolean;
}

export const BronzeMilestoneExperience: React.FC<BronzeMilestoneExperienceProps> = ({
  className = '',
  id = 'bronze-milestone-experience',
  isIntro = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [confettiFired, setConfettiFired] = useState<boolean>(false);

  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const {
    milestoneTitle,
    studentTarget,
    badgeThreshold,
    actualStudentsCompleted5Plus,
    tagline,
  } = useMemo(() => COMMUNITY_BRONZE_MILESTONE, []);

  // WebGL Feature Detection
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Three.js Scene Setup & Animation Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial Dimensions
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 460;

    // Scene & Perspective Camera with adaptive field-of-view for zero cropping on mobile
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

    // Adaptive Camera Sizing: Calculates required distance based on aspect ratio
    // Guarantees the shield is never cropped on narrow mobile viewports
    const adjustCamera = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;
      const aspect = w / h;
      camera.aspect = aspect;
      const halfFovRad = (camera.fov * Math.PI) / 360;
      const minVisibleWidth = 5.8;
      const requiredZ = minVisibleWidth / (2 * Math.tan(halfFovRad) * aspect);
      camera.position.z = Math.max(9.6, requiredZ);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    adjustCamera(width, height);

    // -------------------------------------------------------------------------
    // PROCEDURAL TEXTURE GENERATION FOR THE HEXAGONAL SHIELD FACE
    // -------------------------------------------------------------------------
    const createShieldTextures = () => {
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

      // Draw Hexagonal Clipping Path (Apex at top and bottom to match 3D geometry)
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

      // Base Canvas Fills (Soft satin warm copper-bronze from reference palette)
      ctx.fillStyle = '#8E523A';
      ctx.fillRect(0, 0, 1024, 1024);
      bCtx.fillStyle = '#404040';
      bCtx.fillRect(0, 0, 1024, 1024);

      // Clip inside the shield hexagon
      ctx.save();
      drawHexPath(ctx, hexRadius);
      ctx.clip();

      // Satin Warm Copper-Bronze Radial Gradient Base (matching exact uploaded palette)
      const grad = ctx.createRadialGradient(cx, cy - 50, 30, cx, cy, hexRadius);
      grad.addColorStop(0, '#FFF2E6');
      grad.addColorStop(0.18, '#EEC39C');
      grad.addColorStop(0.48, '#CC9873');
      grad.addColorStop(0.78, '#B17656');
      grad.addColorStop(1, '#8E523A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Top Header: "GDG ON CAMPUS" (High-contrast, crystal-clear white with deep bevel shadow)
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

      // Top Sub-header Pill: "NECN" (Deep contrast satin pill with gold border)
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

      // -----------------------------------------------------------------------
      // MULTICOLOR GDG BRACKETS LOGO: { < / > }
      // Google Blue, Red, Yellow, Green
      // -----------------------------------------------------------------------
      const logoY = cy - 35;

      ctx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Left Bracket '{' in Google Blue
      ctx.fillStyle = '#4285F4';
      ctx.shadowColor = 'rgba(66, 133, 244, 0.45)';
      ctx.shadowBlur = 12;
      ctx.fillText('{', cx - 140, logoY);

      // Angle '<' in Google Red
      ctx.fillStyle = '#EA4335';
      ctx.shadowColor = 'rgba(234, 67, 53, 0.45)';
      ctx.shadowBlur = 12;
      ctx.fillText('<', cx - 55, logoY);

      // Angle '>' in Google Yellow
      ctx.fillStyle = '#FBBC04';
      ctx.shadowColor = 'rgba(251, 188, 4, 0.45)';
      ctx.shadowBlur = 12;
      ctx.fillText('>', cx + 55, logoY);

      // Right Bracket '}' in Google Green
      ctx.fillStyle = '#34A853';
      ctx.shadowColor = 'rgba(52, 168, 83, 0.45)';
      ctx.shadowBlur = 12;
      ctx.fillText('}', cx + 140, logoY);
      ctx.shadowBlur = 0;

      bCtx.font = '900 120px "Plus Jakarta Sans", "Montserrat", sans-serif';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.fillStyle = '#FFFFFF';
      bCtx.fillText('{ < > }', cx, logoY);

      // -----------------------------------------------------------------------
      // ENGRAVED BRONZE TEXT: "BRONZE" & "MILESTONE ACHIEVED"
      // Ultra-crisp typography with high-contrast bevel and distinct backdrop
      // -----------------------------------------------------------------------
      ctx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
      ctx.letterSpacing = '6px';

      // Deep drop shadow for maximum 3D punch
      ctx.shadowColor = 'rgba(35, 12, 4, 0.95)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#2A0E05';
      ctx.fillText('BRONZE', cx, cy + 124);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Radiant metallic gradient fill
      const bronzeGrad = ctx.createLinearGradient(cx - 190, cy + 90, cx + 190, cy + 135);
      bronzeGrad.addColorStop(0, '#FFFFFF');
      bronzeGrad.addColorStop(0.25, '#FFF0E0');
      bronzeGrad.addColorStop(0.55, '#EEC39C');
      bronzeGrad.addColorStop(0.85, '#CC9873');
      bronzeGrad.addColorStop(1, '#8E523A');
      ctx.fillStyle = bronzeGrad;
      ctx.fillText('BRONZE', cx, cy + 120);

      // Crisp outer contour stroke
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.0;
      ctx.strokeText('BRONZE', cx, cy + 120);

      bCtx.font = '900 italic 96px "Plus Jakarta Sans", "Impact", sans-serif';
      bCtx.letterSpacing = '6px';
      bCtx.fillStyle = '#FFFFFF';
      bCtx.fillText('BRONZE', cx, cy + 120);

      // -----------------------------------------------------------------------
      // MILESTONE ACHIEVED: Crystal-clear high-contrast ribbon pill
      // Guarantees 100% legibility under all 3D lighting angles
      // -----------------------------------------------------------------------
      const ribW = 460;
      const ribH = 50;
      const ribX = cx - ribW / 2;
      const ribY = cy + 175;

      // Dark satin bronze backing plate
      ctx.fillStyle = 'rgba(50, 20, 8, 0.85)';
      ctx.strokeStyle = '#EEC39C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ribX, ribY, ribW, ribH, 25);
      ctx.fill();
      ctx.stroke();

      // Sharp, glowing, crystal-clear text: "★ MILESTONE ACHIEVED ★"
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

      const colorTexture = new THREE.CanvasTexture(cCanvas);
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      const bumpTexture = new THREE.CanvasTexture(bCanvas);

      return { colorMap: colorTexture, bumpMap: bumpTexture };
    };

    const textures = createShieldTextures();

    // -------------------------------------------------------------------------
    // 3D MULTI-LAYER HEXAGONAL SHIELD MESH
    // -------------------------------------------------------------------------
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Satin Warm Copper-Bronze Materials (exact match to user's uploaded reference image)
    const baseBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xB17656,
      metalness: 0.32,
      roughness: 0.38,
    });

    const polishedBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xCC9873,
      metalness: 0.35,
      roughness: 0.28,
    });

    const highlightGoldMat = new THREE.MeshStandardMaterial({
      color: 0xEEC39C,
      metalness: 0.38,
      roughness: 0.20,
    });

    // 1. Foundation Hexagon Plate (Layer 1)
    const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.24, 6);
    baseGeo.rotateX(Math.PI / 2);
    const baseMesh = new THREE.Mesh(baseGeo, baseBronzeMat);
    shieldGroup.add(baseMesh);

    // 2. Bevelled Outer Hexagonal Frame (Layer 2)
    const frameGeo = new THREE.CylinderGeometry(2.38, 2.38, 0.28, 6);
    frameGeo.rotateX(Math.PI / 2);
    const frameMesh = new THREE.Mesh(frameGeo, polishedBronzeMat);
    shieldGroup.add(frameMesh);

    // 3. Highlight Bevel Ridge (Layer 3)
    const ridgeGeo = new THREE.CylinderGeometry(2.26, 2.26, 0.3, 6);
    ridgeGeo.rotateX(Math.PI / 2);
    const ridgeMesh = new THREE.Mesh(ridgeGeo, highlightGoldMat);
    shieldGroup.add(ridgeMesh);

    // 4. Front Shield Face with High-Res Texture (Layer 4)
    const faceRadius = 2.14;
    const faceGeo = new THREE.CylinderGeometry(faceRadius, faceRadius, 0.05, 6);
    faceGeo.rotateX(Math.PI / 2);

    // Direct Planar UV Mapping: Maps 3D X/Y coordinates directly onto 2D U/V space
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

    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      map: textures.colorMap,
      bumpMap: textures.bumpMap,
      bumpScale: 0.045,
      metalness: 0.22,
      roughness: 0.32,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 0.14;
    shieldGroup.add(faceMesh);

    // 5. Back Shield Face
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x8E523A,
      metalness: 0.32,
      roughness: 0.40,
    });
    const backMesh = new THREE.Mesh(faceGeo, backMat);
    backMesh.position.z = -0.14;
    shieldGroup.add(backMesh);

    // 6. Glistening Corner Rivets (Single clean front rivet at each of the 6 hexagonal corners)
    const rivetGeo = new THREE.SphereGeometry(0.065, 14, 14);
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const rx = Math.cos(angle) * 2.36;
      const ry = Math.sin(angle) * 2.36;

      const rivetFront = new THREE.Mesh(rivetGeo, highlightGoldMat);
      rivetFront.position.set(rx, ry, 0.16);
      shieldGroup.add(rivetFront);
    }

    // -------------------------------------------------------------------------
    // FLOATING PARTICLES & GOOGLE CONFETTI DUST
    // -------------------------------------------------------------------------
    const particleColors = [
      new THREE.Color(0x4285F4), // Google Blue
      new THREE.Color(0xEA4335), // Google Red
      new THREE.Color(0xFBBC04), // Google Yellow
      new THREE.Color(0x34A853), // Google Green
      new THREE.Color(0xB87345), // Bronze Accent
      new THREE.Color(0xDF9B6E), // Bronze Highlight
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
    scene.add(particles);

    // -------------------------------------------------------------------------
    // CINEMATIC LIGHTING (Radiant golden-copper illumination)
    // -------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xFFF6ED, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF9F0, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xF0A973, 2.0);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4285F4, 1.0);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    const sweepLight = new THREE.PointLight(0xFFFFFF, 3.2, 9);
    sweepLight.position.set(-3.5, 1.2, 2.4);
    scene.add(sweepLight);

    // -------------------------------------------------------------------------
    // ENTRANCE & SMOOTH IDLE ANIMATION LOOP (Zero Cropping, 60fps Architecture)
    // -------------------------------------------------------------------------
    let isVisible = true;
    let animId: number;
    let startTime = 0;
    const entranceDuration = isIntro ? 5.5 : 1.4;

    if (!isReduced) {
      shieldGroup.scale.set(0.001, 0.001, 0.001);
      shieldGroup.position.y = -1.4;
      shieldGroup.rotation.y = -Math.PI * 0.45;
      shieldGroup.rotation.x = 0.22;
    }

    // Cached container bounding rect to eliminate browser layout thrashing on move
    let cachedRect: DOMRect | null = null;
    const updateRect = () => {
      if (container) {
        cachedRect = container.getBoundingClientRect();
      }
    };
    updateRect();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateRect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      // Senior Architect GPU Optimization:
      // If this instance is on the Overview page and the full-screen intro is active,
      // pause rendering to grant 100% GPU bandwidth to the intro!
      if (!isIntro && typeof document !== 'undefined' && document.querySelector('.bmi-overlay:not(.bmi-exiting)')) {
        return;
      }

      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000;

      // 1. Entrance Stage: Ultra-smooth quintic ease-out scale, elevation, and gentle tilt-to-upright
      if (elapsed < entranceDuration && !isReduced) {
        const p = Math.min(elapsed / entranceDuration, 1);
        const easeOut = 1 - Math.pow(1 - p, 4);

        const currentScale = 0.001 + 0.999 * easeOut;
        shieldGroup.scale.set(currentScale, currentScale, currentScale);
        shieldGroup.position.y = -1.4 * (1 - easeOut);
        shieldGroup.rotation.y = -Math.PI * 0.45 * (1 - easeOut);
        shieldGroup.rotation.x = 0.22 * (1 - easeOut);

        // Radiant light sweep travelling across the face as it settles into place
        if (p > 0.35) {
          const sweepP = (p - 0.35) / 0.65;
          sweepLight.position.x = -4.5 + 9.0 * sweepP;
          sweepLight.intensity = 3.6 * Math.sin(sweepP * Math.PI);
        } else {
          sweepLight.intensity = 0.6;
        }
      } else {
        // 2. Idle State: Smooth, gentle float and interactive 3D perspective
        if (!isReduced) {
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

          const idleBob = Math.sin(elapsed * 0.8) * 0.045;
          const idleYaw = Math.sin(elapsed * 0.45) * 0.075;
          const idlePitch = Math.cos(elapsed * 0.6) * 0.035;

          shieldGroup.position.y = idleBob;
          shieldGroup.rotation.y = idleYaw + mouseRef.current.x * 0.35;
          shieldGroup.rotation.x = idlePitch - mouseRef.current.y * 0.25;

          // Periodic light sweep every ~5.5 seconds
          const sweepCycle = (elapsed % 5.5) / 5.5;
          if (sweepCycle < 0.26) {
            const norm = sweepCycle / 0.26;
            sweepLight.position.x = -4.0 + 8.0 * norm;
            sweepLight.intensity = 3.2 * Math.sin(norm * Math.PI);
          } else {
            sweepLight.intensity = 0.8;
          }
        }
      }

      // Rotate particle dust
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Desktop Mouse & Mobile Touch 3D Tilt Handlers with cached rect
    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) updateRect();
      const rect = cachedRect!;
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseEnter = () => {
      updateRect();
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const handleTouchStart = () => {
      updateRect();
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
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    const handleResize = () => {
      if (!container) return;
      updateRect();
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      adjustCamera(newW, newH);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateRect, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRect);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
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

      baseBronzeMat.dispose();
      polishedBronzeMat.dispose();
      highlightGoldMat.dispose();
      faceMat.dispose();
      backMat.dispose();
      particleMaterial.dispose();

      if (textures.colorMap) textures.colorMap.dispose();
      if (textures.bumpMap) textures.bumpMap.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, isIntro]);

  // Smooth Count-Up Animation for 50+ Students
  useEffect(() => {
    let countAnimId: number;
    const target = studentTarget; // 50
    const startTime = performance.now();
    const duration = isIntro ? 3200 : 1600;

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
  }, [studentTarget, isIntro]);

  return (
    <section
      id={id}
      className={`bme-section ${className}`}
      aria-label="Official GDG NECN Bronze Milestone Achievement Announcement"
    >
      {/* Background Radial Glow */}
      <div className="bme-bg-radial" aria-hidden="true" />

      <div className="bme-container">
        
        {/* ACHIEVEMENT UNLOCKED! Celebration Badge */}
        <div className="bme-unlocked-pill" aria-label="Achievement Unlocked">
          <span className="bme-sparkle" aria-hidden="true">✦</span>
          <span>ACHIEVEMENT UNLOCKED!</span>
        </div>

        {/* Bold Italic Achievement Heading */}
        <h2 className="bme-heading">
          {milestoneTitle}
        </h2>

        {/* Subheading */}
        <p className="bme-subheading">
          Official Google Cloud Learn with Communities 2026 Chapter Milestone
        </p>

        {/* Central 3D Hexagonal Bronze Shield (Mobile & Desktop Zero-Cropping Responsive) */}
        <div className="bme-stage-wrapper">
          {webglSupported ? (
            <div
              ref={mountRef}
              className="w-full h-full flex items-center justify-center select-none"
              title="3D Bronze Shield"
            />
          ) : (
            /* Fallback 3D CSS Hexagon */
            <div className="bme-fallback-shield">
              <div className="text-[11px] font-bold tracking-widest text-amber-200 uppercase mb-2">
                GDG ON CAMPUS NECN
              </div>
              <div className="text-3xl font-black italic tracking-wider text-white">
                BRONZE
              </div>
              <div className="text-xs font-bold tracking-widest text-amber-100 uppercase mt-1">
                MILESTONE ACHIEVED
              </div>
            </div>
          )}
        </div>

        {/* Rounded White Statistics Container */}
        <div className="bme-stat-card">
          <div className="bme-stat-metric-row">
            {/* Multicolor Group Icon */}
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

            {/* 50+ STUDENTS */}
            <div className="flex items-baseline gap-1.5">
              <span className="bme-stat-number">{displayCount}+</span>
              <span className="bme-stat-students-label">STUDENTS</span>
            </div>
          </div>

          {/* COMPLETED 5 BADGES! with Green Checkmark */}
          <div className="bme-stat-badge-desc">
            <span className="bme-check-circle" aria-hidden="true">✓</span>
            <span>COMPLETED {badgeThreshold} BADGES!</span>
          </div>

          {/* Real-time cohort milestone achievement confirmation */}
          <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Verified Achievers: <strong className="text-slate-800">{actualStudentsCompleted5Plus} Students</strong></span>
            <span className="text-[#34A853] font-bold">138% of Target Achieved ✓</span>
          </div>
        </div>

        {/* Tagline: Together, we Learn. We Build. We Grow. */}
        <div className="bme-tagline">
          <span className="bme-tagline-prefix">{tagline.prefix}</span>
          <span className="bme-tagline-learn">{tagline.learn}</span>
          <span className="bme-tagline-build">We {tagline.build}</span>
          <span className="bme-tagline-grow">We {tagline.grow}</span>
        </div>

      </div>
    </section>
  );
};

export default BronzeMilestoneExperience;
