import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { COMMUNITY_BRONZE_TIER } from '../../config/communityTiers';
import './BronzeAchievement3D.css';

interface BronzeAchievement3DProps {
  onExploreLeaderboard?: () => void;
  className?: string;
}

export const BronzeAchievement3D: React.FC<BronzeAchievement3DProps> = ({
  onExploreLeaderboard,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [animationPhase, setAnimationPhase] = useState<'entering' | 'revealed'>('entering');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse tilt tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  // Authoritative cohort statistics for Bronze Status
  const {
    title,
    subtitle,
    organization,
    program,
    description,
    achievedMilestones,
    achievedBadges,
    activeChampions,
  } = useMemo(() => COMMUNITY_BRONZE_TIER, []);

  // WebGL Feature Detection
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Three.js Scene Setup & Animation Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL init failed, switching to fallback', err);
      setWebglSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.className = 'bronze-canvas-element';

    // -------------------------------------------------------------------------
    // PROCEDURAL TEXTURE GENERATION (High-Res 1024x1024 Embossed Medallion Face)
    // -------------------------------------------------------------------------
    const createMedalTextures = () => {
      // 1. Color / Diffuse Map
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 1024;
      cCanvas.height = 1024;
      const ctx = cCanvas.getContext('2d');

      // 2. Bump / Relief Map
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 1024;
      bCanvas.height = 1024;
      const bCtx = bCanvas.getContext('2d');

      if (!ctx || !bCtx) return { colorMap: null, bumpMap: null };

      const cx = 512;
      const cy = 512;

      // Base Background (Color)
      const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 480);
      grad.addColorStop(0, '#5A3822');
      grad.addColorStop(0.45, '#3B2418');
      grad.addColorStop(0.85, '#2A180E');
      grad.addColorStop(1, '#1E120A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Base Bump (Neutral 50% Gray)
      bCtx.fillStyle = '#404040';
      bCtx.fillRect(0, 0, 1024, 1024);

      // Fine concentric radial brushed metal rings
      for (let r = 160; r < 460; r += 14) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = r % 28 === 0 ? 'rgba(230, 178, 122, 0.12)' : 'rgba(168, 104, 58, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Decorative Outer Dotted Beaded Ring
      const dots = 48;
      for (let i = 0; i < dots; i++) {
        const angle = (i / dots) * Math.PI * 2;
        const dx = cx + Math.cos(angle) * 440;
        const dy = cy + Math.sin(angle) * 440;

        // Color bead
        ctx.beginPath();
        ctx.arc(dx, dy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#E6B27A';
        ctx.shadowColor = '#C47A45';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bump bead (raised white)
        bCtx.beginPath();
        bCtx.arc(dx, dy, 7, 0, Math.PI * 2);
        bCtx.fillStyle = '#FFFFFF';
        bCtx.fill();
      }

      // Circular Engraved Text (Top: GDG ON CAMPUS NECN, Bottom: GOOGLE CLOUD 2026)
      const drawCircularText = (
        text: string,
        radius: number,
        startAngle: number,
        endAngle: number,
        isTop: boolean
      ) => {
        const totalAngle = endAngle - startAngle;
        const step = totalAngle / (text.length - 1);

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const angle = startAngle + step * i;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          // Color text
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle + (isTop ? Math.PI / 2 : -Math.PI / 2));
          ctx.font = 'bold 28px "Cinzel", "Times New Roman", Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#E6B27A';
          ctx.shadowColor = '#17120F';
          ctx.shadowBlur = 5;
          ctx.fillText(char, 0, 0);
          ctx.restore();

          // Bump text
          bCtx.save();
          bCtx.translate(x, y);
          bCtx.rotate(angle + (isTop ? Math.PI / 2 : -Math.PI / 2));
          bCtx.font = 'bold 28px "Cinzel", "Times New Roman", Georgia, serif';
          bCtx.textAlign = 'center';
          bCtx.textBaseline = 'middle';
          bCtx.fillStyle = '#F5D3B3';
          bCtx.fillText(char, 0, 0);
          bCtx.restore();
        }
      };

      drawCircularText('★  GDG  ON  CAMPUS  NECN  ★', 380, -Math.PI * 0.78, -Math.PI * 0.22, true);
      drawCircularText('★  GOOGLE  CLOUD  2026  ★', 380, Math.PI * 0.78, Math.PI * 0.22, false);

      // Central Emblem: Stylized Cloud Trophy Crest + Laurel Wreath
      // Draw Laurel Leaves (Left & Right)
      const drawLaurel = (side: 1 | -1) => {
        for (let j = 0; j < 7; j++) {
          const t = j / 6;
          const angle = (side === 1 ? -Math.PI * 0.35 : -Math.PI * 0.65) + side * t * 0.7;
          const r = 270 - Math.sin(t * Math.PI) * 20;
          const lx = cx + Math.cos(angle) * r;
          const ly = cy + Math.sin(angle) * r;

          ctx.save();
          ctx.translate(lx, ly);
          ctx.rotate(angle + (side === 1 ? 0.6 : -0.6));
          ctx.beginPath();
          ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#C47A45';
          ctx.strokeStyle = '#E6B27A';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          bCtx.save();
          bCtx.translate(lx, ly);
          bCtx.rotate(angle + (side === 1 ? 0.6 : -0.6));
          bCtx.beginPath();
          bCtx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
          bCtx.fillStyle = '#C0C0C0';
          bCtx.fill();
          bCtx.restore();
        }
      };
      drawLaurel(1);
      drawLaurel(-1);

      // 5-Pointed Star Crest Above
      const drawStar = (sx: number, sy: number, outerR: number, innerR: number) => {
        ctx.beginPath();
        bCtx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const a = (i * Math.PI) / 5 - Math.PI / 2;
          const px = sx + Math.cos(a) * r;
          const py = sy + Math.sin(a) * r;
          if (i === 0) {
            ctx.moveTo(px, py);
            bCtx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
            bCtx.lineTo(px, py);
          }
        }
        ctx.closePath();
        bCtx.closePath();

        ctx.fillStyle = '#FFE5C8';
        ctx.shadowColor = '#E6B27A';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        bCtx.fillStyle = '#FFFFFF';
        bCtx.fill();
      };
      drawStar(cx, cy - 130, 42, 20);

      // Main Embossed Text: "BRONZE"
      ctx.save();
      ctx.font = '900 108px "Arial Black", "Impact", "Montserrat", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '12px';

      // Drop shadow in metal
      ctx.fillStyle = '#1D120B';
      ctx.fillText('BRONZE', cx + 3, cy + 3);

      // Gradient fill
      const textGrad = ctx.createLinearGradient(cx - 200, cy - 50, cx + 200, cy + 50);
      textGrad.addColorStop(0, '#FFE8D0');
      textGrad.addColorStop(0.35, '#E6B27A');
      textGrad.addColorStop(0.65, '#C47A45');
      textGrad.addColorStop(1, '#A8683A');
      ctx.fillStyle = textGrad;
      ctx.fillText('BRONZE', cx, cy);

      // Highlight bevel stroke
      ctx.strokeStyle = '#FFE8D0';
      ctx.lineWidth = 2.5;
      ctx.strokeText('BRONZE', cx, cy);
      ctx.restore();

      // Bump Text "BRONZE"
      bCtx.save();
      bCtx.font = '900 108px "Arial Black", "Impact", "Montserrat", sans-serif';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.letterSpacing = '12px';
      bCtx.fillStyle = '#FFFFFF';
      bCtx.fillText('BRONZE', cx, cy);
      bCtx.restore();

      // Sub-Text: "STATUS ACHIEVED"
      ctx.save();
      ctx.font = 'bold 30px "Cinzel", "Times New Roman", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '8px';
      ctx.fillStyle = '#E6B27A';
      ctx.fillText('STATUS  ACHIEVED', cx, cy + 90);
      ctx.restore();

      bCtx.save();
      bCtx.font = 'bold 30px "Cinzel", "Times New Roman", Georgia, serif';
      bCtx.textAlign = 'center';
      bCtx.textBaseline = 'middle';
      bCtx.letterSpacing = '8px';
      bCtx.fillStyle = '#E0E0E0';
      bCtx.fillText('STATUS  ACHIEVED', cx, cy + 90);
      bCtx.restore();

      const colorTexture = new THREE.CanvasTexture(cCanvas);
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      const bumpTexture = new THREE.CanvasTexture(bCanvas);

      return { colorMap: colorTexture, bumpMap: bumpTexture };
    };

    const textures = createMedalTextures();

    // -------------------------------------------------------------------------
    // 3D MEDAL MESH ASSEMBLY (Multiple Bevelled Metallic Rings & Depth)
    // -------------------------------------------------------------------------
    const medalRoot = new THREE.Group();
    scene.add(medalRoot);

    // Common bronze materials
    const metallicRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xC47A45,
      metalness: 0.94,
      roughness: 0.24,
    });

    const bevelRingMaterial = new THREE.MeshStandardMaterial({
      color: 0xA8683A,
      metalness: 0.92,
      roughness: 0.32,
    });

    const darkBronzeGrooveMaterial = new THREE.MeshStandardMaterial({
      color: 0x3B2418,
      metalness: 0.85,
      roughness: 0.45,
    });

    const goldHighlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xE6B27A,
      metalness: 0.95,
      roughness: 0.18,
    });

    // 1. Outer Bevelled Rim Cylinder
    const outerRimGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.28, 64);
    outerRimGeo.rotateX(Math.PI / 2);
    const outerRimMesh = new THREE.Mesh(outerRimGeo, metallicRimMaterial);
    medalRoot.add(outerRimMesh);

    // 2. Bevelled Torus Rings (Front & Back Chamsfer)
    const bevelTorusGeo = new THREE.TorusGeometry(2.48, 0.08, 16, 64);
    const frontBevelTorus = new THREE.Mesh(bevelTorusGeo, goldHighlightMaterial);
    frontBevelTorus.position.z = 0.14;
    medalRoot.add(frontBevelTorus);

    const backBevelTorus = new THREE.Mesh(bevelTorusGeo, goldHighlightMaterial);
    backBevelTorus.position.z = -0.14;
    medalRoot.add(backBevelTorus);

    // 3. Middle Recessed Groove Ring
    const grooveGeo = new THREE.CylinderGeometry(2.32, 2.32, 0.22, 64);
    grooveGeo.rotateX(Math.PI / 2);
    const grooveMesh = new THREE.Mesh(grooveGeo, darkBronzeGrooveMaterial);
    medalRoot.add(grooveMesh);

    // 4. Inner Stepped Ring
    const innerRimGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.26, 64);
    innerRimGeo.rotateX(Math.PI / 2);
    const innerRimMesh = new THREE.Mesh(innerRimGeo, bevelRingMaterial);
    medalRoot.add(innerRimMesh);

    // 5. Perimeter Metallic Rivets (24 Spheres along the outer edge)
    const rivetGeo = new THREE.SphereGeometry(0.048, 14, 14);
    const rivetCount = 24;
    for (let r = 0; r < rivetCount; r++) {
      const theta = (r / rivetCount) * Math.PI * 2;
      const rx = Math.cos(theta) * 2.38;
      const ry = Math.sin(theta) * 2.38;

      const rivetMeshFront = new THREE.Mesh(rivetGeo, goldHighlightMaterial);
      rivetMeshFront.position.set(rx, ry, 0.145);
      medalRoot.add(rivetMeshFront);

      const rivetMeshBack = new THREE.Mesh(rivetGeo, goldHighlightMaterial);
      rivetMeshBack.position.set(rx, ry, -0.145);
      medalRoot.add(rivetMeshBack);
    }

    // 6. Front Medal Face Disc with Embossed Texture
    const faceDiscGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.04, 64);
    faceDiscGeo.rotateX(Math.PI / 2);

    const faceFrontMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      map: textures.colorMap,
      bumpMap: textures.bumpMap,
      bumpScale: 0.045,
      metalness: 0.88,
      roughness: 0.28,
    });
    const faceFrontMesh = new THREE.Mesh(faceDiscGeo, faceFrontMat);
    faceFrontMesh.position.z = 0.12;
    medalRoot.add(faceFrontMesh);

    // 7. Back Medal Face Disc (Polished metal back)
    const faceBackMat = new THREE.MeshStandardMaterial({
      color: 0x3B2418,
      metalness: 0.92,
      roughness: 0.25,
    });
    const faceBackMesh = new THREE.Mesh(faceDiscGeo, faceBackMat);
    faceBackMesh.position.z = -0.12;
    medalRoot.add(faceBackMesh);

    // 8. Authentic Top Ribbon Suspension Loop
    const topLoopGeo = new THREE.TorusGeometry(0.42, 0.09, 16, 32);
    const topLoopMesh = new THREE.Mesh(topLoopGeo, goldHighlightMaterial);
    topLoopMesh.position.set(0, 2.68, 0);
    medalRoot.add(topLoopMesh);

    // -------------------------------------------------------------------------
    // FLOATING 3D BRONZE PARTICLES
    // -------------------------------------------------------------------------
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const radius = 2.6 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[p * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[p * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[p * 3 + 2] = (radius * Math.cos(phi)) * 0.7;

      particleSpeeds[p * 3] = (Math.random() - 0.5) * 0.003;
      particleSpeeds[p * 3 + 1] = 0.002 + Math.random() * 0.004;
      particleSpeeds[p * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xE6B27A,
      size: 0.065,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlesMesh);

    // -------------------------------------------------------------------------
    // CINEMATIC LIGHTING
    // -------------------------------------------------------------------------
    // Soft warm ambient base
    const ambientLight = new THREE.AmbientLight(0x3B2418, 1.4);
    scene.add(ambientLight);

    // Hemisphere light: Warm copper sky / deep bronze ground
    const hemiLight = new THREE.HemisphereLight(0xE6B27A, 0x17120F, 1.2);
    scene.add(hemiLight);

    // Key Directional Light (Warm highlight from top-right)
    const keyLight = new THREE.DirectionalLight(0xFFE5C8, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    // Fill Directional Light (Deep copper from bottom-left)
    const fillLight = new THREE.DirectionalLight(0xA8683A, 1.4);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    // Rim Backlight (Highlighting metallic edge)
    const rimLight = new THREE.DirectionalLight(0xC47A45, 2.0);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // Dynamic Metallic Sweep Point Light (Animates across the medal face)
    const sweepLight = new THREE.PointLight(0xFFF2E0, 3.5, 9);
    sweepLight.position.set(-3.5, 1.5, 2.2);
    scene.add(sweepLight);

    // -------------------------------------------------------------------------
    // ENTRANCE & IDLE ANIMATION LOOP
    // -------------------------------------------------------------------------
    let isVisible = true;
    let animId: number;
    const startTime = performance.now();

    // Initial pose for entrance
    if (!isReduced) {
      medalRoot.scale.set(0.05, 0.05, 0.05);
      medalRoot.rotation.y = -Math.PI * 1.5;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = (currentTime - startTime) / 1000;

      // 1. Entrance Stage (0s -> 2.4s)
      if (elapsed < 2.4 && !isReduced) {
        const progress = Math.min(elapsed / 2.4, 1);
        // Smooth cubic out easing
        const easeOut = 1 - Math.pow(1 - progress, 3);

        const currentScale = 0.05 + 0.95 * easeOut;
        medalRoot.scale.set(currentScale, currentScale, currentScale);

        medalRoot.rotation.y = -Math.PI * 1.5 * (1 - easeOut);
        medalRoot.rotation.x = Math.sin(progress * Math.PI) * 0.2;

        // Sweep light moves across face during entrance
        sweepLight.position.x = -4 + 8 * easeOut;
        sweepLight.position.y = 1.5 - 1 * easeOut;
      } else {
        if (animationPhase === 'entering') {
          setAnimationPhase('revealed');
        }

        // 2. Idle State: Floating bob + gentle yaw rotation + mouse interaction
        if (!isReduced) {
          // Smooth mouse tilt lerp
          mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
          mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

          const idleYaw = Math.sin(elapsed * 0.7) * 0.18;
          const idlePitch = Math.cos(elapsed * 0.9) * 0.09;
          const idleBob = Math.sin(elapsed * 1.4) * 0.08;

          medalRoot.position.y = idleBob;
          medalRoot.rotation.y = idleYaw + mouseRef.current.x * 0.55;
          medalRoot.rotation.x = idlePitch - mouseRef.current.y * 0.45;

          // Periodic light sweep across medal every ~7 seconds
          const sweepCycle = (elapsed % 7) / 7;
          if (sweepCycle < 0.3) {
            const sweepNorm = sweepCycle / 0.3;
            sweepLight.position.x = -3.5 + 7 * sweepNorm;
            sweepLight.intensity = 3.5 * Math.sin(sweepNorm * Math.PI);
          } else {
            sweepLight.intensity = 0.8;
          }
        }
      }

      // Rotate particle cloud gently
      particlesMesh.rotation.y = elapsed * 0.035;
      particlesMesh.rotation.x = Math.sin(elapsed * 0.02) * 0.05;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    // MOUSE TILT LISTENER (Desktop interactive cursor tilt)
    // -------------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------------------
    // CLEANUP & DISPOSAL
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);

      // Dispose Three.js objects
      outerRimGeo.dispose();
      bevelTorusGeo.dispose();
      grooveGeo.dispose();
      innerRimGeo.dispose();
      rivetGeo.dispose();
      faceDiscGeo.dispose();
      topLoopGeo.dispose();
      particleGeometry.dispose();

      metallicRimMaterial.dispose();
      bevelRingMaterial.dispose();
      darkBronzeGrooveMaterial.dispose();
      goldHighlightMaterial.dispose();
      faceFrontMat.dispose();
      faceBackMat.dispose();
      particleMaterial.dispose();

      if (textures.colorMap) textures.colorMap.dispose();
      if (textures.bumpMap) textures.bumpMap.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported, animationPhase]);

  return (
    <section
      id="bronze-achievement"
      className={`bronze-showcase-section ${className}`}
      aria-label="Community Bronze Achievement Showcase"
    >
      {/* Background Ambient Lighting & Grid */}
      <div className="bronze-ambient-glow-top" aria-hidden="true" />
      <div className="bronze-ambient-glow-center" aria-hidden="true" />
      <div className="bronze-grid-pattern" aria-hidden="true" />
      <div className="bronze-light-sweep" aria-hidden="true" />

      <div className="bronze-showcase-container">
        {/* Top Eyebrow Tag */}
        <div className="text-center mb-6">
          <div className="bronze-eyebrow">
            <span className="bronze-eyebrow-dot" />
            <span>Official Chapter Milestone</span>
            <span className="text-[#A8683A]">✦</span>
            <span>2026 Season</span>
          </div>
        </div>

        {/* Main Content Grid: Left 3D Stage, Right Achievement Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 3D Bronze Emblem Canvas (or WebGL Fallback) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="bronze-canvas-wrapper">
              {webglSupported ? (
                <div
                  ref={mountRef}
                  className="w-full h-full flex items-center justify-center select-none"
                  title="Hover and move your cursor to inspect the 3D Bronze Medal"
                />
              ) : (
                /* Fallback if WebGL is unavailable */
                <div className="bronze-fallback-medal">
                  <div className="text-xs font-bold tracking-widest text-[#FFE8D0] uppercase mb-1">
                    GDG ON CAMPUS NECN
                  </div>
                  <div className="text-3xl font-black text-[#FFE5C8] tracking-widest my-1 drop-shadow-md">
                    BRONZE
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-[#E6B27A] uppercase mt-1">
                    STATUS ACHIEVED
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Desktop Tilt Hint */}
            <p className="text-[11px] font-medium tracking-wide text-[#E6B27A]/75 mt-2 flex items-center gap-1.5 select-none">
              <span>✦</span>
              <span>
                {isHovered ? 'Interactive 3D Perspective Active' : 'Hover & tilt to inspect physical bronze depth'}
              </span>
              <span>✦</span>
            </p>
          </div>

          {/* Right Column: Sophisticated Typography & Official Messaging */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Super-Header / Chapter Hierarchy */}
            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-extrabold tracking-[0.24em] uppercase text-[#E6B27A]">
                {organization}
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] bronze-gradient-title">
                {title}
              </h2>
              <p className="text-lg sm:text-2xl font-bold tracking-tight bronze-gradient-sub">
                {subtitle}
              </p>
            </div>

            {/* Program Name & Description */}
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#3B2418]/60 border border-[#C47A45]/30 text-xs sm:text-sm font-semibold text-[#F5D3B3]">
                <span className="text-amber-400">☁️</span>
                <span>{program}</span>
              </div>
              <p className="text-sm sm:text-base text-[#F8F5EE]/80 leading-relaxed font-normal">
                {description}
              </p>
            </div>

            {/* Verified Cohort Impact Chips */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg pt-2">
              <div className="bronze-stat-chip">
                <span className="text-2xl sm:text-3xl font-black text-[#FFE5C8] tracking-tight">
                  {achievedMilestones}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#E6B27A] tracking-wider uppercase mt-1 text-center">
                  Chapter Milestones
                </span>
              </div>

              <div className="bronze-stat-chip">
                <span className="text-2xl sm:text-3xl font-black text-[#FFE5C8] tracking-tight">
                  {achievedBadges}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#E6B27A] tracking-wider uppercase mt-1 text-center">
                  Badges Earned
                </span>
              </div>

              <div className="bronze-stat-chip">
                <span className="text-2xl sm:text-3xl font-black text-[#FFE5C8] tracking-tight">
                  {activeChampions}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-[#E6B27A] tracking-wider uppercase mt-1 text-center">
                  Active Champions
                </span>
              </div>
            </div>

            {/* Interactive Call to Action */}
            {onExploreLeaderboard && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onExploreLeaderboard}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#A8683A] via-[#C47A45] to-[#E6B27A] text-[#17120F] font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-[#3B2418]/50 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <span>Explore Cohort Leaderboard</span>
                  <span className="text-base">→</span>
                </button>
              </div>
            )}

            {/* Authenticity Watermark */}
            <div className="pt-2 border-t border-[#C47A45]/20 w-full flex items-center justify-between text-[11px] text-[#E6B27A]/70">
              <span>Verified Google Cloud Learn with Communities Cohort</span>
              <span className="font-mono text-[#F5D3B3]">Status: Active</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default BronzeAchievement3D;
