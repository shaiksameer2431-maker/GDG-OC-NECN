import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Student, CohortStats, OfficialCourse } from '../../types';
import { Avatar } from '../common/Avatar';

interface Luxury3DViewProps {
  stats: CohortStats;
  students: Student[];
  officialCourses: OfficialCourse[];
  onNavigate: (tab: string, studentId?: string) => void;
}

const GOOGLE_COLORS = [0x4285F4, 0xEA4335, 0xFBBC04, 0x34A853];
const CSS_COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];

export const Luxury3DView: React.FC<Luxury3DViewProps> = ({
  stats,
  students,
  officialCourses,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [counterValue, setCounterValue] = useState(0);
  const [podiumInView, setPodiumInView] = useState(false);

  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const awardsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const campusCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const siRef = useRef<HTMLDivElement | null>(null);

  // Top 3 champions for the 3D podium
  const champion1 = students[0];
  const champion2 = students[1];
  const champion3 = students[2];

  // Animated counter up to totalStudents
  useEffect(() => {
    let animId: number;
    const target = stats.totalStudents || 438;
    const startTime = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounterValue(Math.round(target * ease));
      if (p < 1) {
        animId = requestAnimationFrame(tick);
      }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [stats.totalStudents]);

  // Scroll spy & reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            if (e.target.id === 'stage' || e.target.closest('#stage')) {
              setPodiumInView(true);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.luxury-rv');
    revealElements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      const sections = ['overview', 'leaderboard', 'journey', 'awards', 'about'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i]);
        if (sec && sec.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3D Tilt handler for cards
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.luxury-tilt') as HTMLElement | null;
      document.querySelectorAll<HTMLElement>('.luxury-tilt').forEach((el) => {
        if (el !== target && el.style.transform) {
          el.style.transform = '';
        }
      });
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      target.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 20}deg) rotateX(${(0.5 - y) * 20}deg) scale(1.04)`;
      target.style.setProperty('--mx', `${x * 100}%`);
      target.style.setProperty('--my', `${y * 100}%`);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Stage mouse tilt
  useEffect(() => {
    const stage = stageRef.current;
    const si = siRef.current;
    if (!stage || !si) return;

    const handleStageMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 70;
      si.style.transform = `rotateX(14deg) rotateY(${rotY}deg)`;
    };

    stage.addEventListener('mousemove', handleStageMove);
    return () => stage.removeEventListener('mousemove', handleStageMove);
  }, []);

  // Three.js Helper Functions
  const createMaterial = (color: number | string, metalness = 0, roughness = 0.3, extra = {}) => {
    return new THREE.MeshStandardMaterial({
      color: typeof color === 'string' ? new THREE.Color(color) : color,
      metalness,
      roughness,
      ...extra,
    });
  };

  const createMesh = (
    geom: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0
  ) => {
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(x, y, z);
    return mesh;
  };

  const createTextTexture = (
    text: string,
    w: number,
    h: number,
    bg: string | null,
    fg: string,
    font: string
  ) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) {
      if (bg) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.fillStyle = fg;
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);
    }
    return new THREE.CanvasTexture(c);
  };

  // Scene 1: Hero Canvas (3D Cloud, Laptop, Server Rack, Orbs, Rings)
  useEffect(() => {
    const cv = heroCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 11;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dLight.position.set(4, 6, 6);
    scene.add(dLight);
    const pLight = new THREE.PointLight(0xe6c36a, 1, 30);
    pLight.position.set(-5, -2, 5);
    scene.add(pLight);

    // Group
    const group = new THREE.Group();

    // Cloud Group
    const cloud = new THREE.Group();
    const cloudMat = createMaterial(0xffffff, 0, 0.1, {
      emissive: 0x6a8fd8,
      emissiveIntensity: 0.18,
    });
    const cloudSpheres = [
      [-1, -0.1, 0, 0.9],
      [0, 0.35, 0, 1.2],
      [1.1, -0.05, 0, 0.95],
      [0.35, -0.35, 0.7, 0.8],
      [-0.55, -0.3, 0.6, 0.7],
    ];
    cloudSpheres.forEach(([x, y, z, r]) => {
      cloud.add(createMesh(new THREE.SphereGeometry(r, 32, 32), cloudMat, x, y, z));
    });

    GOOGLE_COLORS.forEach((color, i) => {
      const ring = createMesh(
        new THREE.TorusGeometry(2.1, 0.13, 16, 60, Math.PI / 2.2),
        createMaterial(color, 0.2, 0.25)
      );
      ring.rotation.z = (i * Math.PI) / 2;
      cloud.add(ring);
    });
    cloud.position.set(-0.5, 1, 0);
    group.add(cloud);

    // Laptop Group
    const laptop = new THREE.Group();
    laptop.add(createMesh(new THREE.BoxGeometry(2, 0.1, 1.3), createMaterial(0x1c3f94, 0.6, 0.2)));
    const screen = createMesh(new THREE.BoxGeometry(2, 1.3, 0.06), createMaterial(0x0b1d4d, 0.4, 0.3), 0, 0.7, -0.62);
    screen.rotation.x = -0.18;
    laptop.add(screen);

    const screenFront = createMesh(
      new THREE.PlaneGeometry(1.8, 1.1),
      new THREE.MeshBasicMaterial({
        map: createTextTexture('</>', 256, 160, '#1558c9', '#ffffff', 'bold 90px monospace'),
      }),
      0,
      0.7,
      -0.58
    );
    screenFront.rotation.x = -0.18;
    laptop.add(screenFront);
    laptop.position.set(2, -1.3, 0.8);
    laptop.rotation.y = -0.5;
    group.add(laptop);

    // Server Group
    const server = new THREE.Group();
    for (let k = 0; k < 3; k++) {
      server.add(createMesh(new THREE.BoxGeometry(1.5, 0.38, 1.1), createMaterial(0x2b6be6, 0.5, 0.2), 0, k * 0.46, 0));
      for (let q = 0; q < 3; q++) {
        server.add(
          createMesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), -0.5 + q * 0.18, k * 0.46, 0.56)
        );
      }
    }
    server.position.set(-2.4, -1.8, 0.9);
    server.rotation.y = 0.5;
    group.add(server);

    // Floating Orbs
    const orbs: THREE.Mesh[] = [];
    for (let j = 0; j < 9; j++) {
      const orb = createMesh(
        new THREE.SphereGeometry(0.2 + Math.random() * 0.2, 24, 24),
        createMaterial(GOOGLE_COLORS[j % 4], 0.3, 0.2)
      );
      orb.userData = {
        a: j,
        r: 3 + Math.random() * 1.6,
        s: 0.3 + Math.random() * 0.4,
        y: Math.random() * 3 - 1.5,
      };
      scene.add(orb);
      orbs.push(orb);
    }

    // Gold Orbit Ring
    const orbitRing = createMesh(
      new THREE.TorusGeometry(3.4, 0.02, 8, 120),
      new THREE.MeshBasicMaterial({ color: 0xe6c36a, transparent: true, opacity: 0.6 })
    );
    orbitRing.rotation.x = 1.3;
    scene.add(orbitRing);
    scene.add(group);

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(cv);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;
      const s = time * 0.001;

      cloud.rotation.y = Math.sin(s * 0.6) * 0.4;
      cloud.position.y = 1 + Math.sin(s) * 0.12;
      laptop.position.y = -1.3 + Math.sin(s * 1.2) * 0.1;
      server.position.y = -1.8 + Math.cos(s) * 0.1;
      orbitRing.rotation.z = s * 0.2;

      orbs.forEach((o) => {
        const u = o.userData;
        const a = u.a + s * u.s;
        o.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 2) * 0.4, Math.sin(a) * u.r * 0.5);
      });

      camera.position.x += (mx * 3 - camera.position.x) * 0.05;
      camera.position.y += (-my * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  // Scene 2: Awards & Swags Canvas (3D Bottle, T-Shirt, Bag, Badges)
  useEffect(() => {
    const cv = awardsCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dLight.position.set(4, 6, 6);
    scene.add(dLight);
    const pLight = new THREE.PointLight(0xe6c36a, 1, 30);
    pLight.position.set(-5, -2, 5);
    scene.add(pLight);

    const group = new THREE.Group();
    const darkMat = createMaterial(0x111318, 0.2, 0.5);

    // 3D Bottle
    const bottle = new THREE.Group();
    bottle.add(createMesh(new THREE.CylinderGeometry(0.42, 0.42, 2, 32), createMaterial(0xffffff, 0.1, 0.15)));
    bottle.add(createMesh(new THREE.CylinderGeometry(0.43, 0.43, 0.12, 32), createMaterial(0xc9ced8, 0.9, 0.2), 0, -1, 0));
    bottle.add(createMesh(new THREE.CylinderGeometry(0.22, 0.3, 0.3, 24), createMaterial(0xb9bfca, 0.9, 0.2), 0, 1.15, 0));
    bottle.add(createMesh(new THREE.TorusGeometry(0.2, 0.05, 8, 20), createMaterial(0xb9bfca, 0.9, 0.2), 0.12, 1.45, 0));

    const bottleLogo = createMesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({
        map: createTextTexture('☁ Cloud', 128, 128, null, '#4285F4', 'bold 28px sans-serif'),
        transparent: true,
      }),
      0,
      0.1,
      0.43
    );
    bottle.add(bottleLogo);
    bottle.position.set(-3.2, 0, 0);
    group.add(bottle);

    // 3D T-Shirt
    const tee = new THREE.Group();
    tee.add(createMesh(new THREE.BoxGeometry(1.7, 2, 0.18), darkMat));
    [-1, 1].forEach((d) => {
      const sl = createMesh(new THREE.BoxGeometry(0.9, 0.55, 0.18), darkMat, d * 1.2, 0.72, 0);
      sl.rotation.z = -d * 0.6;
      tee.add(sl);
    });
    tee.add(
      createMesh(
        new THREE.PlaneGeometry(1.3, 0.7),
        new THREE.MeshBasicMaterial({
          map: createTextTexture('Google Cloud', 256, 128, null, '#ffffff', 'bold 34px sans-serif'),
          transparent: true,
        }),
        0,
        0.3,
        0.1
      )
    );
    tee.position.set(-0.8, 0.1, 0);
    group.add(tee);

    // 3D Bag
    const bag = new THREE.Group();
    bag.add(createMesh(new THREE.BoxGeometry(1.7, 1, 0.6), darkMat));
    bag.add(createMesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24, Math.PI), createMaterial(0x222222, 0.3, 0.4), 0, 0.5, 0));
    bag.add(
      createMesh(
        new THREE.PlaneGeometry(1, 0.3),
        new THREE.MeshBasicMaterial({
          map: createTextTexture('Google Cloud', 256, 64, null, '#ffffff', 'bold 30px sans-serif'),
          transparent: true,
        }),
        0,
        0,
        0.31
      )
    );
    bag.position.set(1.8, -0.5, 0);
    group.add(bag);

    // 3D ID Card
    const card = createMesh(new THREE.BoxGeometry(1.2, 0.75, 0.05), createMaterial(0x0e1118, 0.4, 0.3), 3.4, -0.7, 0.3);
    card.rotation.z = 0.2;
    group.add(card);

    // 3D Medals
    const medals: THREE.Group[] = [];
    [['5', 0.9], ['10', 0.9]].forEach(([num], i) => {
      const medGroup = new THREE.Group();
      const cylinder = createMesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.12, 48),
        createMaterial(0xe6c36a, 0.95, 0.2)
      );
      cylinder.rotation.x = Math.PI / 2;

      const numFace = createMesh(
        new THREE.PlaneGeometry(0.9, 0.9),
        new THREE.MeshBasicMaterial({
          map: createTextTexture(num, 128, 128, null, '#5a4310', '900 80px serif'),
          transparent: true,
        }),
        0,
        0.07,
        0
      );
      numFace.rotation.x = -Math.PI / 2;
      cylinder.add(numFace);

      medGroup.add(cylinder);
      medGroup.position.set(i ? 2.2 : -2, 1.7, 0.6);
      group.add(medGroup);
      medals.push(medGroup);
    });

    scene.add(group);

    // Floating particles
    const particles: THREE.Mesh[] = [];
    for (let j = 0; j < 8; j++) {
      const p = createMesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        createMaterial(GOOGLE_COLORS[j % 4], 0.3, 0.2),
        Math.random() * 10 - 5,
        Math.random() * 4 - 2,
        -2
      );
      p.userData = { offset: j };
      scene.add(p);
      particles.push(p);
    }

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(cv);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;
      const s = time * 0.001;

      group.rotation.y = Math.sin(s * 0.5) * 0.45;
      bottle.position.y = Math.sin(s) * 0.1;
      tee.position.y = 0.1 + Math.cos(s * 1.1) * 0.1;
      bag.position.y = -0.5 + Math.sin(s * 0.9) * 0.1;

      medals.forEach((m, idx) => {
        m.rotation.z = s * (1 + idx * 0.4);
      });

      particles.forEach((p) => {
        p.position.y += Math.sin(s + p.userData.offset) * 0.004;
      });

      camera.position.x += (mx * 3 - camera.position.x) * 0.05;
      camera.position.y += (-my * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  // Scene 3: Campus Building Canvas (3D NECN Model)
  useEffect(() => {
    const cv = campusCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9.5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dLight.position.set(4, 6, 6);
    scene.add(dLight);
    const pLight = new THREE.PointLight(0xe6c36a, 1, 30);
    pLight.position.set(-5, -2, 5);
    scene.add(pLight);

    const building = new THREE.Group();
    const creamMat = createMaterial(0xf0dfae, 0, 0.7);

    // Main blocks
    building.add(createMesh(new THREE.BoxGeometry(7, 2.4, 1.8), creamMat, 0, 0, 0));
    building.add(createMesh(new THREE.BoxGeometry(1.8, 2.8, 2.2), createMaterial(0xe6d196, 0, 0.7), 0, 0.1, 0.2));
    building.add(createMesh(new THREE.BoxGeometry(7.2, 0.12, 2), createMaterial(0xb8a36a, 0, 0.6), 0, 1.25, 0));

    // Windows Matrix
    const windowMat = createMaterial(0x1c2a55, 0.6, 0.2, {
      emissive: 0x335599,
      emissiveIntensity: 0.5,
    });
    for (let r = 0; r < 3; r++) {
      for (let c = -6; c <= 6; c++) {
        if (Math.abs(c) < 2) continue;
        building.add(createMesh(new THREE.BoxGeometry(0.34, 0.4, 0.05), windowMat, c * 0.5, -0.7 + r * 0.75, 0.91));
      }
    }

    // Narayana Banner
    building.add(
      createMesh(
        new THREE.PlaneGeometry(2.4, 0.28),
        new THREE.MeshBasicMaterial({
          map: createTextTexture('NARAYANA ENGINEERING COLLEGE', 512, 64, '#c8232c', '#ffffff', 'bold 34px sans-serif'),
        }),
        0,
        1.55,
        0
      )
    );

    // Porch & Pillars
    building.add(createMesh(new THREE.BoxGeometry(2.6, 0.1, 1.4), creamMat, 0, -0.7, 1.3));
    [-1, 1].forEach((d) => {
      building.add(createMesh(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 12), creamMat, d * 1.1, -0.1, 1.8));
    });

    // Trees
    for (let i = 0; i < 9; i++) {
      const x = -5 + i * 1.3 + Math.random() * 0.5;
      const z = 1.6 + Math.random() * 0.7;
      const h = 0.5 + Math.random() * 0.5;
      building.add(createMesh(new THREE.CylinderGeometry(0.05, 0.07, h, 8), createMaterial(0x6b4a2b), x, -1.2 + h / 2, z));
      building.add(createMesh(new THREE.SphereGeometry(0.4 + Math.random() * 0.2, 16, 16), createMaterial(0x2f9e4f, 0, 0.8), x, -1 + h, z));
    }

    // Clouds
    for (let q = 0; q < 10; q++) {
      building.add(
        createMesh(
          new THREE.SphereGeometry(0.6 + Math.random() * 0.5, 24, 24),
          createMaterial(0xffffff, 0, 0.3, {
            emissive: 0xaacfff,
            emissiveIntensity: 0.15,
          }),
          -6 + q * 1.3,
          -1.6,
          1 + Math.random()
        )
      );
    }

    building.position.y = 0.3;
    scene.add(building);

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(cv);

    const render = (time: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;
      const s = time * 0.001;

      building.rotation.y = Math.sin(s * 0.4) * 0.5;
      building.rotation.x = 0.12;

      camera.position.x += (mx * 3 - camera.position.x) * 0.05;
      camera.position.y += (-my * 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="luxury-3d-root relative w-full text-[#14182b] overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-900 pb-28">
      {/* LUXURY AMBIENT BACKGROUND */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at 20% 0%, #F0E9D8, #FBF8F1 60%)',
        }}
      />

      {/* =========================================================================
          SECTION 1: HERO & 3D CLOUD SCENE
          ========================================================================= */}
      <section id="overview" className="max-w-[1180px] mx-auto px-5 pt-8 sm:pt-14 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[85vh]">
          {/* Left Hero Column */}
          <div className="space-y-4">
            {/* Partners Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-bold">
              {/* GDG */}
              <div className="flex items-center gap-2">
                <svg width="34" height="20" viewBox="0 0 38 22">
                  <path d="M10 3 2 11l8 8" stroke="#EA4335" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="m28 3 8 8-8 8" stroke="#34A853" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="m22 2-6 18" stroke="#FBBC04" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span>GDG On Campus</span>
              </div>
              <i className="w-px h-5 bg-amber-400/40" />
              {/* Narayana */}
              <div className="flex items-center gap-2">
                <svg width="20" height="24" viewBox="0 0 22 26">
                  <path d="M1 1h20v14c0 6-6 9-10 10C7 24 1 21 1 15z" fill="#1c3f94" />
                  <path d="M6 18V8l10 10V8" stroke="#fff" strokeWidth="2.4" fill="none" />
                </svg>
                <span className="truncate max-w-[160px] sm:max-w-none">Narayana Engineering College</span>
              </div>
              <i className="w-px h-5 bg-amber-400/40" />
              {/* Google Cloud */}
              <div className="flex items-center gap-2">
                <svg width="30" height="20" viewBox="0 0 34 22">
                  <circle cx="11" cy="13" r="7" fill="#EA4335" />
                  <circle cx="19" cy="9" r="8" fill="#4285F4" />
                  <circle cx="26" cy="14" r="6" fill="#34A853" />
                  <circle cx="16" cy="15" r="5" fill="#FBBC04" />
                </svg>
                <span>Google Cloud</span>
              </div>
            </div>

            {/* Eyebrow */}
            <div className="tracking-[0.35em] text-[11px] font-extrabold uppercase text-[#B8922D]">
              Same Labs · Bigger Opportunities
            </div>

            {/* Main Title */}
            <h1 className="luxury-serif font-black leading-[0.95] text-[clamp(42px,7vw,92px)] tracking-tight">
              <small className="block text-[0.62em] tracking-tight text-[#1c3f94]">NECN</small>
              <span className="text-[#4285F4]">Cloud </span>
              <span className="text-[#EA4335]">Ch</span>
              <span className="text-[#FBBC04]">am</span>
              <span className="text-[#34A853]">pions</span>
            </h1>

            {/* Program Pill */}
            <div className="inline-block px-5 py-2 rounded-full border border-amber-300/60 bg-white/70 backdrop-blur-md font-bold text-sm shadow-sm">
              Google Cloud Learn with <b className="text-[#4285F4]">Communities</b> 2026
            </div>

            {/* Tagline Colored Badges */}
            <div className="flex gap-3 flex-wrap font-extrabold tracking-wide text-xs sm:text-sm pt-2">
              <span className="border-b-4 border-[#4285F4] pb-1">Learn.</span>
              <span className="border-b-4 border-[#EA4335] pb-1">Build.</span>
              <span className="border-b-4 border-[#FBBC04] pb-1">Earn.</span>
              <span className="border-b-4 border-[#34A853] pb-1">Achieve.</span>
            </div>

            {/* Script Text */}
            <div className="luxury-script text-2xl sm:text-3xl text-[#B8922D] font-bold">
              Same Labs. Bigger Opportunities!
            </div>

            {/* Dynamic Counter Stats */}
            <div className="flex gap-8 pt-2">
              <div>
                <b className="luxury-gold luxury-serif text-3xl sm:text-4xl block leading-tight font-black">
                  {counterValue}
                </b>
                <span className="text-[11px] text-slate-500 tracking-[0.15em] uppercase font-semibold">
                  Registered Champions
                </span>
              </div>
              <div>
                <b className="luxury-gold luxury-serif text-3xl sm:text-4xl block leading-tight font-black">
                  10
                </b>
                <span className="text-[11px] text-slate-500 tracking-[0.15em] uppercase font-semibold">
                  Course Curriculum
                </span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex gap-3 flex-wrap pt-4">
              <a
                href="#leaderboard"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-br from-[#B8922D] via-[#E6C36A] to-[#B8922D] text-[#1a1405] font-black text-xs sm:text-sm tracking-wide shadow-[0_12px_32px_rgba(184,146,45,0.4)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🏆</span>
                <span>Explore Leaderboard</span>
              </a>
              <a
                href="#journey"
                className="px-6 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-300/50 text-[#14182b] font-bold text-xs sm:text-sm shadow-sm hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Learning Path</span>
              </a>
              <a
                href="#awards"
                className="px-6 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-amber-300/50 text-[#14182b] font-bold text-xs sm:text-sm shadow-sm hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🎁 Swag Rewards</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Hero Canvas */}
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[560px] flex items-center justify-center">
            <canvas ref={heroCanvasRef} className="w-full h-full block rounded-3xl" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 3D TILT CARDS (LEARN · EARN · BUILD)
          ========================================================================= */}
      <section className="max-w-[1180px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="luxury-tilt luxury-rv group cursor-default">
            <div className="w-14 h-14 rounded-full bg-[#4285F4] text-white flex items-center justify-center text-2xl mb-4 shadow-lg">
              ☁️
            </div>
            <h3 className="text-xl font-bold mb-1 text-slate-900">Learn</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              In-demand cloud skills through official hands-on labs and architecture solutions.
            </p>
          </div>

          <div className="luxury-tilt luxury-rv group cursor-default">
            <div className="w-14 h-14 rounded-full bg-[#FBBC04] text-slate-950 flex items-center justify-center text-2xl mb-4 shadow-lg">
              ✦
            </div>
            <h3 className="text-xl font-bold mb-1 text-slate-900">Earn</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Official Google credentials and verifiable skill badges for every milestone completed.
            </p>
          </div>

          <div className="luxury-tilt luxury-rv group cursor-default">
            <div className="w-14 h-14 rounded-full bg-[#34A853] text-white flex items-center justify-center text-2xl mb-4 shadow-lg">
              📊
            </div>
            <h3 className="text-xl font-bold mb-1 text-slate-900">Build</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Empower your professional Google developer profile for top-tier industry opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE 3D INTERACTIVE PODIUM
          ========================================================================= */}
      <section id="leaderboard" className="max-w-[1180px] mx-auto px-5 py-16 text-center">
        <h2 className="luxury-serif text-3xl sm:text-5xl font-black mb-2 luxury-rv">
          <span className="luxury-gold">The 3D Podium</span>
        </h2>
        <p className="text-slate-600 max-w-md mx-auto mb-10 text-sm luxury-rv">
          Move your mouse across the stage to rotate the 3D podium. Click any champion to view their verified profile.
        </p>

        {/* 3D Interactive Stage */}
        <div ref={stageRef} id="stage" className="luxury-stage luxury-rv">
          <div ref={siRef} id="si" className="luxury-si">
            {/* Rank 2 (Silver) */}
            <div
              onClick={() => champion2 && onNavigate('students', champion2.id)}
              className={`luxury-pod luxury-p2 ${podiumInView ? 'pod-in' : ''} cursor-pointer group hover:brightness-105 transition-all`}
              title={champion2 ? `Click to view verified profile of ${champion2.fullName}` : undefined}
            >
              {/* Champion Avatar */}
              <div className="relative mb-2 shrink-0 z-10">
                <Avatar
                  name={champion2 ? champion2.fullName : 'Champion #2'}
                  rank={2}
                  size="lg"
                  className="shadow-xl ring-2 sm:ring-4 ring-slate-300/90 transform transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              {/* Rank Number */}
              <b className="text-xl sm:text-2xl md:text-3xl text-slate-900 leading-none mb-1 font-black">2</b>

              {/* Full Name (No Ellipsis, Clean Multi-line Wrap) */}
              <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-slate-900 px-1 sm:px-2 text-center whitespace-normal break-words leading-tight tracking-tight">
                {champion2 ? champion2.fullName : 'Champion #2'}
              </span>

              {/* Points & Badges */}
              <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-slate-800 font-bold mt-1.5 px-2 py-0.5 rounded-full bg-slate-900/10">
                {champion2 ? `${champion2.points} pts · 10 Badges` : ''}
              </span>
            </div>

            {/* Rank 1 (Gold with Crown) */}
            <div
              onClick={() => champion1 && onNavigate('students', champion1.id)}
              className={`luxury-pod luxury-p1 ${podiumInView ? 'pod-in' : ''} cursor-pointer group hover:brightness-105 transition-all`}
              title={champion1 ? `Click to view verified profile of ${champion1.fullName}` : undefined}
            >
              {/* Floating Crown Bobbing Above Avatar */}
              <i className="luxury-crown" aria-hidden="true">👑</i>

              {/* Champion Avatar */}
              <div className="relative mb-2 shrink-0 z-10">
                <Avatar
                  name={champion1 ? champion1.fullName : 'Champion #1'}
                  rank={1}
                  size="lg"
                  className="shadow-2xl ring-2 sm:ring-4 ring-amber-300/90 transform transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              {/* Rank Number */}
              <b className="text-2xl sm:text-3xl md:text-4xl text-[#1a1405] leading-none mb-1 font-black">1</b>

              {/* Full Name (No Ellipsis, Clean Multi-line Wrap) */}
              <span className="text-xs sm:text-sm md:text-base font-black text-[#1a1405] px-1 sm:px-2 text-center whitespace-normal break-words leading-tight tracking-tight">
                {champion1 ? champion1.fullName : 'Champion #1'}
              </span>

              {/* Points & Badges */}
              <span className="text-[10px] sm:text-xs font-mono text-[#1a1405] font-bold mt-1.5 px-2.5 py-0.5 rounded-full bg-[#1a1405]/10">
                {champion1 ? `${champion1.points} pts · 10 Badges` : ''}
              </span>
            </div>

            {/* Rank 3 (Bronze) */}
            <div
              onClick={() => champion3 && onNavigate('students', champion3.id)}
              className={`luxury-pod luxury-p3 ${podiumInView ? 'pod-in' : ''} cursor-pointer group hover:brightness-105 transition-all`}
              title={champion3 ? `Click to view verified profile of ${champion3.fullName}` : undefined}
            >
              {/* Champion Avatar */}
              <div className="relative mb-2 shrink-0 z-10">
                <Avatar
                  name={champion3 ? champion3.fullName : 'Champion #3'}
                  rank={3}
                  size="lg"
                  className="shadow-xl ring-2 sm:ring-4 ring-amber-700/70 transform transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              {/* Rank Number */}
              <b className="text-xl sm:text-2xl md:text-3xl text-[#1a1405] leading-none mb-1 font-black">3</b>

              {/* Full Name (No Ellipsis, Clean Multi-line Wrap) */}
              <span className="text-[11px] sm:text-xs md:text-sm font-extrabold text-[#1a1405] px-1 sm:px-2 text-center whitespace-normal break-words leading-tight tracking-tight">
                {champion3 ? champion3.fullName : 'Champion #3'}
              </span>

              {/* Points & Badges */}
              <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#1a1405] font-bold mt-1.5 px-2 py-0.5 rounded-full bg-[#1a1405]/10">
                {champion3 ? `${champion3.points} pts · 10 Badges` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button to Full Table */}
        <div className="pt-10 flex flex-col items-center gap-3">
          <button
            onClick={() => onNavigate('leaderboard')}
            className="px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-300/60 shadow-md text-xs font-extrabold text-slate-800 hover:text-blue-600 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <span>📊</span>
            <span>View Complete 438-Student Cohort Leaderboard</span>
          </button>
          <p className="text-xs text-slate-500">
            Live rankings verified with Google Cloud official records.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LEARNING PATH & 10-COURSE GRID
          ========================================================================= */}
      <section id="journey" className="max-w-[1180px] mx-auto px-5 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Note Card */}
          <div className="luxury-note luxury-rv">
            <h3 className="font-extrabold text-[#B8922D] tracking-widest text-xs uppercase mb-3">
              YOUR LEARNING PATH
            </h3>
            <ul className="space-y-2 m-0 p-0">
              <li className="list-none py-2 pl-9 relative font-bold border-b border-dashed border-amber-300/50">
                <span className="absolute left-0 top-1.5 w-6 h-6 rounded-md bg-[#34A853] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Complete Labs
              </li>
              <li className="list-none py-2 pl-9 relative font-bold border-b border-dashed border-amber-300/50">
                <span className="absolute left-0 top-1.5 w-6 h-6 rounded-md bg-[#34A853] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Earn Badges
              </li>
              <li className="list-none py-2 pl-9 relative font-bold border-b border-dashed border-amber-300/50">
                <span className="absolute left-0 top-1.5 w-6 h-6 rounded-md bg-[#34A853] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Win Swags
              </li>
              <li className="list-none py-2 pl-9 relative font-bold border-b border-dashed border-amber-300/50">
                <span className="absolute left-0 top-1.5 w-6 h-6 rounded-md bg-[#34A853] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Build Your Future
              </li>
              <li className="list-none py-2 pl-9 relative font-bold">
                <span className="absolute left-0 top-1.5 w-6 h-6 rounded-md bg-[#34A853] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
                Be Future Ready!
              </li>
            </ul>
          </div>

          {/* 10-Course Journey */}
          <div>
            <h2 className="luxury-serif text-3xl sm:text-4xl font-black mb-2 text-left luxury-rv">
              <span className="luxury-gold">10-Course</span> Journey
            </h2>
            <p className="text-slate-600 text-sm mb-6 text-left luxury-rv">
              Ten structured steps from your first lab to production readiness. Hover a tile to tilt it in 3D.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {officialCourses.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate('journey')}
                  className="luxury-tilt luxury-rv cursor-pointer p-3.5 text-center group hover:scale-105 transition-all"
                  style={{
                    borderColor: `${CSS_COLORS[i % 4]}55`,
                  }}
                >
                  <span
                    className="luxury-serif text-2xl font-black block"
                    style={{ color: CSS_COLORS[i % 4] }}
                  >
                    {c.courseNumber}
                  </span>
                  <p className="text-[11px] font-semibold text-slate-700 truncate mt-1">
                    {c.category}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: REWARDS & 3D SWAG SHOWCASE
          ========================================================================= */}
      <section id="awards" className="max-w-[1180px] mx-auto px-5 py-16 text-center">
        <h2 className="luxury-serif text-3xl sm:text-5xl font-black mb-2 luxury-rv">
          <span className="luxury-gold">Rewards</span> &amp; Swags
        </h2>
        <p className="text-slate-600 max-w-lg mx-auto mb-8 text-sm luxury-rv">
          Win exciting official Google Cloud swags: bottle, tee, bag, and more. Move your mouse across the scene to explore.
        </p>

        {/* 3D WebGL Swag Canvas */}
        <div className="relative w-full h-[360px] sm:h-[460px] flex items-center justify-center mb-8">
          <canvas ref={awardsCanvasRef} className="w-full h-full block rounded-3xl" />
        </div>

        {/* 3D Floating Seals */}
        <div className="flex gap-4 justify-center flex-wrap pt-2">
          <div className="luxury-bdg">
            <div>
              <b className="text-3xl block leading-none">5</b>
              <span className="text-[11px] uppercase font-bold tracking-wider">Badges</span>
            </div>
          </div>
          <div className="luxury-bdg" style={{ animationDelay: '0.6s' }}>
            <div>
              <b className="text-3xl block leading-none">10</b>
              <span className="text-[11px] uppercase font-bold tracking-wider">Badges</span>
            </div>
          </div>
          <div
            className="luxury-bdg"
            style={{
              animationDelay: '1.2s',
              background: 'radial-gradient(circle at 30% 25%, #d8e6ff, #4285F4)',
              color: '#ffffff',
            }}
          >
            <div>
              <b className="text-3xl block leading-none">🏆</b>
              <span className="text-[11px] uppercase font-bold tracking-wider">Win Swags!</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CAMPUS SHOWCASE & 3D NECN BUILDING
          ========================================================================= */}
      <section id="about" className="max-w-[1180px] mx-auto px-5 py-16 text-center">
        <h2 className="luxury-serif text-3xl sm:text-5xl font-black mb-2 luxury-rv">
          Our <span className="luxury-gold">Campus</span>
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-8 text-sm luxury-rv leading-relaxed">
          Official Google Cloud Learning &amp; Achievement Leaderboard for GDG On Campus, Narayana Engineering College, Nellore (Autonomous).
        </p>

        {/* 3D WebGL Campus Building Canvas */}
        <div className="relative w-full h-[380px] sm:h-[480px] flex items-center justify-center">
          <canvas ref={campusCanvasRef} className="w-full h-full block rounded-3xl" />
        </div>
      </section>

      {/* FOOTER NOTICE */}
      <footer className="text-center py-8 px-4 text-xs text-slate-500 font-medium">
        GDG on Campus NECN · Google Cloud Learn with Communities 2026 · Narayana Engineering College, Nellore
      </footer>

      {/* =========================================================================
          FLOATING DOCK NAVIGATION
          ========================================================================= */}
      <nav
        aria-label="Luxury 3D Dock Navigation"
        className="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 flex items-center gap-1.5 p-2 rounded-2xl bg-white/80 backdrop-blur-2xl border border-amber-300/50 shadow-[0_16px_40px_rgba(60,45,10,0.18)]"
      >
        <a
          href="#overview"
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSection === 'overview'
              ? 'bg-gradient-to-br from-[#B8922D] to-[#E6C36A] text-[#1a1405] shadow-sm -translate-y-0.5'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </a>
        <a
          href="#leaderboard"
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSection === 'leaderboard'
              ? 'bg-gradient-to-br from-[#B8922D] to-[#E6C36A] text-[#1a1405] shadow-sm -translate-y-0.5'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Leaderboard
        </a>
        <a
          href="#journey"
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSection === 'journey'
              ? 'bg-gradient-to-br from-[#B8922D] to-[#E6C36A] text-[#1a1405] shadow-sm -translate-y-0.5'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Journey
        </a>
        <a
          href="#awards"
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSection === 'awards'
              ? 'bg-gradient-to-br from-[#B8922D] to-[#E6C36A] text-[#1a1405] shadow-sm -translate-y-0.5'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Awards
        </a>
        <a
          href="#about"
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
            activeSection === 'about'
              ? 'bg-gradient-to-br from-[#B8922D] to-[#E6C36A] text-[#1a1405] shadow-sm -translate-y-0.5'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          About
        </a>
      </nav>
    </div>
  );
};

