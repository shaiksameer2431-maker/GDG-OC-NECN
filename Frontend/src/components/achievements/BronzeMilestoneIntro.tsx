import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Users, Sparkles, ArrowRight, ChevronRight } from 'lucide-react';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface SceneData {
  tag: string;
  theme: 'cyan-magenta' | 'amber-pink' | 'lime-cyan' | 'blue-magenta' | 'gold' | 'showcase' | 'rainbow';
  lines: string[];
  isGold: boolean;
}

// Exact updated captions provided by user with multi-line stacking for cinematic impact
const CINEMATIC_SCENES: SceneData[] = [
  // Scene 1 — The Beginning (Cyan & Magenta neon theme)
  {
    tag: 'SCENE 1 — THE BEGINNING',
    theme: 'cyan-magenta',
    lines: [
      'IT WAS NEVER\nAN EASY JOURNEY.',
      'EVERY CHALLENGE\nMADE US STRONGER.',
      'BUT WE NEVER\nGAVE UP.',
    ],
    isGold: false,
  },
  // Scene 2 — The Struggle (Amber & Hot Pink neon theme)
  {
    tag: 'SCENE 2 — THE STRUGGLE',
    theme: 'amber-pink',
    lines: [
      'COUNTLESS LABS.',
      'LATE NIGHTS.',
      'ONE GOAL.',
      'WE KEPT MOVING\nFORWARD.',
    ],
    isGold: false,
  },
  // Scene 3 — The Unity (Electric Lime & Cyan neon theme)
  {
    tag: 'SCENE 3 — THE UNITY',
    theme: 'lime-cyan',
    lines: [
      "WE DIDN'T\nDO IT ALONE.",
      'WE LEARNED\nTOGETHER.',
      'EVERY EFFORT\nCOUNTED.',
    ],
    isGold: false,
  },
  // Scene 4 — The Turning Point (Electric Blue & Vivid Magenta theme)
  {
    tag: 'SCENE 4 — THE TURNING POINT',
    theme: 'blue-magenta',
    lines: [
      '438 STUDENTS.',
      'ONE COMMUNITY.',
      'ONE\nUNSTOPPABLE\nTEAM.',
      'AND FINALLY...',
    ],
    isGold: false,
  },
  // Scene 5 — The Gold Reveal (24K Gold & Sunburst theme)
  {
    tag: 'SCENE 5 — THE GOLD REVEAL',
    theme: 'gold',
    lines: [
      'THE WAIT IS OVER.',
      'WE DID IT!',
      'WE REACHED\nGOLD!',
    ],
    isGold: true,
  },
  // Scene 6 — Achievement Showcase (Multi-neon metric pods)
  {
    tag: 'SCENE 6 — ACHIEVEMENT SHOWCASE',
    theme: 'showcase',
    lines: [
      '280 ACHIEVERS.',
      '2,661\nSKILL BADGES.',
      '112% OF OUR\nTARGET.',
    ],
    isGold: true,
  },
  // Scene 7 / Finale — Victory & Unity (Concentric Rainbow Neon spectrum)
  {
    tag: 'GDG ON-CAMPUS NECN',
    theme: 'rainbow',
    lines: [
      'THIS GOLD BELONGS\nTO EVERYONE.',
      'ONE TEAM.',
      'ONE COMMUNITY.',
      'ONE GOLDEN MILESTONE.',
      'WE MADE IT HAPPEN.',
    ],
    isGold: true,
  },
];

// Spark particle interface for multi-color particle engine
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  decay: number;
  isBurst?: boolean;
}

/**
 * Concentric Multi-Tube Neon Cloud Logo Component
 * Modeled directly on the concentric multi-tube neon style of Image 2 (Gradient Cyan -> Blue -> Purple -> Magenta)
 */
