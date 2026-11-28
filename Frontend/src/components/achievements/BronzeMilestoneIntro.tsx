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
  lines: string[];
  isGold: boolean;
}

// Captions aligned with video reference composition (stacked lines for maximum cinematic impact)
const CINEMATIC_SCENES: SceneData[] = [
  // Scene 1 — The Beginning
  {
    tag: 'SCENE 1 — THE BEGINNING',
    lines: [
      'IT WAS NEVER\nAN EASY JOURNEY.',
      'EVERY STEP\nTESTED US.',
      'EVERY CHALLENGE\nMADE US STRONGER.',
      'BUT WE NEVER\nGAVE UP.',
    ],
    isGold: false,
  },
  // Scene 2 — The Struggle
  {
    tag: 'SCENE 2 — THE STRUGGLE',
    lines: [
      'LATE NIGHTS.',
      'COUNTLESS LABS.',
      'UNEXPECTED\nCHALLENGES.',
      'ONE GOAL\nIN OUR MINDS.',
      'WE KEPT MOVING\nFORWARD.',
    ],
    isGold: false,
  },
  // Scene 3 — The Unity
  {
    tag: 'SCENE 3 — THE UNITY',
    lines: [
      "WE DIDN'T\nDO IT ALONE.",
      'WE LEARNED\nTOGETHER.',
      'WE HELPED\nEACH OTHER.',
      'WE GREW\nTOGETHER.',
      'EVERY STUDENT\nMATTERED.',
      'EVERY EFFORT\nCOUNTED.',
    ],
    isGold: false,
  },
  // Scene 4 — The Turning Point
  {
    tag: 'SCENE 4 — THE TURNING POINT',
    lines: [
      '438 STUDENTS.',
      'ONE COMMUNITY.',
      'THOUSANDS OF\nLEARNING MOMENTS.',
      'ONE\nUNSTOPPABLE\nTEAM.',
      'AND FINALLY...',
    ],
    isGold: false,
  },
  // Scene 5 — The Gold Reveal
  {
    tag: 'SCENE 5 — THE GOLD REVEAL',
    lines: [
      'THE WAIT IS OVER.',
      'THE HARD WORK\nPAID OFF.',
      'WE DID IT!',
      'WE REACHED\nGOLD!',
    ],
    isGold: true,
  },
  // Scene 6 — Achievement Showcase
  {
    tag: 'SCENE 6 — ACHIEVEMENT SHOWCASE',
    lines: [
      '280 ACHIEVERS.',
      '2,661\nSKILL BADGES.',
      '112% OF OUR\nTARGET.',
      'ONE INCREDIBLE\nMILESTONE.',
    ],
    isGold: true,
  },
  // Scene 7 — The Emotional Finale
  {
    tag: 'SCENE 7 — THE EMOTIONAL FINALE',
    lines: [
      'THIS IS MORE THAN\nAN ACHIEVEMENT.',
      'THIS IS OUR JOURNEY.',
      'THIS IS OUR\nTEAMWORK.',
      'THIS IS OUR\nCOMMUNITY.',
      'THIS GOLD BELONGS\nTO EVERYONE.',
    ],
    isGold: true,
  },
  // Final Screen
  {
    tag: 'GDG ON-CAMPUS NECN',
    lines: [
      'ONE TEAM.',
      'ONE COMMUNITY.',
      'ONE GOLDEN MILESTONE.',
      'WE MADE IT HAPPEN.',
    ],
    isGold: true,
  },
];

