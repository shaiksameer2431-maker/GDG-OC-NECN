import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CommunityCelebrationSceneProps {
  className?: string;
  label?: string;
}

const GOOGLE_COLORS = [0x4285F4, 0xEA4335, 0xFBBC04, 0x34A853];

export const CommunityCelebrationScene: React.FC<CommunityCelebrationSceneProps> = ({
  className = '',
  label = 'Three-dimensional golden trophy celebrating the GDG On Campus NECN community achievements',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglAvailable(false);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 9.2);

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    const keyLight = new THREE.DirectionalLight(0xffedbd, 3.1);
    keyLight.position.set(4, 6, 7);
    scene.add(keyLight);
    const coolFill = new THREE.PointLight(0x4285f4, 2.2, 18);
    coolFill.position.set(-4, 0, 4);
    scene.add(coolFill);
    const warmRim = new THREE.PointLight(0xffb52e, 2.8, 18);
    warmRim.position.set(2, -3, -3);
    scene.add(warmRim);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xe9b83f,
      metalness: 0.92,
      roughness: 0.2,
    });
    const brightGold = new THREE.MeshStandardMaterial({
      color: 0xffdf78,
      metalness: 0.88,
      roughness: 0.16,
    });
    const darkGold = new THREE.MeshStandardMaterial({
      color: 0x9a6415,
      metalness: 0.86,
      roughness: 0.27,
    });

    const trophy = new THREE.Group();
    scene.add(trophy);

    const cupProfile = [
      new THREE.Vector2(0.03, 0),
      new THREE.Vector2(0.67, 0),
      new THREE.Vector2(0.86, 0.18),
      new THREE.Vector2(0.69, 0.38),
      new THREE.Vector2(0.54, 0.82),
      new THREE.Vector2(0.51, 1.22),
      new THREE.Vector2(0.65, 1.43),
      new THREE.Vector2(0.65, 1.5),
      new THREE.Vector2(0.03, 1.5),
    ];
    const cup = new THREE.Mesh(new THREE.LatheGeometry(cupProfile, 64), gold);
    cup.position.y = -0.02;
    trophy.add(cup);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.075, 16, 64), brightGold);
    rim.position.y = 1.46;
    trophy.add(rim);

    const handleGeometry = new THREE.TorusGeometry(0.43, 0.09, 18, 48);
    const leftHandle = new THREE.Mesh(handleGeometry, brightGold);
    leftHandle.position.set(-0.73, 1.02, 0);
    leftHandle.rotation.z = -0.2;
    trophy.add(leftHandle);
    const rightHandle = new THREE.Mesh(handleGeometry, brightGold);
    rightHandle.position.set(0.73, 1.02, 0);
    rightHandle.rotation.z = 0.2;
    trophy.add(rightHandle);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.27, 0.58, 32), darkGold);
    stem.position.y = -0.38;
    trophy.add(stem);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.12, 48), brightGold);
    neck.position.y = -0.68;
    trophy.add(neck);
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.28, 0.82), darkGold);
    plinth.position.y = -0.86;
    trophy.add(plinth);
    const plinthTop = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.12, 0.9), brightGold);
    plinthTop.position.y = -0.67;
    trophy.add(plinthTop);
    const plinthBase = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.16, 0.98), gold);
    plinthBase.position.y = -1.06;
    trophy.add(plinthBase);

    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? 0.31 : 0.14;
      const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const star = new THREE.Mesh(
      new THREE.ExtrudeGeometry(starShape, { depth: 0.09, bevelEnabled: true, bevelSize: 0.035, bevelThickness: 0.025, bevelSegments: 3 }),
      brightGold,
    );
    star.position.set(0, 1.83, 0.05);
    trophy.add(star);

    const orbit = new THREE.Group();
    scene.add(orbit);
    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.018, 10, 180),
      new THREE.MeshBasicMaterial({ color: 0xd8a52d, transparent: true, opacity: 0.62 }),
    );
    orbitRing.rotation.x = 1.12;
    orbitRing.rotation.y = -0.25;
    orbit.add(orbitRing);

    const orbitRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.012, 8, 180),
      new THREE.MeshBasicMaterial({ color: 0x4285f4, transparent: true, opacity: 0.45 }),
    );
    orbitRing2.rotation.x = 0.48;
    orbitRing2.rotation.y = 0.72;
    orbit.add(orbitRing2);

    const confettiGroup = new THREE.Group();
    scene.add(confettiGroup);
    const confettiGeometry = new THREE.BoxGeometry(0.075, 0.15, 0.035);
    const confettiMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 34; i += 1) {
      const material = new THREE.MeshStandardMaterial({
        color: GOOGLE_COLORS[i % GOOGLE_COLORS.length],
        metalness: 0.35,
        roughness: 0.38,
      });
      const piece = new THREE.Mesh(confettiGeometry, material);
      const angle = (i / 34) * Math.PI * 2;
      const radius = 2.8 + (i % 4) * 0.22;
      piece.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.72, (i % 5) * 0.12 - 0.24);
      piece.rotation.set(i * 0.7, i * 0.31, i * 0.9);
      confettiGroup.add(piece);
      confettiMeshes.push(piece);
    }

    const starPoints = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 2.2;
      starPoints[i * 3] = Math.cos(angle) * radius;
      starPoints[i * 3 + 1] = Math.sin(angle) * radius * 0.8;
      starPoints[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(starPoints, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xffdf78, size: 0.045, transparent: true, opacity: 0.8 }),
    );
    scene.add(particles);

    let frame = 0;
    let visible = true;
    let pointerX = 0;
    let pointerY = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const resize = () => {
      const width = canvas.clientWidth || 1;
      const height = canvas.clientHeight || 1;
      camera.aspect = width / height;
      camera.position.z = width < 480 ? 10.8 : 9.2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const start = performance.now();
    const animate = (now: number) => {
      frame = window.requestAnimationFrame(animate);
      if (!visible) return;
      const elapsed = (now - start) / 1000;
      if (!reducedMotion) {
        trophy.position.y = Math.sin(elapsed * 1.25) * 0.11;
        trophy.rotation.y += (pointerX * 0.2 + Math.sin(elapsed * 0.55) * 0.1 - trophy.rotation.y) * 0.035;
        trophy.rotation.x += (-pointerY * 0.12 - trophy.rotation.x) * 0.035;
        orbit.rotation.y = elapsed * 0.12;
        orbit.rotation.z = Math.sin(elapsed * 0.35) * 0.08;
        confettiMeshes.forEach((piece, index) => {
          piece.rotation.x += 0.004 + (index % 3) * 0.001;
          piece.rotation.y += 0.006 + (index % 4) * 0.001;
          piece.position.y += Math.sin(elapsed * 0.8 + index) * 0.0009;
        });
        particles.rotation.y = elapsed * 0.025;
      }
      renderer.render(scene, camera);
    };
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`community-celebration-scene relative h-full w-full ${className}`} role="img" aria-label={label}>
      {webglAvailable ? (
        <canvas ref={canvasRef} className="h-full w-full block" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-8xl" aria-hidden="true">🏆</div>
      )}
    </div>
  );
};

export default CommunityCelebrationScene;
