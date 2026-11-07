import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./CloudChampionsScene.css";

type Props = { className?: string; label?: string };

export default function CloudChampionsScene({
  className = "",
  label = "Animated 3D NECN Cloud Champions cloud and technology scene",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let disposed = false;
    let visible = true;
    let mx = 0;
    let my = 0;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 11;

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(4, 6, 6);
    scene.add(key);
    const fill = new THREE.PointLight(0xe6c36a, 1, 30);
    fill.position.set(-5, -2, 5);
    scene.add(fill);

    const G = [0x4285F4, 0xEA4335, 0xFBBC04, 0x34A853];

    const M = (c: THREE.ColorRepresentation, m = 0, r = 0.3, o: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r, ...o });

    const B = (g: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
      const obj = new THREE.Mesh(g, mat);
      obj.position.set(x, y, z);
      return obj;
    };

    const T = (txt: string, w: number, h: number, bg: string | null, fg: string, font: string) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const x = c.getContext("2d")!;
      if (bg) {
        x.fillStyle = bg;
        x.fillRect(0, 0, w, h);
      }
      x.fillStyle = fg;
      x.font = font;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText(txt, w / 2, h / 2);
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

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
      const geo = new THREE.ExtrudeGeometry(s, {
        depth: d,
        bevelEnabled: true,
        bevelThickness: r * 0.4,
        bevelSize: r * 0.4,
        bevelSegments: 4,
        curveSegments: 10,
      });
      geo.translate(0, 0, -d / 2);
      return geo;
    };

    // Exact cloud artwork from the source HTML's logo3d() function.
    const logo3d = () => {
      const c = document.createElement("canvas");
      c.width = 1800;
      c.height = 1440;
      const x = c.getContext("2d")!;
      const X = (v: number) => (v - 494) * 6;
      const Y = (v: number) => (v - 112) * 6;
      const R = (a: number) => (a * Math.PI) / 180;
      const ci = (px: number, py: number, r: number) => {
        x.beginPath();
        x.arc(X(px), Y(py), r * 6, 0, 7);
        x.fill();
      };
      x.fillStyle = "#FFFFFF";
      ci(640, 225, 98);
      ci(583, 265, 73);
      ci(718, 258, 68);
      ci(726, 285, 60);
      x.strokeStyle = "#FF0000";
      x.lineWidth = 300;
      x.beginPath();
      x.arc(X(640), Y(225), 456, R(-192), R(-44), false);
      x.stroke();
      x.strokeStyle = "#0088FF";
      x.beginPath();
      x.arc(X(640), Y(225), 456, R(-44), R(18), false);
      x.stroke();
      x.fillStyle = "#0088FF";
      ci(718, 258, 70);
      ci(726, 285, 62);
      x.fillRect(X(648), Y(258), X(726) - X(648), Y(347) - Y(258));
      x.fillStyle = "#00B039";
      x.beginPath();
      x.moveTo(X(572), Y(298));
      x.lineTo(X(648), Y(298));
      x.lineTo(X(648), Y(347));
      x.lineTo(X(592), Y(347));
      x.quadraticCurveTo(X(556), Y(345), X(540), Y(326));
      x.closePath();
      x.fill();
      x.fillStyle = "#FFFFFF";
      ci(583, 268, 30);
      x.fillRect(X(583), Y(238), X(710) - X(583), Y(298) - Y(238));
      ci(700, 262, 37);
      ci(710, 269, 30);
      ci(640, 225, 51);
      x.fillRect(X(592), Y(208), X(650) - X(592), Y(240) - Y(208));
      x.fillRect(X(563), Y(286), X(576) - X(563), Y(298) - Y(286));
      x.strokeStyle = "#FFB400";
      x.lineWidth = 288;
      x.beginPath();
      x.arc(X(583), Y(265), 306, R(-41), R(120), true);
      x.stroke();

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      const g = new THREE.Group();
      for (let k = 0; k < 10; k++) {
        const layer = B(
          new THREE.PlaneGeometry(3.8, 3.04),
          new THREE.MeshBasicMaterial({
            map: tex,
            alphaTest: 0.5,
            color: k ? new THREE.Color().setScalar(0.62 - 0.035 * k) : 0xffffff,
          })
        );
        layer.position.z = -k * 0.025;
        g.add(layer);
      }
      const edge = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { t: { value: tex }, u: { value: 0 } },
        vertexShader: `varying vec2 v; void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          uniform sampler2D t; uniform float u; varying vec2 v;
          void main(){
            vec2 d=vec2(9./1800.,9./1440.);
            float a=texture2D(t,v).a;
            float m=min(min(texture2D(t,v+vec2(d.x,0.)).a,texture2D(t,v-vec2(d.x,0.)).a),
              min(texture2D(t,v+vec2(0.,d.y)).a,texture2D(t,v-vec2(0.,d.y)).a));
            float e=step(.5,a)*(1.-step(.5,m));
            vec2 p=v-vec2(.5); float an=atan(p.y,p.x);
            float k1=mod(u-an,6.2832), k2=mod(u+3.1416-an,6.2832);
            float l=max(exp(-k1*2.2),exp(-k2*2.2));
            gl_FragColor=vec4(vec3(1.,.96,.8)*1.8,l*e);
          }`,
      });
      const glow = B(new THREE.PlaneGeometry(3.8, 3.04), edge);
      glow.position.z = 0.03;
      g.add(glow);
      g.userData.edgeMaterial = edge;
      return g;
    };

    const g = new THREE.Group();
    const cloud = logo3d();
    cloud.position.set(-0.4, 1.15, 0);
    g.add(cloud);
    const edgeMaterial = cloud.userData.edgeMaterial as THREE.ShaderMaterial;

    // Laptop and its code screen, copied from the source hero scene.
    const lp = new THREE.Group();
    const lb = B(rb(2, 1.3, 0.08, 0.1), M(0x1c3f94, 0.6, 0.2));
    lb.rotation.x = Math.PI / 2;
    lp.add(lb);
    const sr = B(rb(2, 1.3, 0.05, 0.1), M(0x0b1d4d, 0.4, 0.3), 0, 0.7, -0.62);
    sr.rotation.x = -0.18;
    lp.add(sr);
    const sf = B(
      new THREE.PlaneGeometry(1.8, 1.1),
      new THREE.MeshBasicMaterial({ map: T("</>", 1024, 640, "#1558c9", "#fff", "bold 360px monospace") }),
      0,
      0.7,
      -0.53
    );
    sf.rotation.x = -0.18;
    lp.add(sf);
    lp.position.set(2.3, -2.2, 0.8);
    lp.rotation.y = -0.5;
    g.add(lp);

    // Three stacked blue server units.
    const sv = new THREE.Group();
    for (let k = 0; k < 3; k++) {
      sv.add(
        B(
          rb(1.5, 0.34, 1.1, 0.08),
          new THREE.MeshPhysicalMaterial({ color: 0x2b6be6, metalness: 0.3, roughness: 0.25, clearcoat: 1 }),
          0,
          k * 0.46,
          0
        )
      );
      for (let q = 0; q < 3; q++) {
        sv.add(
          B(
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
    g.add(sv);
    scene.add(g);

    // Orbiting Google-colour spheres with wide safety clearance around cloud.
    const orbs: THREE.Mesh[] = [];
    for (let j = 0; j < 4; j++) {
      const o = B(new THREE.SphereGeometry(0.2 + Math.random() * 0.2, 24, 24), M(G[j % 4], 0.3, 0.2));
      o.userData = { a: j, r: 3.8 + (j % 2) * 0.8, s: 0.3 + (j % 3) * 0.15, y: -0.2 + (j % 4) * 0.8 };
      scene.add(o);
      orbs.push(o);
    }

    // Original orbit rings.
    const rings: THREE.Mesh[] = [];
    [[2.9, 6.3, 0.5], [3.2, 5, 0.45], [3.55, 3.8, 0.4], [3.9, 6.3, 0.25]].forEach((p, i) => {
      const r = B(
        new THREE.TorusGeometry(p[0], 0.014, 8, 160, p[1]),
        new THREE.MeshBasicMaterial({ color: 0x9aa3b8, transparent: true, opacity: p[2] }),
        -0.4,
        1.15,
        -0.3
      );
      r.rotation.z = i;
      scene.add(r);
      rings.push(r);
    });

    // Original coloured floating particle positions.
    const dots: THREE.Mesh[] = [];
    const dotPoints = [
      [471, 23, 0xe31b23, 5],
      [553, 21, 0xffd000, 10],
      [765, 35, 0x2d8cff, 17],
      [631, 79, 0x6cbf00, 8],
      [796, 85, 0xe31b23, 5],
      [791, 169, 0x6cbf00, 9],
      [913, 217, 0xffd000, 13],
      [270, 219, 0xe31b23, 11],
      [330, 219, 0x2d8cff, 6],
      [348, 283, 0xffd000, 5],
      [524, 353, 0xffd000, 9],
      [765, 357, 0x2d8cff, 9],
      [727, 393, 0xffd000, 5],
      [508, 433, 0xe31b23, 9],
      [623, 474, 0x2d8cff, 14],
      [792, 453, 0x6cbf00, 19],
      [864, 430, 0xe31b23, 13],
    ];
    dotPoints.forEach((p, i) => {
      const d = B(
        new THREE.CircleGeometry(p[3] * 0.0136, 64),
        new THREE.MeshBasicMaterial({ color: p[2] }),
        (p[0] - 650) * 0.0085,
        -(p[1] - 270) * 0.012 + 0.3,
        ((i % 5) - 2) * 0.4
      );
      d.userData = { y: d.position.y, s: 0.6 + (i % 4) * 0.25, p: i };
      scene.add(d);
      dots.push(d);
    });

    // Floating coloured technology glyphs.
    const bx = (w: number, h: number, color: number, x: number, y: number) =>
      B(
        rb(w, h, 0.06, Math.min(w, h) * 0.18),
        new THREE.MeshPhysicalMaterial({
          color,
          metalness: 0.1,
          roughness: 0.3,
          clearcoat: 1,
          clearcoatRoughness: 0.15,
        }),
        x,
        y,
        0
      );

    const pl = new THREE.Group();
    pl.add(bx(0.6, 0.2, 0x4285f4, 0, 0));
    pl.add(bx(0.2, 0.6, 0x4285f4, 0, 0));
    [
      [-0.27, 0.27, 0xf4b400],
      [0.27, 0.27, 0xdb4437],
      [-0.27, -0.27, 0xdb4437],
      [0.27, -0.27, 0xf4b400],
    ].forEach((q) => {
      const m = B(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16), M(q[2], 0.1, 0.4), q[0], q[1], 0);
      m.rotation.x = Math.PI / 2;
      pl.add(m);
    });
    pl.position.set(-3.2, 2.3, 0.4);

    const lo = new THREE.Group();
    lo.add(bx(0.57, 0.11, 0xf4b400, 0, 0.18));
    lo.add(bx(0.33, 0.33, 0x4285f4, -0.12, -0.07));
    lo.add(bx(0.22, 0.19, 0x0f9d58, 0.18, 0));
    lo.add(bx(0.22, 0.11, 0xdb4437, 0.18, -0.18));
    lo.position.set(3.1, 2.2, 0.4);

    const eq = new THREE.Group();
    [
      [0.3, 0x4285f4],
      [0.5, 0xf4b400],
      [0.38, 0xdb4437],
      [0.25, 0x0f9d58],
    ].forEach((b, i) => eq.add(bx(0.12, b[0], b[1], -0.27 + i * 0.18, 0)));
    eq.position.set(-3.4, 0.3, 0.4);

    const icons = [pl, lo, eq];
    icons.forEach((o) => {
      o.scale.setScalar(1.3);
      o.userData.y = o.position.y;
      scene.add(o);
    });

    let targetCamZ = 11;
    const resize = () => {
      const w = Math.max(canvas.clientWidth, 1);
      const h = Math.max(canvas.clientHeight, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;

      // Dynamic responsive camera distance: guarantees zero cropping on mobile
      // Scene width from left servers (-3.6) to right laptop (+3.2) + margins is ~10.2 units
      const reqWidth = 10.2;
      const vFovRad = THREE.MathUtils.degToRad(camera.fov);
      const visibleWidthAtZ1 = 2 * Math.tan(vFovRad / 2) * camera.aspect;
      targetCamZ = Math.max(11, reqWidth / visibleWidthAtZ1);
      camera.position.z = targetCamZ;
      camera.updateProjectionMatrix();
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    const visibilityObserver = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    visibilityObserver.observe(canvas);
    resize();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const render = (time: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(render);
      if (!visible) return;
      const s = time * 0.001;
      if (!reduceMotion) {
        edgeMaterial.uniforms.u.value = s * 1.4;
        lp.position.y = -2.2 + Math.sin(s * 1.2) * 0.1;
        sv.position.y = -2.1 + Math.cos(s) * 0.1;
        rings.forEach((r, i) => {
          r.rotation.z = s * (0.12 + i * 0.07) * (i % 2 ? -1 : 1);
        });
        dots.forEach((d) => {
          d.position.y = d.userData.y + Math.sin(s * d.userData.s + d.userData.p) * 0.12;
        });
        icons.forEach((o, i) => {
          o.rotation.y = Math.sin(s * 0.8 + i) * 0.4;
          o.position.y = o.userData.y + Math.sin(s + i * 2) * 0.08;
        });
        orbs.forEach((o) => {
          const u = o.userData;
          const a = u.a + s * u.s;
          o.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 2) * 0.4, Math.sin(a) * u.r * 0.5);
        });
      }
      camera.position.x += (mx * 3 - camera.position.x) * 0.05;
      camera.position.y += (-my * 2 - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((obj) => {
        const item = obj as THREE.Mesh;
        if (item.geometry) item.geometry.dispose();
        if (item.material) {
          const mats = Array.isArray(item.material) ? item.material : [item.material];
          mats.forEach((mat) => {
            const m = mat as THREE.Material & { map?: THREE.Texture };
            m.map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div className={`cloud-champions-scene ${className}`} role="img" aria-label={label}>
      <canvas ref={canvasRef} className="cloud-champions-scene__canvas" />
    </div>
  );
}