export const ConcentricNeonCloud: React.FC<{ size?: number; className?: string }> = ({
  size = 64,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 160 105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bmi-concentric-cloud ${className}`}
      aria-label="Google Cloud Neon Logo"
    >
      <defs>
        {/* Continuous Multi-Color Neon Gradient (Image 2 aesthetic) */}
        <linearGradient id="bmiNeonCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="28%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="82%" stopColor="#FF007F" />
          <stop offset="100%" stopColor="#FF3366" />
        </linearGradient>

        {/* Multi-layer Neon Glow Filter */}
        <filter id="bmiNeonGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Layer 1: Ambient Outer Neon Glow */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
        filter="url(#bmiNeonGlowFilter)"
      />

      {/* Layer 2: Main Vibrant Neon Tube (Outer Loop) */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Layer 3: Concentric Middle Neon Tube (Inner Loop 1) */}
      <path
        d="M 44 71 C 33 71 25 62 25 51 C 25 41 33 33 43 32 C 47 23 57 17 68 17 C 81 17 92 25 94 37 C 98 36 102 35 106 35 C 118 35 128 45 128 57 C 128 58 128 59 128 60 C 132 60 136 63 136 67 C 136 71 132 71 128 71 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Layer 4: Concentric Inner Neon Core (Inner Loop 2) */}
      <path
        d="M 50 64 C 42 64 36 57 36 49 C 36 41 42 35 50 35 C 53 29 60 25 68 25 C 77 25 84 31 86 39 C 89 38 92 37 95 37 C 104 37 111 44 111 53 C 111 59 106 64 100 64 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Layer 5: White-Hot Center Neon Filament (Realistic Gas Tube Core) */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
};

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  // Scene & Sentence Tracking
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Canvases
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const sentenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Multi-color sparks ref
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Multi-Neon Confetti Palette (Cyan, Magenta, Gold, Purple, Emerald)
  const multiNeonCelebrationColors = [
    '#00F0FF', // Electric Cyan
    '#FF007F', // Hot Magenta
    '#A855F7', // Neon Violet
    '#FFD700', // 24K Gold
    '#00FF88', // Electric Lime
    '#FF3366', // Coral Neon
    '#FFFFFF', // Diamond Specular
  ];

  // Initialize Confetti Instance
  useEffect(() => {
    if (!confettiCanvasRef.current) return;
    const partyConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    });
    partyConfettiRef.current = partyConfetti;

    return () => {
      partyConfetti.reset();
    };
  }, []);

  // Trigger Multi-Color Neon Confetti celebration blast
  const fireMultiNeonCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    party({
      particleCount: 65,
      angle: 60,
      spread: 65,
      origin: { x: 0.1, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    party({
      particleCount: 65,
      angle: 120,
      spread: 65,
      origin: { x: 0.9, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      party({
        particleCount: 85,
        spread: 105,
        origin: { x: 0.5, y: 0.35 },
        colors: multiNeonCelebrationColors,
        scalar: 1.25,
        startVelocity: 34,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 300);
  }, []);

  // Multi-Color Neon Sparks Engine (Cyan, Pink, Purple, Lime, Gold particles)
  useEffect(() => {
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const multiNeonColors = ['#00F0FF', '#FF007F', '#A855F7', '#00FF88', '#FFD700', '#FFFFFF'];

    // Spawn initial floating ambient multi-color embers
    const ambientCount = 42;
    const sparks: Spark[] = [];
    for (let i = 0; i < ambientCount; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: -0.6 - Math.random() * 1.3,
        size: 1.3 + Math.random() * 2.6,
        color: multiNeonColors[Math.floor(Math.random() * multiNeonColors.length)],
        alpha: Math.random() * 0.85,
        maxAlpha: 0.45 + Math.random() * 0.55,
        decay: 0.003 + Math.random() * 0.006,
        isBurst: false,
      });
    }
    sparksRef.current = sparks;

    // Animation Loop
    let isRunning = true;
    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      const activeSparks = sparksRef.current;
      for (let i = activeSparks.length - 1; i >= 0; i--) {
        const s = activeSparks[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.isBurst) {
          s.vx *= 0.96;
          s.vy *= 0.96;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            activeSparks.splice(i, 1);
            continue;
          }
        } else {
          // Floating ambient embers
          s.alpha += (Math.random() - 0.5) * 0.04;
          if (s.alpha < 0.15) s.alpha = 0.15;
          if (s.alpha > s.maxAlpha) s.alpha = s.maxAlpha;

          // Wrap around top
          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
          }
          if (s.x < -10) s.x = width + 10;
          if (s.x > width + 10) s.x = -10;
        }

        // Draw glowing particle spark
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.size * 5;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Burst multi-color neon sparks from text center on sentence change
  const triggerSparksBurst = useCallback(() => {
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.48;
    const multiNeonColors = ['#00F0FF', '#FF007F', '#A855F7', '#00FF88', '#FFD700', '#FFFFFF'];
    const burstCount = 32;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.8 + Math.random() * 6.2;
      sparksRef.current.push({
        x: centerX + (Math.random() - 0.5) * 180,
        y: centerY + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.9,
        size: 1.6 + Math.random() * 3.0,
        color: multiNeonColors[Math.floor(Math.random() * multiNeonColors.length)],
        alpha: 0.98,
        maxAlpha: 1.0,
        decay: 0.018 + Math.random() * 0.02,
        isBurst: true,
      });
    }
  }, []);

  // Advance to next sentence or next scene
  const advanceNext = useCallback(() => {
    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    triggerSparksBurst();

    if (currentSentenceIndex < activeScene.lines.length - 1) {
      const nextIdx = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIdx);

      // Gold / multi-neon confetti on major climaxes
      if (currentSceneIndex === 4 && nextIdx === activeScene.lines.length - 1) {
        fireMultiNeonCelebration();
      }
      if (currentSceneIndex === 6 && nextIdx === activeScene.lines.length - 1) {
        fireMultiNeonCelebration();
      }
    } else {
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        const nextSceneIdx = currentSceneIndex + 1;
        setCurrentSceneIndex(nextSceneIdx);
        setCurrentSentenceIndex(0);

        if (nextSceneIdx >= 5) {
          onPreloadRef.current?.();
        }
      } else {
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 1100);
      }
    }
  }, [currentSceneIndex, currentSentenceIndex, fireMultiNeonCelebration, triggerSparksBurst]);

  // Jump directly to specific scene
  const jumpToScene = useCallback(
    (sceneIdx: number) => {
      setCurrentSceneIndex(sceneIdx);
      setCurrentSentenceIndex(0);
      triggerSparksBurst();

      if (sceneIdx === 4 || sceneIdx === 6) {
        fireMultiNeonCelebration();
      }
      if (sceneIdx >= 5) {
        onPreloadRef.current?.();
      }
    },
    [fireMultiNeonCelebration, triggerSparksBurst]
  );

  // Automated sentence pacing:
  // Non-climax sentences: 2.4s; Climax sentences: 3.8s
  useEffect(() => {
    if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current);

    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    const isLastSentenceOfScene = currentSentenceIndex === activeScene.lines.length - 1;
    const duration = isLastSentenceOfScene ? 3800 : 2400;

    sentenceTimerRef.current = setTimeout(advanceNext, duration);

    return () => {
      if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current);
    };
  }, [currentSceneIndex, currentSentenceIndex, advanceNext]);

  // Skip directly to website
  const handleSkip = useCallback(() => {
    onPreloadRef.current?.();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 400);
  }, []);

  const activeScene = CINEMATIC_SCENES[currentSceneIndex];
  const activeLine = activeScene.lines[currentSentenceIndex] || '';
  const isClimaxSentence = currentSentenceIndex === activeScene.lines.length - 1;
  const isFinalScreen = currentSceneIndex === 6 && isClimaxSentence;

  /**
   * Helper to assign multi-color neon styling per line based on scene theme:
   * Mirrors Image 3 (Cyan + Magenta), Image 6 (Multi-neon wire tubes), Image 7 (Rainbow streaks)
   */
  const getLineNeonClass = (lineIdx: number, totalLines: number, isClimax: boolean): string => {
    if (isClimax) {
      if (activeScene.theme === 'gold') return 'bmi-neon-gold-climax';
      if (activeScene.theme === 'rainbow') return 'bmi-neon-rainbow-climax';
      return 'bmi-neon-dual-climax';
    }

    switch (activeScene.theme) {
      case 'cyan-magenta':
        return lineIdx % 2 === 0 ? 'bmi-neon-cyan' : 'bmi-neon-magenta';
      case 'amber-pink':
        return lineIdx % 2 === 0 ? 'bmi-neon-amber' : 'bmi-neon-pink';
      case 'lime-cyan':
        return lineIdx % 2 === 0 ? 'bmi-neon-lime' : 'bmi-neon-cyan';
      case 'blue-magenta':
        return lineIdx % 2 === 0 ? 'bmi-neon-blue' : 'bmi-neon-magenta';
      case 'gold':
        return 'bmi-neon-gold';
      case 'showcase':
        if (currentSentenceIndex === 0) return 'bmi-neon-amber';
        if (currentSentenceIndex === 1) return 'bmi-neon-cyan';
        return 'bmi-neon-lime';
      case 'rainbow':
      default:
        return lineIdx % 2 === 0 ? 'bmi-neon-cyan' : 'bmi-neon-magenta';
    }
  };

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Cinematic Celebration"
      onClick={advanceNext} // Click anywhere to step forward
    >
      {/* 1. EXACT Same Background Ambient Radial Glow */}
      <div className="bmi-bg-radial" aria-hidden="true" />

      {/* 2. Volumetric Multi-Color God Rays (Rotating light beams matching reference) */}
      <div className="bmi-volumetric-container" aria-hidden="true">
        <div className={`bmi-volumetric-rays bmi-rays-${activeScene.theme}`} />
        <div className="bmi-central-flare" />
      </div>

      {/* 3. Multi-Color Golden/Cyan/Magenta Sparks Canvas */}
      <canvas ref={sparksCanvasRef} className="bmi-sparks-canvas" aria-hidden="true" />

      {/* 4. Dedicated Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 5. Top Header Bar with Concentric Neon Cloud Logo (from Image 2) */}
      <header
        className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GDG Chapter Title with Concentric Neon Cloud Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-8 flex items-center justify-center shrink-0">
            <ConcentricNeonCloud size={40} />
          </div>
          <div className="hidden min-[420px]:block text-left">
            <p className="text-[11px] font-black tracking-wider uppercase text-slate-800 leading-tight">
              GDG On-Campus NECN
            </p>
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
              <span>Google Cloud 2026</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              <span className="text-cyan-600 font-extrabold">Gold Chapter</span>
            </p>
          </div>
        </div>

        {/* Scene Step Progress Indicator */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200/80 shadow-xs backdrop-blur-md"
          role="tablist"
          aria-label="Scene progress"
        >
          {CINEMATIC_SCENES.map((s, idx) => {
            const isCurrent = currentSceneIndex === idx;
            const isPast = currentSceneIndex > idx;
            return (
              <button
                key={idx}
                onClick={() => jumpToScene(idx)}
                className={`bmi-step-dot ${isCurrent ? 'active' : ''} ${isPast ? 'past' : ''}`}
                title={`Go to ${s.tag}`}
                aria-label={`Go to ${s.tag}`}
              />
            );
          })}
        </div>

        {/* Skip to Dashboard Button */}
        <button
          onClick={handleSkip}
          className="bmi-skip-button"
          title="Proceed directly to website dashboard"
        >
          <span>Skip to Leaderboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
        </button>
      </header>

      {/* 6. Main Stage (ZERO BACKGROUND — MULTI-COLOR NEON TUBE TYPOGRAPHY & LIGHTING) */}
      <main className="bmi-experience-stage w-full">
        {/* Scene Tag Pill with Google Quad-Color Dots & Multi-Neon Glow */}
        <div className="mb-6 sm:mb-10 flex justify-center">
          <div
            className={`bmi-scene-tag-clean ${
              activeScene.isGold ? 'bmi-scene-tag-gold-clean' : 'bmi-scene-tag-multi'
            }`}
          >
            <div className="flex items-center gap-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
            <span>{activeScene.tag}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
          </div>
        </div>

        {/* ===================================================================
            CINEMATIC SENTENCE PRESENTATION (BLENDER & PREMIERE PRO STYLE REVEAL)
            - 3D perspective zoom & snap
            - Multi-color neon tube outline typography
            - Electric neon ignition strike
            =================================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center px-4 relative z-10">
          {/* Active sentence container with key to trigger neon ignition animation on every line change */}
          <div
            key={`${currentSceneIndex}-${currentSentenceIndex}`}
            className="bmi-neon-ignite w-full flex flex-col items-center justify-center"
          >
            {/* Contextual Icon for Scene 6 Metrics */}
            {currentSceneIndex === 5 && (
              <div className="mb-4 sm:mb-6 flex items-center justify-center">
                {currentSentenceIndex === 0 && (
                  <Users className="w-12 h-12 text-amber-500 drop-shadow-[0_0_20px_rgba(255,184,0,0.95)]" />
                )}
                {currentSentenceIndex === 1 && (
                  <Award className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.95)]" />
                )}
                {currentSentenceIndex === 2 && (
                  <Trophy className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_22px_rgba(0,255,136,1)]" />
                )}
              </div>
            )}

            {/* Climax defining moment badge */}
            {isClimaxSentence && !isFinalScreen && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-cyan-600 uppercase">
                  ★ THE DEFINING MOMENT ★
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FF007F] shadow-[0_0_8px_#FF007F]" />
              </div>
            )}

            {/* Final Screen Grand Composition (Frame 4 / Image 2 Concentric Neon Cloud) */}
            {isFinalScreen ? (
              <div className="w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                {/* Prominent Concentric Neon Cloud Emblem (Image 2 style) */}
                <div className="mb-2 sm:mb-4 animate-pulse">
                  <ConcentricNeonCloud size={110} />
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest bmi-neon-cyan">
                  GDG ON-CAMPUS NECN
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-purple-700/90 bmi-neon-purple">
                  • ONE TEAM • ONE COMMUNITY • ONE GOLDEN MILESTONE •
                </p>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-center bmi-neon-rainbow-climax bmi-streak-effect flex items-center justify-center gap-3 sm:gap-6">
                  <span className="text-cyan-400 text-3xl sm:text-5xl">✦</span>
                  <span>WE MADE IT HAPPEN</span>
                  <span className="text-pink-400 text-3xl sm:text-5xl">✦</span>
                </h1>

                <div className="mt-8 pt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handleSkip}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black text-sm tracking-wide shadow-[0_0_28px_rgba(0,240,255,0.65)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter Chapter Leaderboard & Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Standard & Climax Sentences with Natural Stacked Multi-Color Neon Lines */
              <h1 className="w-full max-w-3xl font-black uppercase tracking-tight text-center">
                {activeLine.split('\n').map((line, idx, arr) => {
                  const lineClass = getLineNeonClass(idx, arr.length, isClimaxSentence);
                  return (
                    <span
                      key={idx}
                      className={`block leading-[1.12] my-1 sm:my-2 ${
                        isClimaxSentence
                          ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
                          : 'text-2xl sm:text-4xl md:text-5xl'
                      } ${lineClass} bmi-streak-effect`}
                    >
                      {line}
                    </span>
                  );
                })}
              </h1>
            )}
          </div>

          {/* Subdued Line Tracker */}
          <div className="mt-10 sm:mt-14 flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span>
              SENTENCE 0{currentSentenceIndex + 1} OF 0{activeScene.lines.length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-cyan-600 flex items-center gap-1 font-sans">
              <span>Click anywhere to advance</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </main>

      {/* 7. Bottom Chapter Identity Strip */}
      <footer className="w-full max-w-5xl py-2 px-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider z-20">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default BronzeMilestoneIntro;
