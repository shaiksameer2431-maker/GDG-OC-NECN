import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Student, CohortStats, OfficialCourse } from '../../types';
import { Avatar } from '../common/Avatar';
import { SwagGiftExperience } from '../swags/SwagGiftExperience';
import CloudChampionsScene from '../cloud/CloudChampionsScene';
import CloudCircuitBackground from '../cloud/CloudCircuitBackground';

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
      <section id="overview" className="relative isolate w-full pt-8 sm:pt-14 pb-16 overflow-hidden">
        {/* Full window-fit vector circuit-line background layer (desktop/tablet only, hidden on mobile per design specs) */}
        <div className="hidden md:block">
          <CloudCircuitBackground />
        </div>

        <div className="max-w-[1180px] mx-auto px-5 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center lg:min-h-[85vh]">
          {/* Left Hero Column */}
          <div className="space-y-4">
            {/* Partners Bar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-bold text-slate-800">
              {/* GDG */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 rounded-full sm:rounded-none bg-white/80 sm:bg-transparent border border-amber-300/50 sm:border-0 shadow-2xs sm:shadow-none shrink-0">
                <svg width="28" height="18" viewBox="0 0 38 22" className="shrink-0">
                  <path d="M10 3 2 11l8 8" stroke="#EA4335" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="m28 3 8 8-8 8" stroke="#34A853" strokeWidth="5" fill="none" strokeLinecap="round" />
                  <path d="m22 2-6 18" stroke="#FBBC04" strokeWidth="5" strokeLinecap="round" />
                </svg>
                <span className="whitespace-nowrap">GDG On Campus</span>
              </div>
              <i className="hidden sm:inline-block w-px h-4 bg-amber-400/40" />
              {/* Narayana */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 rounded-full sm:rounded-none bg-white/80 sm:bg-transparent border border-amber-300/50 sm:border-0 shadow-2xs sm:shadow-none shrink-0">
                <svg width="18" height="22" viewBox="0 0 22 26" className="shrink-0">
                  <path d="M1 1h20v14c0 6-6 9-10 10C7 24 1 21 1 15z" fill="#1c3f94" />
                  <path d="M6 18V8l10 10V8" stroke="#fff" strokeWidth="2.4" fill="none" />
                </svg>
                <span className="whitespace-nowrap">Narayana Engineering College</span>
              </div>
              <i className="hidden sm:inline-block w-px h-4 bg-amber-400/40" />
              {/* Google Cloud */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-0 sm:py-0 rounded-full sm:rounded-none bg-white/80 sm:bg-transparent border border-amber-300/50 sm:border-0 shadow-2xs sm:shadow-none shrink-0">
                <svg width="26" height="18" viewBox="0 0 34 22" className="shrink-0">
                  <circle cx="11" cy="13" r="7" fill="#EA4335" />
                  <circle cx="19" cy="9" r="8" fill="#4285F4" />
                  <circle cx="26" cy="14" r="6" fill="#34A853" />
                  <circle cx="16" cy="15" r="5" fill="#FBBC04" />
                </svg>
                <span className="whitespace-nowrap">Google Cloud</span>
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
            <CloudChampionsScene className="w-full h-full" />
          </div>
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
          SECTION 5: REWARDS & 3D SWAG SHOWCASE (Interactive 3D Gift Box)
          ========================================================================= */}
      <SwagGiftExperience />

      {/* =========================================================================
          FOOTER (Built with passion. Powered by community. ☁️)
          Fits cleanly and concludes the page with zero dead space
          ========================================================================= */}
      <footer className="relative mt-2 pt-6 pb-28 sm:pb-8 px-4 sm:px-6 text-center border-t border-slate-300/40">
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

