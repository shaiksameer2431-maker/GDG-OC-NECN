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

    return () => {
      observer.disconnect();
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
  const createMaterial = (
    color: number | string,
    metalness = 0,
    roughness = 0.3,
    extra: Record<string, any> = {}
  ) => {
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

  // Rounded Box Extrude Geometry
  const rb = (w: number, h: number, d: number, r: number) => {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: d,
      bevelEnabled: true,
      bevelThickness: r * 0.4,
      bevelSize: r * 0.4,
      bevelSegments: 4,
      curveSegments: 10,
    });
    g.translate(0, 0, -d / 2);
    return g;
  };

  // 3D Procedural Puff Clouds
  const puff = (n: number, sx: number, sy: number, z: number) => {
    const g = new THREE.Group();
    const m = createMaterial(0xffffff, 0, 1, {
      emissive: new THREE.Color(0x9db8e8),
      emissiveIntensity: 0.14,
    });
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * sx * z;
      const e = 1 - Math.abs(x) / (sx * z * 0.6);
      const r = (0.4 + Math.random() * 0.5) * z * Math.max(e, 0.45);
      const geo = new THREE.IcosahedronGeometry(r, 3);
      const p = geo.attributes.position;
      for (let k = 0; k < p.count; k++) {
        const f = 1 + Math.sin(p.getX(k) * 6 + i) * Math.cos(p.getY(k) * 5 + i * 2) * 0.07;
        p.setXYZ(k, p.getX(k) * f, p.getY(k) * f * 0.82, p.getZ(k) * f);
      }
      geo.computeVertexNormals();
      g.add(createMesh(geo, m, x, Math.random() * sy * z * Math.max(e, 0.2), (Math.random() - 0.5) * 0.9 * z));
    }
    return g;
  };

  // Google Cloud 3D Multi-Layered Extruded Logo with Light-Sweep Edge Shimmer Shader
  const logo3d = () => {
    const c = document.createElement('canvas');
    c.width = 1800;
    c.height = 1440;
    const x = c.getContext('2d')!;
    const X = (v: number) => (v - 494) * 6;
    const Y = (v: number) => (v - 112) * 6;
    const R = (a: number) => (a * Math.PI) / 180;
    const ci = (px: number, py: number, r: number) => {
      x.beginPath();
      x.arc(X(px), Y(py), r * 6, 0, 7);
      x.fill();
    };

    x.fillStyle = '#FFFFFF';
    ci(640, 225, 98);
    ci(583, 265, 73);
    ci(718, 258, 68);
    ci(726, 285, 60);

    x.strokeStyle = '#FF0000';
    x.lineWidth = 300;
    x.beginPath();
    x.arc(X(640), Y(225), 456, R(-192), R(-44), false);
    x.stroke();

    x.strokeStyle = '#0088FF';
    x.beginPath();
    x.arc(X(640), Y(225), 456, R(-44), R(18), false);
    x.stroke();

    x.fillStyle = '#0088FF';
    ci(718, 258, 70);
    ci(726, 285, 62);
    x.fillRect(X(648), Y(258), X(726) - X(648), Y(347) - Y(258));

    x.fillStyle = '#00B039';
    x.beginPath();
    x.moveTo(X(572), Y(298));
    x.lineTo(X(648), Y(298));
    x.lineTo(X(648), Y(347));
    x.lineTo(X(592), Y(347));
    x.quadraticCurveTo(X(556), Y(345), X(540), Y(326));
    x.closePath();
    x.fill();

    x.fillStyle = '#FFFFFF';
    ci(583, 268, 30);
    x.fillRect(X(583), Y(238), X(710) - X(583), Y(298) - Y(238));
    ci(700, 262, 37);
    ci(710, 269, 30);
    ci(640, 225, 51);
    x.fillRect(X(592), Y(208), X(650) - X(592), Y(240) - Y(208));
    x.fillRect(X(563), Y(286), X(576) - X(563), Y(298) - Y(286));

    x.strokeStyle = '#FFB400';
    x.lineWidth = 288;
    x.beginPath();
    x.arc(X(583), Y(265), 306, R(-41), R(120), true);
    x.stroke();

    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    const g = new THREE.Group();

    for (let k = 0; k < 10; k++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 3.04),
        new THREE.MeshBasicMaterial({
          map: t,
          alphaTest: 0.5,
          color: k ? new THREE.Color().setScalar(0.62 - 0.035 * k) : 0xffffff,
        })
      );
      m.position.z = -k * 0.025;
      g.add(m);
    }

    const ed = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.04),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          t: { value: t },
          u: { value: 0 },
        },
        vertexShader: `
          varying vec2 v;
          void main() {
            v = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D t;
          uniform float u;
          varying vec2 v;
          void main() {
            vec2 d = vec2(9.0 / 1800.0, 9.0 / 1440.0);
            float a = texture2D(t, v).a;
            float m = min(
              min(texture2D(t, v + vec2(d.x, 0.0)).a, texture2D(t, v - vec2(d.x, 0.0)).a),
              min(texture2D(t, v + vec2(0.0, d.y)).a, texture2D(t, v - vec2(0.0, d.y)).a)
            );
            float e = step(0.5, a) * (1.0 - step(0.5, m));
            vec2 p = v - vec2(0.5);
            float an = atan(p.y, p.x);
            float k1 = mod(u - an, 6.2831853);
            float k2 = mod(u + 3.14159265 - an, 6.2831853);
            float l = max(exp(-k1 * 2.2), exp(-k2 * 2.2));
            gl_FragColor = vec4(vec3(1.0, 0.96, 0.8) * 1.8, l * e);
          }
        `,
      })
    );
    ed.position.z = 0.03;
    g.add(ed);
    g.userData.ed = ed;
    return g;
  };

  // Tech rounded icon helper
  const bx = (w: number, h: number, c: number, x: number, y: number) => {
    return createMesh(
      rb(w, h, 0.06, Math.min(w, h) * 0.18),
      new THREE.MeshPhysicalMaterial({
        color: c,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
      }),
      x,
      y,
      0
    );
  };

  // Scene 1: Hero Canvas (3D Cloud, Laptop, Server Rack, Tech Icons, Rings, Dots, Orbs)
  useEffect(() => {
    const cv = heroCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

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

    const group = new THREE.Group();

    // 1. Google Cloud 3D Logo Cloud with sweeping edge shimmer
    const cl = logo3d();
    cl.position.set(-0.4, 1.15, 0);
    group.add(cl);

    // 2. Rounded 3D Laptop with </> Code Screen
    const lp = new THREE.Group();
    const lb = createMesh(rb(2, 1.3, 0.08, 0.1), createMaterial(0x1c3f94, 0.6, 0.2));
    lb.rotation.x = Math.PI / 2;
    lp.add(lb);
    const sr = createMesh(rb(2, 1.3, 0.05, 0.1), createMaterial(0x0b1d4d, 0.4, 0.3), 0, 0.7, -0.62);
    sr.rotation.x = -0.18;
    lp.add(sr);
    const sf = createMesh(
      new THREE.PlaneGeometry(1.8, 1.1),
      new THREE.MeshBasicMaterial({
        map: createTextTexture('</>', 1024, 640, '#1558c9', '#ffffff', 'bold 360px monospace'),
      }),
      0,
      0.7,
      -0.53
    );
    sf.rotation.x = -0.18;
    lp.add(sf);
    lp.position.set(2.3, -2.2, 0.8);
    lp.rotation.y = -0.5;
    group.add(lp);

    // 3. Rounded Server Stack with LED Indicators
    const sv = new THREE.Group();
    for (let k = 0; k < 3; k++) {
      sv.add(
        createMesh(
          rb(1.5, 0.34, 1.1, 0.08),
          new THREE.MeshPhysicalMaterial({
            color: 0x2b6be6,
            metalness: 0.3,
            roughness: 0.25,
            clearcoat: 1,
          }),
          0,
          k * 0.46,
          0
        )
      );
      for (let q = 0; q < 3; q++) {
        sv.add(
          createMesh(
            new THREE.SphereGeometry(0.04, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
            -0.5 + q * 0.18,
            k * 0.46,
            0.6
          )
        );
      }
    }
    sv.position.set(-2.5, -2.1, 0.9);
    sv.rotation.y = 0.5;
    group.add(sv);

    // 4. Floating Orbs in Google Colors
    const orbs: THREE.Mesh[] = [];
    for (let j = 0; j < 4; j++) {
      const o = createMesh(
        new THREE.SphereGeometry(0.2 + Math.random() * 0.2, 24, 24),
        createMaterial(GOOGLE_COLORS[j % 4], 0.3, 0.2)
      );
      o.userData = {
        a: j,
        r: 3 + Math.random() * 1.6,
        s: 0.3 + Math.random() * 0.4,
        y: Math.random() * 3 - 1.5,
      };
      group.add(o);
      orbs.push(o);
    }

    // 5. Orbital Concentric Rings
    const rings: THREE.Mesh[] = [];
    const ringConfigs: [number, number, number][] = [
      [2.9, 6.3, 0.5],
      [3.2, 5, 0.45],
      [3.55, 3.8, 0.4],
      [3.9, 6.3, 0.25],
    ];
    ringConfigs.forEach((p, i) => {
      const r = createMesh(
        new THREE.TorusGeometry(p[0], 0.014, 8, 160, p[1]),
        new THREE.MeshBasicMaterial({ color: 0x9aa3b8, transparent: true, opacity: p[2] }),
        -0.4,
        1.15,
        -0.3
      );
      r.rotation.z = i;
      group.add(r);
      rings.push(r);
    });

    // 6. 17 Floating Dots in Brand Google Colors
    const dots: THREE.Mesh[] = [];
    const dotConfigs: [number, number, number, number][] = [
      [471, 23, 0xe31b23, 5],
      [553, 21, 0xffd000, 10],
      [765, 35, 0x2d8cff, 17],
      [631, 79, 0x6cbf00, 8],
      [796, 85, 0xe31b23, 5],
      [791, 169, 0x6cbf00, 9],
      [913, 217, 0xffd000, 13],
      [410, 219, 0xe31b23, 11],
      [483, 219, 0x2d8cff, 6],
      [348, 283, 0xffd000, 5],
      [524, 353, 0xffd000, 9],
      [765, 357, 0x2d8cff, 9],
      [727, 393, 0xffd000, 5],
      [508, 433, 0xe31b23, 9],
      [623, 474, 0x2d8cff, 14],
      [792, 453, 0x6cbf00, 19],
      [864, 430, 0xe31b23, 13],
    ];
    dotConfigs.forEach((p, i) => {
      const d = createMesh(
        new THREE.CircleGeometry(p[3] * 0.0136, 64),
        new THREE.MeshBasicMaterial({ color: p[2] }),
        (p[0] - 650) * 0.0085,
        -(p[1] - 270) * 0.012 + 0.3,
        ((i % 5) - 2) * 0.4
      );
      d.userData = { y: d.position.y, s: 0.6 + (i % 4) * 0.25, p: i };
      group.add(d);
      dots.push(d);
    });

    // 7. Tech Icons
    const icons: THREE.Group[] = [];

    // pl (plus icon)
    const pl = new THREE.Group();
    pl.add(bx(0.6, 0.2, 0x4285f4, 0, 0));
    pl.add(bx(0.2, 0.6, 0x4285f4, 0, 0));
    const plPins: [number, number, number][] = [
      [-0.27, 0.27, 0xf4b400],
      [0.27, 0.27, 0xdb4437],
      [-0.27, -0.27, 0xdb4437],
      [0.27, -0.27, 0xf4b400],
    ];
    plPins.forEach((q) => {
      const m = createMesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16), createMaterial(q[2], 0.1, 0.4), q[0], q[1], 0);
      m.rotation.x = Math.PI / 2;
      pl.add(m);
    });
    pl.position.set(-3.2, 2.3, 0.4);

    // lo (layers icon)
    const lo = new THREE.Group();
    lo.add(bx(0.57, 0.11, 0xf4b400, 0, 0.18));
    lo.add(bx(0.33, 0.33, 0x4285f4, -0.12, -0.07));
    lo.add(bx(0.22, 0.19, 0x0f9d58, 0.18, 0));
    lo.add(bx(0.22, 0.11, 0xdb4437, 0.18, -0.18));
    lo.position.set(3.1, 2.2, 0.4);

    // eq (equalizer icon)
    const eq = new THREE.Group();
    const eqBars: [number, number][] = [
      [0.3, 0x4285f4],
      [0.5, 0xf4b400],
      [0.38, 0xdb4437],
      [0.25, 0x0f9d58],
    ];
    eqBars.forEach((b, i) => {
      eq.add(bx(0.12, b[0], b[1], -0.27 + i * 0.18, 0));
    });
    eq.position.set(-3.4, 0.3, 0.4);

    [pl, lo, eq].forEach((o) => {
      o.scale.setScalar(1.3);
      o.userData = { y: o.position.y };
      group.add(o);
      icons.push(o);
    });

    scene.add(group);

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (w < 480) {
        group.scale.setScalar(0.72);
      } else if (w < 768) {
        group.scale.setScalar(0.85);
      } else {
        group.scale.setScalar(0.96);
      }
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

      if (cl.userData.ed?.material?.uniforms?.u) {
        cl.userData.ed.material.uniforms.u.value = s * 1.4;
      }
      lp.position.y = -2.2 + Math.sin(s * 1.2) * 0.1;
      sv.position.y = -2.1 + Math.cos(s) * 0.1;
      rings.forEach((r, i) => {
        r.rotation.z = s * (0.12 + i * 0.07) * (i % 2 ? -1 : 1);
      });
      dots.forEach((d) => {
        d.position.y = d.userData.y + Math.sin(s * d.userData.s + d.userData.p) * 0.12;
      });
      icons.forEach((c, i) => {
        c.rotation.y = Math.sin(s * 0.8 + i) * 0.4;
        c.position.y = c.userData.y + Math.sin(s + i * 2) * 0.08;
      });
      orbs.forEach((o) => {
        const u = o.userData;
        const a = u.a + s * u.s;
        o.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 2) * 0.4, Math.sin(a) * u.r * 0.5);
      });

      // Smooth mouse parallax
      camera.position.x += (mx * 2.5 - camera.position.x) * 0.05;
      camera.position.y += (-my * 1.8 - camera.position.y) * 0.05;
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

  // Scene 2: Awards & Swags Canvas (Bottle, Tee, Bag, Certificate, Labels, Medals, Particles)
  useEffect(() => {
    const cv = awardsCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

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

    const group = new THREE.Group();
    const darkMat = createMaterial(0x111318, 0.2, 0.5);

    // 1. Water Bottle
    const bt = new THREE.Group();
    bt.add(createMesh(new THREE.CylinderGeometry(0.42, 0.42, 2, 32), createMaterial(0xffffff, 0.1, 0.15)));
    bt.add(createMesh(new THREE.CylinderGeometry(0.43, 0.43, 0.12, 32), createMaterial(0xc9ced8, 0.9, 0.2), 0, -1, 0));
    bt.add(createMesh(new THREE.CylinderGeometry(0.22, 0.3, 0.3, 24), createMaterial(0xb9bfca, 0.9, 0.2), 0, 1.15, 0));
    bt.add(createMesh(new THREE.TorusGeometry(0.2, 0.05, 8, 20), createMaterial(0xb9bfca, 0.9, 0.2), 0.12, 1.45, 0));
    const lg = createMesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({
        map: createTextTexture('☁ Cloud', 128, 128, null, '#4285F4', 'bold 28px sans-serif'),
        transparent: true,
      }),
      0,
      0.1,
      0.43
    );
    bt.add(lg);
    bt.position.set(-4.4, 0, 0);
    group.add(bt);

    // 2. Cloth T-Shirt with vertex displacement and cotton bump texture
    const te = new THREE.Group();
    const sh = new THREE.Shape();
    sh.moveTo(-0.55, 1.1);
    sh.lineTo(-1.3, 0.85);
    sh.lineTo(-1.85, 0.15);
    sh.lineTo(-1.45, -0.15);
    sh.lineTo(-0.97, 0.25);
    sh.lineTo(-0.97, -1.1);
    sh.lineTo(0.97, -1.1);
    sh.lineTo(0.97, 0.25);
    sh.lineTo(1.45, -0.15);
    sh.lineTo(1.85, 0.15);
    sh.lineTo(1.3, 0.85);
    sh.lineTo(0.55, 1.1);
    sh.quadraticCurveTo(0, 0.5, -0.55, 1.1);

    const tg = new THREE.ExtrudeGeometry(sh, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 20,
    });
    const tp = tg.attributes.position;
    for (let v = 0; v < tp.count; v++) {
      tp.setZ(v, tp.getZ(v) + Math.sin(tp.getX(v) * 4 + tp.getY(v) * 2.5) * 0.03);
    }
    tg.computeVertexNormals();

    const nz = document.createElement('canvas');
    nz.width = nz.height = 64;
    const nx = nz.getContext('2d')!;
    for (let a = 0; a < 64; a++) {
      for (let b = 0; b < 64; b++) {
        const gv = 110 + Math.random() * 90;
        nx.fillStyle = `rgb(${gv},${gv},${gv})`;
        nx.fillRect(a, b, 1, 1);
      }
    }
    const nt = new THREE.CanvasTexture(nz);
    nt.wrapS = nt.wrapT = THREE.RepeatWrapping;
    nt.repeat.set(8, 8);

    te.add(createMesh(tg, createMaterial(0x181b22, 0, 1, { bumpMap: nt, bumpScale: 0.8 }), 0, 0, 0));
    const col = createMesh(new THREE.TorusGeometry(0.5, 0.05, 10, 28, Math.PI), createMaterial(0x0e1014, 0, 1), 0, 1.12, 0.08);
    col.rotation.z = Math.PI;
    te.add(col);

    te.add(
      createMesh(
        new THREE.PlaneGeometry(1.3, 0.7),
        new THREE.MeshBasicMaterial({
          map: createTextTexture('Google Cloud', 256, 128, null, '#ffffff', 'bold 34px sans-serif'),
          transparent: true,
        }),
        0,
        0.3,
        0.2
      )
    );
    te.scale.setScalar(0.8);
    te.position.set(-2, -0.15, 0);
    group.add(te);

    // 3. Tote Bag
    const bg = new THREE.Group();
    bg.add(createMesh(new THREE.BoxGeometry(1.7, 1, 0.6), darkMat));
    bg.add(createMesh(new THREE.TorusGeometry(0.5, 0.05, 8, 24, Math.PI), createMaterial(0x222222, 0.3, 0.4), 0, 0.5, 0));
    bg.add(
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
    bg.position.set(0.6, -0.5, 0);
    group.add(bg);

    // 4. Gold Certificate of Achievement
    const cd = new THREE.Group();
    const ct = document.createElement('canvas');
    ct.width = 1024;
    ct.height = 724;
    const cx = ct.getContext('2d')!;
    cx.fillStyle = '#FFFDF5';
    cx.fillRect(0, 0, 1024, 724);
    cx.strokeStyle = '#B8922D';
    cx.lineWidth = 14;
    cx.strokeRect(28, 28, 968, 668);
    cx.lineWidth = 3;
    cx.strokeRect(52, 52, 920, 620);
    cx.textAlign = 'center';
    cx.fillStyle = '#14275e';
    cx.font = 'bold 70px Georgia,serif';
    cx.fillText('CERTIFICATE', 512, 200);
    cx.font = '34px Georgia,serif';
    cx.fillStyle = '#555555';
    cx.fillText('of Achievement', 512, 260);
    cx.fillStyle = '#4285F4';
    cx.fillRect(312, 300, 400, 6);
    cx.fillStyle = '#14275e';
    cx.font = 'italic 40px Georgia,serif';
    cx.fillText('NECN Cloud Champions', 512, 400);
    cx.font = '28px Georgia,serif';
    cx.fillStyle = '#555555';
    cx.fillText('Google Cloud Learn with Communities 2026', 512, 460);
    cx.fillStyle = '#E6C36A';
    cx.beginPath();
    cx.arc(512, 590, 50, 0, 7);
    cx.fill();
    cx.fillStyle = '#8a6a14';
    cx.font = 'bold 46px serif';
    cx.fillText('★', 512, 606);

    cd.add(createMesh(new THREE.BoxGeometry(2.4, 1.7, 0.04), createMaterial(0xfffdf5, 0, 0.8)));
    cd.add(createMesh(new THREE.PlaneGeometry(2.32, 1.64), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ct) }), 0, 0, 0.025));
    cd.position.set(3.5, -0.1, 0);
    group.add(cd);

    // 5. Floating Labels in #B8922D
    const labels: [string, number][] = [
      ['Bottle', -4.4],
      ['T-Shirt', -2],
      ['Bag', 0.6],
      ['Certificate', 3.5],
    ];
    labels.forEach((l) => {
      group.add(
        createMesh(
          new THREE.PlaneGeometry(2, 0.4),
          new THREE.MeshBasicMaterial({
            map: createTextTexture(l[0], 512, 100, null, '#B8922D', 'bold 52px Inter,sans-serif'),
            transparent: true,
          }),
          l[1],
          -1.55,
          0
        )
      );
    });

    // 6. Medals
    const md: THREE.Mesh[] = [];
    (['5', '10'] as const).forEach((num, i) => {
      const d = createMesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.12, 48),
        createMaterial(0xe6c36a, 0.95, 0.2),
        i ? 1.4 : -1.4,
        2.3,
        0.6
      );
      d.rotation.x = Math.PI / 2;
      const f = createMesh(
        new THREE.PlaneGeometry(0.9, 0.9),
        new THREE.MeshBasicMaterial({
          map: createTextTexture(num, 128, 128, null, '#5a4310', '900 80px serif'),
          transparent: true,
        }),
        0,
        0.07,
        0
      );
      f.rotation.x = -Math.PI / 2;
      d.add(f);
      group.add(d);
      md.push(d);
    });

    scene.add(group);

    // 7. Background floating Google spheres
    const ob: THREE.Mesh[] = [];
    for (let j = 0; j < 8; j++) {
      const o = createMesh(
        new THREE.SphereGeometry(0.25, 20, 20),
        createMaterial(GOOGLE_COLORS[j % 4], 0.3, 0.2),
        Math.random() * 10 - 5,
        Math.random() * 4 - 2,
        -2
      );
      o.userData = { offset: j };
      scene.add(o);
      ob.push(o);
    }

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (w < 480) {
        group.scale.setScalar(0.68);
      } else if (w < 768) {
        group.scale.setScalar(0.8);
      } else {
        group.scale.setScalar(0.92);
      }
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

      group.rotation.y = Math.sin(s * 0.5) * 0.1;
      bt.position.y = Math.sin(s) * 0.1;
      te.position.y = -0.15 + Math.cos(s * 1.1) * 0.08;
      cd.position.y = -0.1 + Math.sin(s * 0.8) * 0.08;
      bg.position.y = -0.5 + Math.sin(s * 0.9) * 0.1;
      md.forEach((d, i) => {
        d.rotation.z = s * (1 + i * 0.4);
      });
      ob.forEach((o) => {
        o.position.y += Math.sin(s + o.userData.offset) * 0.004;
      });

      // Smooth mouse parallax
      camera.position.x += (mx * 2 - camera.position.x) * 0.05;
      camera.position.y += (-my * 1.5 - camera.position.y) * 0.05;
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

  // Scene 3: Campus Building Canvas (3D NECN Model + Procedural Puff Clouds)
  useEffect(() => {
    const cv = campusCanvasRef.current;
    if (!cv) return;

    let animId: number;
    let isVisible = true;

    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 10.2);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dLight.position.set(4, 6, 6);
    scene.add(dLight);
    const pLight = new THREE.PointLight(0xe6c36a, 1, 30);
    pLight.position.set(-5, -2, 5);
    scene.add(pLight);

    const g = new THREE.Group();
    const wall = createMaterial(0xf2e3b8, 0, 0.85);
    const trim = createMaterial(0xfff8e4, 0, 0.6);
    const glass = createMaterial(0x1d3a7a, 0.5, 0.15, {
      emissive: new THREE.Color(0x2a5cc0),
      emissiveIntensity: 0.35,
    });
    const leaf = createMaterial(0x2f9e4f, 0, 0.9);

    g.add(createMesh(new THREE.BoxGeometry(10, 0.2, 3.6), createMaterial(0x8f9a8a, 0, 0.9), 0, -1.55, 0.7));
    g.add(createMesh(new THREE.BoxGeometry(8, 2.7, 1.7), wall, 0, -0.1, 0));
    g.add(createMesh(new THREE.BoxGeometry(2.6, 3.1, 2.2), wall, 0, 0.1, 0.25));
    g.add(createMesh(new THREE.BoxGeometry(8.2, 0.14, 1.9), trim, 0, 1.3, 0));
    g.add(createMesh(new THREE.BoxGeometry(2.8, 0.14, 2.4), trim, 0, 1.7, 0.25));

    [-0.4, 0.5].forEach((y) => {
      g.add(createMesh(new THREE.BoxGeometry(8.05, 0.06, 0.06), trim, 0, y, 0.87));
    });

    [-0.85, 0.05, 0.95].forEach((y) => {
      for (let c = -7; c <= 7; c++) {
        if (Math.abs(c) < 3) continue;
        g.add(createMesh(new THREE.BoxGeometry(0.38, 0.52, 0.04), trim, c * 0.52, y, 0.87));
        g.add(createMesh(new THREE.BoxGeometry(0.3, 0.44, 0.05), glass, c * 0.52, y, 0.89));
      }
    });

    [0.5, 1.15].forEach((y) => {
      [-0.8, 0, 0.8].forEach((x) => {
        g.add(createMesh(new THREE.BoxGeometry(0.5, 0.45, 0.05), glass, x, y, 1.37));
      });
    });

    g.add(createMesh(new THREE.BoxGeometry(0.95, 1.1, 0.05), glass, 0, -0.88, 1.37));
    g.add(createMesh(new THREE.BoxGeometry(2.9, 0.14, 1), trim, 0, -0.2, 1.75));

    [-1.2, -0.4, 0.4, 1.2].forEach((x) => {
      g.add(createMesh(new THREE.CylinderGeometry(0.09, 0.09, 1.25, 16), trim, x, -0.83, 2.15));
    });

    [0, 1, 2].forEach((i) => {
      g.add(createMesh(new THREE.BoxGeometry(3.2 + i * 0.5, 0.1, 0.4), createMaterial(0xd8d2c0, 0, 0.8), 0, -1.38 + i * 0.0, 2.3 + i * 0.3));
    });

    g.add(createMesh(new THREE.BoxGeometry(5.6, 0.9, 0.18), createMaterial(0x14275e, 0.3, 0.4), 0, 2.25, 0.4));
    g.add(createMesh(new THREE.BoxGeometry(5.7, 0.04, 0.2), createMaterial(0xe6c36a, 0.9, 0.2), 0, 2.72, 0.4));
    g.add(createMesh(new THREE.BoxGeometry(5.7, 0.04, 0.2), createMaterial(0xe6c36a, 0.9, 0.2), 0, 1.78, 0.4));
    g.add(
      createMesh(
        new THREE.PlaneGeometry(5.4, 0.8),
        new THREE.MeshBasicMaterial({
          map: createTextTexture('NARAYANA ENGINEERING COLLEGE', 1024, 150, '#14275e', '#ffffff', 'bold 54px Georgia,serif'),
        }),
        0,
        2.25,
        0.5
      )
    );

    [-1, 1].forEach((d) => {
      [2.4, 3.4, 4.4].forEach((x, j) => {
        const X = d * x;
        const h = 0.6 + j * 0.1;
        g.add(createMesh(new THREE.CylinderGeometry(0.05, 0.07, h, 8), createMaterial(0x6b4a2b), X, -1.45 + h / 2, 1.7));
        g.add(createMesh(new THREE.SphereGeometry(0.45, 16, 16), leaf, X, -1.2 + h, 1.7));
        g.add(createMesh(new THREE.SphereGeometry(0.32, 16, 16), leaf, X, -0.8 + h, 1.7));
      });
      g.add(createMesh(new THREE.BoxGeometry(1.8, 0.25, 0.35), leaf, d * 3.2, -1.35, 2.4));
    });

    // Procedural Puff Clouds at the Base
    [-1, 1].forEach((d) => {
      const p = puff(9, 4, 0.8, 1);
      p.position.set(d * 4.2, -1.7, 2.6);
      g.add(p);
    });

    g.position.y = -0.2;
    scene.add(g);

    const handleResize = () => {
      const w = cv.clientWidth || 300;
      const h = cv.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (w < 480) {
        g.scale.setScalar(0.68);
      } else if (w < 768) {
        g.scale.setScalar(0.82);
      } else {
        g.scale.setScalar(0.95);
      }
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(cv);

    // The college building must stay STATIC (no rotation, no camera parallax)
    const render = () => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;
      renderer.render(scene, camera);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="luxury-3d-root relative w-full text-[#14182b] overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-900 pb-0">
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

            {/* Main Title with Dynamic Wave & Glow Animation */}
            <h1 className="luxury-serif font-black leading-[1.02] text-[clamp(34px,6.2vw,86px)] tracking-tight select-none">
              <small className="title-necn block text-[0.58em] tracking-tight text-[#1c3f94] mb-1">
                NECN
              </small>
              <div className="title-cloud-champions flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
                <span className="title-cloud-word text-[#4285F4] whitespace-nowrap">
                  Cloud
                </span>
                <span className="title-champions-word whitespace-nowrap inline-block">
                  <span className="text-[#EA4335]">Ch</span>
                  <span className="text-[#FBBC04]">am</span>
                  <span className="text-[#34A853]">pions</span>
                </span>
              </div>
            </h1>

            {/* Program Pill with Pure Rotating Border (Only Border Rotates) */}
            <div className="rotating-border-box inline-flex items-center">
              {/* Spinning Conic Gradient (Border only) */}
              <div className="rotating-border-spin" aria-hidden="true" />

              {/* Static Content (Stays upright, covers center so only border spins) */}
              <div className="rotating-border-content px-5 py-2 font-bold text-xs sm:text-sm text-[#14182b] flex items-center gap-1.5 shadow-sm">
                <span>Google Cloud Learn with</span>
                <span className="font-extrabold text-[#4285F4]">Communities</span>
                <span className="font-extrabold text-[#14182b]">2026</span>
              </div>
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
          SECTION 3: THE CHAMPIONS' PODIUM
          ========================================================================= */}
      <section id="leaderboard" className="max-w-[1180px] mx-auto px-5 py-16 text-center">
        <h2 className="luxury-serif text-3xl sm:text-5xl font-black mb-2 luxury-rv">
          <span className="luxury-gold">The Champions' Podium</span>
        </h2>
        <p className="text-slate-700 font-semibold max-w-lg mx-auto text-base sm:text-lg luxury-rv mb-2">
          Where excellence takes the spotlight.
        </p>
        <p className="text-slate-500 max-w-md mx-auto mb-10 text-xs sm:text-sm luxury-rv">
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
      <section id="about" className="max-w-[1180px] mx-auto px-5 pt-8 pb-2 text-center">
        <h2 className="luxury-serif text-3xl sm:text-5xl font-black mb-2 luxury-rv">
          Our <span className="luxury-gold">Campus</span>
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-4 text-sm luxury-rv leading-relaxed">
          Official Google Cloud Learning &amp; Achievement Leaderboard for GDG On Campus, Narayana Engineering College, Nellore (Autonomous).
        </p>

        {/* 3D WebGL Campus Building Canvas */}
        <div className="relative w-full h-[280px] sm:h-[350px] flex items-center justify-center">
          <canvas ref={campusCanvasRef} className="w-full h-full block rounded-3xl" />
        </div>
      </section>

      {/* =========================================================================
          FOOTER (Built with passion. Powered by community. ☁️)
          Fits cleanly and concludes the page with zero dead space
          ========================================================================= */}
      <footer className="relative mt-2 pt-6 pb-6 px-4 sm:px-6 text-center border-t border-slate-300/40">
        <div className="max-w-3xl mx-auto">
          {/* Header & Subtitle */}
          <h3 className="text-base sm:text-lg font-bold text-[#14182b] tracking-tight">
            Built with passion. Powered by community. ☁️
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Celebrating innovation, learning &amp; achievements.
          </p>

          {/* Thin Divider */}
          <div className="my-4 border-t border-slate-300/60 max-w-xl mx-auto" />

          {/* Details & Attribution */}
          <div className="space-y-1 text-xs text-slate-600 font-medium leading-relaxed">
            <p>GDG on Campus NECN · Google Cloud Learn with Communities 2026</p>
            <p>Narayana Engineering College, Nellore</p>
            <p className="pt-1.5 text-slate-700 font-semibold flex items-center justify-center gap-1.5">
              <span>Crafted with</span>
              <span className="text-rose-500 text-sm">❤️</span>
              <span>by SHAIK SAMEER</span>
            </p>
            <p className="text-[11px] text-slate-400 pt-0.5 font-normal">
              © 2026 GDG OC NECN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