// Spark particle interface
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

  // Particles ref
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Dedicated Gold Celebration Confetti Colors
  const goldCelebrationColors = [
    '#FFD700', // 24K Brilliant Gold
    '#F3E5AB', // Soft Champagne
    '#E6B800', // Metallic Gold
    '#D4AF37', // Antique Gold
    '#FFF8DC', // Pale Gold
    '#ECC5A8', // Warm Rose-Gold
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

  // Trigger Gold Confetti celebration blast
  const fireGoldCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    party({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: goldCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    party({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: goldCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      party({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.5, y: 0.35 },
        colors: goldCelebrationColors,
        scalar: 1.25,
        startVelocity: 32,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 320);
  }, []);

  // Golden Sparks Engine (Floating embers + radial bursts from video reference)
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

    const sparkColors = ['#FFD700', '#FFE57F', '#FFB300', '#FF9100', '#FFFFFF'];

    // Spawn initial floating ambient embers
    const ambientCount = 38;
    const sparks: Spark[] = [];
    for (let i = 0; i < ambientCount; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -0.6 - Math.random() * 1.2,
        size: 1.2 + Math.random() * 2.4,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: Math.random() * 0.8,
        maxAlpha: 0.4 + Math.random() * 0.55,
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

  // Burst sparks from text center on sentence change
  const triggerSparksBurst = useCallback(() => {
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.48;
    const sparkColors = ['#FFD700', '#FFE57F', '#FFB300', '#FF9100', '#FFFFFF'];
    const burstCount = 28;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 5.5;
      sparksRef.current.push({
        x: centerX + (Math.random() - 0.5) * 160,
        y: centerY + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: 1.5 + Math.random() * 2.8,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: 0.95,
        maxAlpha: 1.0,
        decay: 0.02 + Math.random() * 0.02,
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

      // Gold confetti on major climaxes
      if (currentSceneIndex === 4 && nextIdx === activeScene.lines.length - 1) {
        fireGoldCelebration();
      }
      if (currentSceneIndex === 7 && nextIdx === activeScene.lines.length - 1) {
        fireGoldCelebration();
      }
    } else {
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        const nextSceneIdx = currentSceneIndex + 1;
        setCurrentSceneIndex(nextSceneIdx);
        setCurrentSentenceIndex(0);

        if (nextSceneIdx >= 6) {
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
  }, [currentSceneIndex, currentSentenceIndex, fireGoldCelebration, triggerSparksBurst]);

  // Jump directly to specific scene
  const jumpToScene = useCallback(
    (sceneIdx: number) => {
      setCurrentSceneIndex(sceneIdx);
      setCurrentSentenceIndex(0);
      triggerSparksBurst();

      if (sceneIdx === 4 || sceneIdx === 7) {
        fireGoldCelebration();
      }
      if (sceneIdx >= 6) {
        onPreloadRef.current?.();
      }
    },
    [fireGoldCelebration, triggerSparksBurst]
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
  const isFinalScreen = currentSceneIndex === 7 && isClimaxSentence;

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Cinematic Celebration"
      onClick={advanceNext} // Click anywhere to step forward
    >
      {/* 1. EXACT Same Background Ambient Radial Glow (Preserved from existing intro) */}
      <div className="bmi-bg-radial" aria-hidden="true" />

      {/* 2. Volumetric Light Rays (God Rays from Video Reference) */}
      <div className="bmi-volumetric-container" aria-hidden="true">
        <div className="bmi-volumetric-rays" />
        <div className="bmi-central-flare" />
      </div>

      {/* 3. Golden Sparks & Embers Canvas (Floating & Bursting particles from video) */}
      <canvas ref={sparksCanvasRef} className="bmi-sparks-canvas" aria-hidden="true" />

      {/* 4. Dedicated High-Z-Index Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 5. Top Header Bar (Chapter Identity & Navigation) */}
      <header
        className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GDG Chapter Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/70 shadow-xs border border-[#FFB800]/50 p-1 flex items-center justify-center shrink-0 backdrop-blur-md">
            <img src="/gdg-brackets-logo.png" alt="GDG" className="w-full h-full object-contain" />
          </div>
          <div className="hidden min-[420px]:block text-left">
            <p className="text-[11px] font-black tracking-wider uppercase text-slate-800 leading-tight">
              GDG On-Campus NECN
            </p>
            <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">
              Google Cloud 2026
            </p>
          </div>
        </div>

        {/* Scene Step Progress Indicator */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#FFB800]/40 shadow-xs backdrop-blur-md"
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

      {/* 6. Main Stage (ZERO BACKGROUND — AUTHENTIC GOLDEN NEON TUBE TYPOGRAPHY & LIGHTING) */}
      <main className="bmi-experience-stage w-full">
        {/* Scene Tag Pill with Google Quad-Color Dots & Clean Neon Outline */}
        <div className="mb-6 sm:mb-10 flex justify-center">
          <div className={`bmi-scene-tag-clean ${activeScene.isGold ? 'bmi-scene-tag-gold-clean' : ''}`}>
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
            CINEMATIC SENTENCE PRESENTATION (VIDEO REFERENCE EFFECTS)
            - Multi-line balanced stacking matching video composition
            - Golden neon tube outline typography
            - Electric neon ignition strike
            =================================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center px-4 relative z-10">
          {/* Active sentence container with key to trigger neon ignition animation */}
          <div
            key={`${currentSceneIndex}-${currentSentenceIndex}`}
            className="bmi-neon-ignite w-full flex flex-col items-center justify-center"
          >
            {/* Contextual Icon for Scene 6 Metrics */}
            {currentSceneIndex === 5 && (
              <div className="mb-4 sm:mb-6 flex items-center justify-center">
                {currentSentenceIndex === 0 && (
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 drop-shadow-[0_0_18px_rgba(255,184,0,0.9)]" />
                )}
                {currentSentenceIndex === 1 && (
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 drop-shadow-[0_0_18px_rgba(59,130,246,0.9)]" />
                )}
                {currentSentenceIndex === 2 && (
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_0_20px_rgba(251,188,4,1)]" />
                )}
                {currentSentenceIndex === 3 && (
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 drop-shadow-[0_0_24px_rgba(251,188,4,1)]" />
                )}
              </div>
            )}

            {/* Climax defining moment badge */}
            {isClimaxSentence && !isFinalScreen && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#FBBC04] shadow-[0_0_8px_#FBBC04]" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-600 uppercase">
                  ★ THE DEFINING MOMENT ★
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FBBC04] shadow-[0_0_8px_#FBBC04]" />
              </div>
            )}

            {/* Final Screen Grand Composition (Frame 4 in Video Reference) */}
            {isFinalScreen ? (
              <div className="w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest text-amber-600 bmi-neon-video-header">
                  GDG ON-CAMPUS NECN
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-amber-700/90 bmi-neon-video-subline">
                  • ONE TEAM • ONE COMMUNITY • ONE GOLDEN MILESTONE •
                </p>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-center bmi-neon-video-climax bmi-streak-effect flex items-center justify-center gap-3 sm:gap-6">
                  <span className="text-amber-400 text-3xl sm:text-5xl">✦</span>
                  <span>WE MADE IT HAPPEN</span>
                  <span className="text-amber-400 text-3xl sm:text-5xl">✦</span>
                </h1>

                <div className="mt-8 pt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={handleSkip}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_28px_rgba(251,188,4,0.65)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter Chapter Leaderboard & Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Standard & Climax Sentences with Natural Stacked Line Typography */
              <h1
                className={`w-full max-w-3xl font-black uppercase tracking-tight text-center ${
                  isClimaxSentence
                    ? 'bmi-neon-video-climax bmi-streak-effect text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
                    : 'bmi-neon-video-text bmi-streak-effect text-2xl sm:text-4xl md:text-5xl'
                }`}
              >
                {activeLine.split('\n').map((line, idx) => (
                  <span key={idx} className="block leading-[1.12] my-1">
                    {line}
                  </span>
                ))}
              </h1>
            )}
          </div>

          {/* Subdued Line Tracker */}
          <div className="mt-10 sm:mt-14 flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span>
              SENTENCE 0{currentSentenceIndex + 1} OF 0{activeScene.lines.length}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 flex items-center gap-1 font-sans">
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
