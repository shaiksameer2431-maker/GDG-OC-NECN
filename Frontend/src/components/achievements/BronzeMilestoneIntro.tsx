import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { COMMUNITY_BRONZE_MILESTONE } from '../../config/communityTiers';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
}

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [displayCount, setDisplayCount] = useState<number>(0);

  const {
    milestoneTitle,
    collegeName,
    studentTarget,
    badgeThreshold,
    tagline,
  } = useMemo(() => COMMUNITY_BRONZE_MILESTONE, []);

  // Continuous "Papers Effect" (Confetti Rain) & 9.2-Second Transition
  useEffect(() => {
    const confettiColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#E08544', '#F7B882'];

    // 1. Initial Grand Celebratory Center Blast
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: confettiColors,
      scalar: 1.2,
      disableForReducedMotion: true,
    });

    // 2. Continuous "Papers" Cascade Rain (Running for 8.5 seconds)
    const confettiEnd = Date.now() + 8500;
    const confettiInterval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(confettiInterval);
        return;
      }

      // Streamers & papers from left side
      confetti({
        particleCount: 16,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: confettiColors,
        ticks: 200,
        gravity: 0.85,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });

      // Streamers & papers from right side
      confetti({
        particleCount: 16,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: confettiColors,
        ticks: 200,
        gravity: 0.85,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });
    }, 280);

    // 3. Start exit transition after 8.4 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 8400);

    // 4. Complete transition and reveal website after 9.2 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 9200);

    return () => {
      clearInterval(confettiInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Smooth Count-up for 50+
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayCount(Math.round(studentTarget * ease));
      if (p < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [studentTarget]);

  // 3D Three.js Shield Scene (Vibrant Golden-Copper Bronze, Zero Blackness)
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 360;

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    renderer.domElement.className = 'w-full h-full block';

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

    // Procedural Texture with Radiant Golden-Copper Palette (No dark brown/black)
    const createShieldTextures = () => {
      const cCanvas = document.createElement('canvas');
      cCanvas.width = 1024;
      cCanvas.height = 1024;
      const ctx = cCanvas.getContext('2d');

      if (!ctx) return null;

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

      ctx.save();
      drawHexPath(ctx, hexRadius);
      ctx.clip();

      // Radiant Golden Bronze Gradient Base (Lustrous, warm golden copper)
      const grad = ctx.createRadialGradient(cx, cy - 60, 40, cx, cy, hexRadius);
      grad.addColorStop(0, '#FFF0DC');
      grad.addColorStop(0.25, '#F7B882');
      grad.addColorStop(0.6, '#E08544');
      grad.addColorStop(0.85, '#C66826');
      grad.addColorStop(1, '#A8521A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Top Header: "GDG ON CAMPUS"
      ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 8;
      ctx.fillText('GDG ON CAMPUS', cx, cy - 230);
      ctx.shadowBlur = 0;

      // Top Sub-header Pill: "NECN"
      const pillW = 140;
      const pillH = 38;
      ctx.fillStyle = '#8B4214';
      ctx.strokeStyle = '#FFE0C4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(cx - pillW / 2, cy - 195, pillW, pillH, 19);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 22px "Plus Jakarta Sans", monospace, sans-serif';
      ctx.fillStyle = '#FFE0C4';
      ctx.fillText('NECN', cx, cy - 176);

      // Multicolor GDG Brackets Logo: { < / > }
      const logoY = cy - 35;
      ctx.font = '900 120px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#4285F4';
      ctx.shadowColor = 'rgba(66, 133, 244, 0.4)';
      ctx.shadowBlur = 12;
      ctx.fillText('{', cx - 140, logoY);

      ctx.fillStyle = '#EA4335';
      ctx.shadowColor = 'rgba(234, 67, 53, 0.4)';
      ctx.fillText('<', cx - 55, logoY);

      ctx.fillStyle = '#FBBC04';
      ctx.shadowColor = 'rgba(251, 188, 4, 0.4)';
      ctx.fillText('>', cx + 55, logoY);

      ctx.fillStyle = '#34A853';
      ctx.shadowColor = 'rgba(52, 168, 83, 0.4)';
      ctx.fillText('}', cx + 140, logoY);
      ctx.shadowBlur = 0;

      // BRONZE Engraved Text
      ctx.font = '900 italic 86px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillStyle = '#4A2008';
      ctx.fillText('BRONZE', cx + 2, cy + 122);

      const bronzeGrad = ctx.createLinearGradient(cx - 180, cy + 100, cx + 180, cy + 130);
      bronzeGrad.addColorStop(0, '#FFFFFF');
      bronzeGrad.addColorStop(0.35, '#FFE0C4');
      bronzeGrad.addColorStop(0.7, '#F7B882');
      bronzeGrad.addColorStop(1, '#E08544');
      ctx.fillStyle = bronzeGrad;
      ctx.fillText('BRONZE', cx, cy + 120);

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.strokeText('BRONZE', cx, cy + 120);

      // MILESTONE ACHIEVED
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.letterSpacing = '5px';
      ctx.fillStyle = '#FFE0C4';
      ctx.fillText('MILESTONE ACHIEVED', cx, cy + 195);

      ctx.restore();

      const colorTexture = new THREE.CanvasTexture(cCanvas);
      colorTexture.colorSpace = THREE.SRGBColorSpace;
      return colorTexture;
    };

    const colorTexture = createShieldTextures();

    // 3D Hexagonal Shield Group
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Radiant Bronze Materials with moderate metalness for rich golden-copper diffuse color
    const baseBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xC66826,
      metalness: 0.38,
      roughness: 0.32,
    });

    const polishedBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xE58D4C,
      metalness: 0.42,
      roughness: 0.22,
    });

    const highlightGoldMat = new THREE.MeshStandardMaterial({
      color: 0xFCD6B0,
      metalness: 0.45,
      roughness: 0.18,
    });

    const baseGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.24, 6);
    baseGeo.rotateX(Math.PI / 2);
    shieldGroup.add(new THREE.Mesh(baseGeo, baseBronzeMat));

    const frameGeo = new THREE.CylinderGeometry(2.38, 2.38, 0.28, 6);
    frameGeo.rotateX(Math.PI / 2);
    shieldGroup.add(new THREE.Mesh(frameGeo, polishedBronzeMat));

    const ridgeGeo = new THREE.CylinderGeometry(2.26, 2.26, 0.3, 6);
    ridgeGeo.rotateX(Math.PI / 2);
    shieldGroup.add(new THREE.Mesh(ridgeGeo, highlightGoldMat));

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

    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      map: colorTexture,
      metalness: 0.28,
      roughness: 0.30,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = 0.14;
    shieldGroup.add(faceMesh);

    // Glistening Corner Rivets
    const rivetGeo = new THREE.SphereGeometry(0.065, 14, 14);
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const rx = Math.cos(angle) * 2.36;
      const ry = Math.sin(angle) * 2.36;
      const rivetFront = new THREE.Mesh(rivetGeo, highlightGoldMat);
      rivetFront.position.set(rx, ry, 0.16);
      shieldGroup.add(rivetFront);
    }

    // Floating Particles
    const particleColors = [
      new THREE.Color(0x4285F4),
      new THREE.Color(0xEA4335),
      new THREE.Color(0xFBBC04),
      new THREE.Color(0x34A853),
      new THREE.Color(0xF0A973),
    ];
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColorArray = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const rad = 2.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[p * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePositions[p * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePositions[p * 3 + 2] = rad * Math.cos(phi) * 0.8;

      const c = particleColors[p % particleColors.length];
      particleColorArray[p * 3] = c.r;
      particleColorArray[p * 3 + 1] = c.g;
      particleColorArray[p * 3 + 2] = c.b;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColorArray, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Warm, Rich Cinematic Lighting
    scene.add(new THREE.AmbientLight(0xFFF6ED, 2.2));

    const keyLight = new THREE.DirectionalLight(0xFFF9F0, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xF0A973, 2.0);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const sweepLight = new THREE.PointLight(0xFFFFFF, 3.4, 9);
    sweepLight.position.set(-3.5, 1.2, 2.4);
    scene.add(sweepLight);

    // Initial Pose
    shieldGroup.scale.set(0.1, 0.1, 0.1);
    shieldGroup.position.y = -0.6;
    shieldGroup.rotation.y = -Math.PI * 1.2;

    let animId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      const elapsed = (currentTime - startTime) / 1000;

      if (elapsed < 2.0) {
        const progress = Math.min(elapsed / 2.0, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const s = 0.1 + 0.9 * easeOut;
        shieldGroup.scale.set(s, s, s);
        shieldGroup.position.y = -0.6 * (1 - easeOut);
        shieldGroup.rotation.y = -Math.PI * 1.2 * (1 - easeOut);
        sweepLight.position.x = -4 + 8 * easeOut;
      } else {
        const idleBob = Math.sin(elapsed * 0.9) * 0.04;
        const idleYaw = Math.sin(elapsed * 0.5) * 0.1;
        const idlePitch = Math.cos(elapsed * 0.7) * 0.05;
        shieldGroup.position.y = idleBob;
        shieldGroup.rotation.y = idleYaw;
        shieldGroup.rotation.x = idlePitch;

        const sweepCycle = (elapsed % 6.5) / 6.5;
        if (sweepCycle < 0.28) {
          const norm = sweepCycle / 0.28;
          sweepLight.position.x = -3.5 + 7 * norm;
          sweepLight.intensity = 3.4 * Math.sin(norm * Math.PI);
        } else {
          sweepLight.intensity = 0.8;
        }
      }

      particles.rotation.y = elapsed * 0.035;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      adjustCamera(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
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
      particleMaterial.dispose();
      if (colorTexture) colorTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported]);

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Official Bronze Milestone Achievement Introduction"
    >
      {/* 9.2-Second Auto-Transition Top Progress Bar */}
      <div className="bmi-progress-track" aria-hidden="true">
        <div className="bmi-progress-bar" />
      </div>

      {/* Main Content */}
      <div className="bmi-content">
        {/* Organization Branding */}
        <h3 className="bmi-org-title">GDG on Campus</h3>
        <p className="bmi-college-title">{collegeName}</p>

        {/* ACHIEVEMENT UNLOCKED Pill */}
        <div className="bmi-unlocked-pill">
          <span>✦</span>
          <span>ACHIEVEMENT UNLOCKED!</span>
          <span>✦</span>
        </div>

        {/* BRONZE MILESTONE ACHIEVED */}
        <h1 className="bmi-heading">
          {milestoneTitle}
        </h1>

        {/* Central 3D Hexagonal Bronze Shield */}
        <div className="bmi-stage-wrapper">
          {webglSupported ? (
            <div ref={mountRef} className="w-full h-full flex items-center justify-center select-none" />
          ) : (
            <div className="w-48 h-56 bg-gradient-to-br from-[#F7B882] via-[#E08544] to-[#C66826] rounded-2xl flex items-center justify-center text-white font-black italic text-2xl shadow-xl">
              BRONZE
            </div>
          )}
        </div>

        {/* Rounded White Statistics Container */}
        <div className="bmi-stat-card">
          <div className="bmi-stat-metric-row">
            <div className="bmi-stat-icon-wrap" aria-hidden="true">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#4285F4" />
                <circle cx="9" cy="7" r="4" stroke="#EA4335" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="#FBBC04" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#34A853" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="bmi-stat-number">{displayCount}+</span>
              <span className="bmi-stat-students-label">STUDENTS</span>
            </div>
          </div>

          <div className="bmi-stat-badge-desc">
            <span className="bmi-check-circle" aria-hidden="true">✓</span>
            <span>COMPLETED {badgeThreshold} BADGES!</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="bmi-tagline">
          <span className="bmi-tagline-prefix">{tagline.prefix}</span>
          <span className="bmi-tagline-learn">{tagline.learn}</span>
          <span className="bmi-tagline-build">We {tagline.build}</span>
          <span className="bmi-tagline-grow">We {tagline.grow}</span>
        </div>
      </div>
    </div>
  );
};

export default BronzeMilestoneIntro;
