import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GoldTrophy3DProps {
  className?: string;
  isRevealed?: boolean;
}

export const GoldTrophy3D: React.FC<GoldTrophy3DProps> = ({
  className = '',
  isRevealed = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Mouse tilt tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Procedural High-Res Texture for Gold Medallion & Nameplate
    const createMedallionTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const cx = 512;
      const cy = 512;

      // Radial Gold Gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, 480);
      grad.addColorStop(0, '#FFF2B2');
      grad.addColorStop(0.35, '#FFD700');
      grad.addColorStop(0.7, '#D4AF37');
      grad.addColorStop(1, '#996515');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine concentric brushed metal lines
      for (let r = 80; r < 460; r += 12) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = r % 24 === 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(150, 95, 20, 0.15)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Beaded border
      const dots = 40;
      for (let i = 0; i < dots; i++) {
        const angle = (i / dots) * Math.PI * 2;
        const bx = cx + Math.cos(angle) * 440;
        const by = cy + Math.sin(angle) * 440;
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8DC';
        ctx.shadowColor = '#8B6508';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Circular text: GDG ON-CAMPUS NECN
      ctx.save();
      ctx.fillStyle = '#664200';
      ctx.font = '900 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowOffsetY = 1.5;

      const topText = '★ GDG ON-CAMPUS NECN ★';
      for (let i = 0; i < topText.length; i++) {
        const angle = -Math.PI / 2 + (i - topText.length / 2 + 0.5) * 0.11;
        ctx.save();
        ctx.translate(cx + Math.cos(angle) * 360, cy + Math.sin(angle) * 360);
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(topText[i], 0, 0);
        ctx.restore();
      }

      // Bottom Text: GOLD CHAPTER 2026
      const botText = '• GOLD MILESTONE •';
      for (let i = 0; i < botText.length; i++) {
        const angle = Math.PI / 2 - (i - botText.length / 2 + 0.5) * 0.12;
        ctx.save();
        ctx.translate(cx + Math.cos(angle) * 360, cy + Math.sin(angle) * 360);
        ctx.rotate(angle - Math.PI / 2);
        ctx.fillText(botText[i], 0, 0);
        ctx.restore();
      }
      ctx.restore();

      // Center Google Cloud Emblem Shape (Stylized relief)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#805300';
      ctx.shadowColor = 'rgba(255, 245, 180, 0.8)';
      ctx.shadowBlur = 12;

      // Center Star Crest
      ctx.beginPath();
      const points = 5;
      const outerR = 90;
      const innerR = 40;
      for (let p = 0; p < points * 2; p++) {
        const r = p % 2 === 0 ? outerR : innerR;
        const a = (p / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Core Highlight
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF8DC';
      ctx.fill();
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = true;
      return texture;
    };

    const medallionTexture = createMedallionTexture();

    // 3. Materials
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFAD02C,
      emissive: 0x241700,
      metalness: 0.94,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });

    const champagneMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFECC4,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
    });

    const darkPedestalMaterial = new THREE.MeshStandardMaterial({
      color: 0x111622,
      metalness: 0.6,
      roughness: 0.35,
    });

    const medallionFaceMaterial = new THREE.MeshStandardMaterial({
      map: medallionTexture || undefined,
      metalness: 0.88,
      roughness: 0.22,
    });

    // 4. Assemble the 3D Trophy Mesh Hierarchy
    const trophyRoot = new THREE.Group();
    scene.add(trophyRoot);

    // --- A. Multi-tiered Pedestal Base ---
    const baseOctagon = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.45, 0.45, 8),
      darkPedestalMaterial
    );
    baseOctagon.position.y = -1.65;
    trophyRoot.add(baseOctagon);

    const baseGoldTrim = new THREE.Mesh(
      new THREE.TorusGeometry(1.36, 0.06, 16, 8),
      goldMaterial
    );
    baseGoldTrim.rotation.x = Math.PI / 2;
    baseGoldTrim.position.y = -1.65;
    trophyRoot.add(baseGoldTrim);

    const baseMid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 1.15, 0.3, 16),
      goldMaterial
    );
    baseMid.position.y = -1.32;
    trophyRoot.add(baseMid);

    // --- B. Trophy Riser & Stem ---
    const stemLower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.65, 0.5, 24),
      champagneMaterial
    );
    stemLower.position.y = -0.95;
    trophyRoot.add(stemLower);

    const stemRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.08, 16, 32),
      goldMaterial
    );
    stemRing.rotation.x = Math.PI / 2;
    stemRing.position.y = -0.7;
    trophyRoot.add(stemRing);

    const stemUpper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.36, 0.45, 24),
      champagneMaterial
    );
    stemUpper.position.y = -0.45;
    trophyRoot.add(stemUpper);

    // --- C. Trophy Chalice Cup ---
    const cupLower = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 0.52, 0.75, 32),
      goldMaterial
    );
    cupLower.position.y = 0.12;
    trophyRoot.add(cupLower);

    const cupRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.12, 0.08, 16, 48),
      champagneMaterial
    );
    cupRim.rotation.x = Math.PI / 2;
    cupRim.position.y = 0.5;
    trophyRoot.add(cupRim);

    // --- D. Trophy Handles (Left & Right) ---
    const handleGeo = new THREE.TorusGeometry(0.58, 0.07, 16, 32, Math.PI * 1.3);
    
    const leftHandle = new THREE.Mesh(handleGeo, goldMaterial);
    leftHandle.rotation.z = Math.PI * 0.35;
    leftHandle.position.set(-1.18, 0.22, 0);
    trophyRoot.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMaterial);
    rightHandle.rotation.z = -Math.PI * 0.35;
    rightHandle.rotation.y = Math.PI;
    rightHandle.position.set(1.18, 0.22, 0);
    trophyRoot.add(rightHandle);

    // --- E. Floating Radiant Gold Medallion Crown ---
    const medallionGroup = new THREE.Group();
    medallionGroup.position.set(0, 1.25, 0);
    trophyRoot.add(medallionGroup);

    // Outer Bezel Rim
    const bezelTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.88, 0.09, 20, 48),
      champagneMaterial
    );
    medallionGroup.add(bezelTorus);

    // Medallion Disc Front & Back
    const discGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 48);
    const discMesh = new THREE.Mesh(discGeo, [
      goldMaterial,
      medallionFaceMaterial, // Top/Front face
      goldMaterial,          // Bottom/Back face
    ]);
    discMesh.rotation.x = Math.PI / 2;
    medallionGroup.add(discMesh);

    // Radiant Laurel Leaves surround
    for (let l = 0; l < 14; l++) {
      const angle = (l / 14) * Math.PI * 1.8 - Math.PI * 0.9;
      const leafMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        goldMaterial
      );
      leafMesh.scale.set(0.6, 1.4, 0.3);
      leafMesh.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0);
      leafMesh.rotation.z = angle + Math.PI / 2;
      medallionGroup.add(leafMesh);
    }

    // 5. Cinematic Lighting
    const keyLight = new THREE.DirectionalLight(0xFFF2B2, 3.8);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLightBlue = new THREE.DirectionalLight(0x4285F4, 2.2);
    rimLightBlue.position.set(-4, -2, -3);
    scene.add(rimLightBlue);

    const rimLightChampagne = new THREE.PointLight(0xFFE4A0, 3.0, 12);
    rimLightChampagne.position.set(0, 1.5, -2.5);
    scene.add(rimLightChampagne);

    const ambientLight = new THREE.AmbientLight(0x403010, 1.8);
    scene.add(ambientLight);

    // 6. Interactive Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx * 0.45;
      mouseRef.current.targetY = ny * 0.3;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Render Loop with Entrance & Idle Float
    let startTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;

      // Mouse Lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Trophy Gentle Float & Rotation
      trophyRoot.position.y = Math.sin(elapsed * 1.4) * 0.08 - 0.1;
      trophyRoot.rotation.y = Math.sin(elapsed * 0.6) * 0.25 + mouseRef.current.x;
      trophyRoot.rotation.x = mouseRef.current.y * 0.3;

      // Medallion Subtle Shimmer Spin
      medallionGroup.rotation.y = Math.sin(elapsed * 1.8) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      medallionTexture?.dispose();
      goldMaterial.dispose();
      champagneMaterial.dispose();
      darkPedestalMaterial.dispose();
      medallionFaceMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [webglSupported]);

  if (!webglSupported) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-[0_0_60px_rgba(255,215,0,0.4)] flex items-center justify-center">
          <span className="text-6xl">🏆</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none ${className}`}
      aria-label="3D Interactive Gold Trophy"
    />
  );
};
export default GoldTrophy3D;
