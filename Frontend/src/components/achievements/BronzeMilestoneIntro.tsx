import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Users, Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface CaptionScene {
  tag: string;
  lines: string[];
  isGold: boolean;
  duration: number; // ms
}

const CINEMATIC_SCENES: CaptionScene[] = [
  // Scene 1 — The Beginning
  {
    tag: 'SCENE 1 — THE BEGINNING',
    lines: [
      'IT WAS NEVER AN EASY JOURNEY.',
      'EVERY STEP TESTED US.',
      'EVERY CHALLENGE MADE US STRONGER.',
      'BUT WE NEVER GAVE UP.',
    ],
    isGold: false,
    duration: 4800,
  },
  // Scene 2 — The Struggle
  {
    tag: 'SCENE 2 — THE STRUGGLE',
    lines: [
      'LATE NIGHTS.',
      'COUNTLESS LABS.',
      'UNEXPECTED CHALLENGES.',
      'ONE GOAL IN OUR MINDS.',
      'WE KEPT MOVING FORWARD.',
    ],
    isGold: false,
    duration: 4800,
  },
  // Scene 3 — The Unity
  {
    tag: 'SCENE 3 — THE UNITY',
    lines: [
      "WE DIDN'T DO IT ALONE.",
      'WE LEARNED TOGETHER.',
      'WE HELPED EACH OTHER.',
      'WE GREW TOGETHER.',
      'EVERY STUDENT MATTERED.',
      'EVERY EFFORT COUNTED.',
    ],
    isGold: false,
    duration: 5200,
  },
  // Scene 4 — The Turning Point
  {
    tag: 'SCENE 4 — THE TURNING POINT',
    lines: [
      '438 STUDENTS.',
      'ONE COMMUNITY.',
      'THOUSANDS OF LEARNING MOMENTS.',
      'ONE UNSTOPPABLE TEAM.',
      'AND FINALLY...',
    ],
    isGold: false,
    duration: 4800,
  },
  // Scene 5 — The Gold Reveal
  {
    tag: 'SCENE 5 — THE GOLD REVEAL',
    lines: [
      'THE WAIT IS OVER.',
      'THE HARD WORK PAID OFF.',
      'WE DID IT!',
      'WE REACHED GOLD!',
    ],
    isGold: true,
    duration: 5500,
  },
  // Scene 6 — Achievement Showcase (handled with dedicated metric pods)
  {
    tag: 'SCENE 6 — ACHIEVEMENT SHOWCASE',
    lines: [
      '280 ACHIEVERS.',
      '2,661 SKILL BADGES.',
      '112% OF OUR TARGET.',
      'ONE INCREDIBLE MILESTONE.',
    ],
    isGold: true,
    duration: 5800,
  },
  // Scene 7 — The Emotional Finale
  {
    tag: 'SCENE 7 — THE EMOTIONAL FINALE',
    lines: [
      'THIS IS MORE THAN AN ACHIEVEMENT.',
      'THIS IS OUR JOURNEY.',
      'THIS IS OUR TEAMWORK.',
      'THIS IS OUR COMMUNITY.',
      'THIS GOLD BELONGS TO EVERYONE.',
    ],
    isGold: true,
    duration: 5400,
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
    duration: 6500,
  },
];

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [cardVisible, setCardVisible] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Animated counters for Scene 6
  const [counterAchievers, setCounterAchievers] = useState<number>(0);
  const [counterBadges, setCounterBadges] = useState<number>(0);
  const [counterTarget, setCounterTarget] = useState<number>(0);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Dedicated Gold Celebration Colors
  const goldCelebrationColors = [
    '#FFD700', // Pure 24K Brilliant Gold
    '#F3E5AB', // Soft Polished Champagne
    '#E6B800', // Imperial Metallic Gold
    '#D4AF37', // Burnished Antique Gold
    '#FFF8DC', // Pale Cornsilk
    '#ECC5A8', // Warm Rose-Gold Accent
    '#C5A059', // Vegas Gold Satin
    '#FFFFFF', // Diamond Specular Fleck
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

  // Trigger Gold Confetti celebration blast (called on Scene 5 Gold Reveal)
  const fireGoldCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    // Cannon 1 (Left)
    party({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.8 },
      colors: goldCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    // Cannon 2 (Right)
    party({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.8 },
      colors: goldCelebrationColors,
      scalar: 1.15,
      startVelocity: 44,
      gravity: 0.8,
      ticks: 240,
      disableForReducedMotion: true,
    });

    // Apex Starburst (Center)
    setTimeout(() => {
      party({
        particleCount: 60,
        spread: 95,
        origin: { x: 0.5, y: 0.35 },
        colors: goldCelebrationColors,
        scalar: 1.25,
        startVelocity: 28,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 350);

    // Streamer drift
    setTimeout(() => {
      party({
        particleCount: 35,
        spread: 120,
        origin: { x: 0.5, y: 0.08 },
        colors: goldCelebrationColors,
        scalar: 0.95,
        startVelocity: 15,
        gravity: 0.65,
        drift: 0.05,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 700);
  }, []);

  // Animate counters when entering Scene 6
  useEffect(() => {
    if (currentSceneIndex !== 5) return; // Scene 6 is index 5

    const duration = 2000;
    const startTime = performance.now();
    const targetAch = 280;
    const targetBad = 2661;
    const targetPct = 112;

    const animateCounters = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounterAchievers(Math.round(targetAch * ease));
      setCounterBadges(Math.round(targetBad * ease));
      setCounterTarget(Math.round(targetPct * ease));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [currentSceneIndex]);

  // Navigate to scene with smooth crossfade
  const goToScene = useCallback(
    (index: number) => {
      setCardVisible(false);

      setTimeout(() => {
        setCurrentSceneIndex(index);
        setCardVisible(true);

        // Climax confetti on Scene 5 (The Gold Reveal)
        if (index === 4) {
          fireGoldCelebration();
        }
      }, 350);
    },
    [fireGoldCelebration]
  );

  // Auto-progression timer
  useEffect(() => {
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);

    const scene = CINEMATIC_SCENES[currentSceneIndex];
    const duration = scene ? scene.duration : 5000;

    sceneTimerRef.current = setTimeout(() => {
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        goToScene(currentSceneIndex + 1);
      } else {
        // Final screen completed -> preload and transition into website
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 1100);
      }
    }, duration);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    };
  }, [currentSceneIndex, goToScene]);

  // Skip directly to website
  const handleSkip = useCallback(() => {
    onPreloadRef.current?.();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 400);
  }, []);

  const activeScene = CINEMATIC_SCENES[currentSceneIndex];

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Cinematic Celebration"
    >
      {/* 1. EXACT Same Background Ambient Radial Glow (Preserved from original Intro Design) */}
      <div className="bmi-bg-radial" aria-hidden="true" />

      {/* 2. Dedicated High-Z-Index Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 3. Top Header Bar (Chapter Identity & Navigation) */}
      <header className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-10">
        {/* GDG Chapter Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200/90 p-1 flex items-center justify-center shrink-0">
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
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-md"
          role="tablist"
          aria-label="Scene progress"
        >
          {CINEMATIC_SCENES.map((s, idx) => {
            const isCurrent = currentSceneIndex === idx;
            const isPast = currentSceneIndex > idx;
            return (
              <button
                key={idx}
                onClick={() => goToScene(idx)}
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

      {/* 4. Main Stage (Liquid-Glass Cinematic Card on the Existing Background) */}
      <div className="bmi-experience-stage w-full">
        <div
          className={`bmi-cinematic-card ${activeScene.isGold ? 'bmi-cinematic-card-gold' : ''} p-6 sm:p-10 text-center transition-all duration-500 transform ${
            cardVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
          }`}
        >
          {/* Physical Specular Refraction Glass Overlay */}
          <div className="bmi-glass-specular" aria-hidden="true" />

          {/* Scene Tag Pill with Google Quad-Color Dots */}
          <div className="mb-5 sm:mb-6 flex justify-center">
            <div className={`bmi-scene-tag ${activeScene.isGold ? 'bmi-scene-tag-gold' : ''}`}>
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
              </div>
              <span>{activeScene.tag}</span>
              <Sparkles className="w-3 h-3 text-amber-500" aria-hidden="true" />
            </div>
          </div>

          {/* =================================================================
              SCENES 1, 2, 3, 4, 5, 7: SEQUENTIAL CAPTION LINES
              ================================================================= */}
          {currentSceneIndex !== 5 && currentSceneIndex !== 7 && (
            <div className="space-y-3 sm:space-y-4 py-2">
              {activeScene.lines.map((line, lIdx) => {
                const isClimaxLine = lIdx === activeScene.lines.length - 1;
                return (
                  <div key={lIdx} className="overflow-hidden">
                    <h2
                      className={`bmi-caption-line ${
                        isClimaxLine
                          ? 'bmi-light-streak-active text-2xl sm:text-3xl md:text-4xl ' +
                            (activeScene.isGold ? 'bmi-text-gold' : 'text-slate-950')
                          : 'text-lg sm:text-xl md:text-2xl text-slate-800'
                      }`}
                    >
                      {line}
                    </h2>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================================
              SCENE 6: ACHIEVEMENT SHOWCASE WITH METRIC PODS
              ================================================================= */}
          {currentSceneIndex === 5 && (
            <div className="py-2 space-y-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                OUR HISTORIC GOLD CHAPTER MILESTONES
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-3">
                {/* Pod 1: 280 Achievers */}
                <div className="bmi-metric-pod flex flex-col items-center text-center">
                  <div className="p-2 rounded-xl bg-amber-500/10 mb-1">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                    {counterAchievers}
                  </span>
                  <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase mt-1">
                    280 ACHIEVERS
                  </span>
                </div>

                {/* Pod 2: 2,661 Skill Badges */}
                <div className="bmi-metric-pod flex flex-col items-center text-center">
                  <div className="p-2 rounded-xl bg-blue-500/10 mb-1">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                    {counterBadges.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-black tracking-widest text-blue-700 uppercase mt-1">
                    2,661 SKILL BADGES
                  </span>
                </div>

                {/* Pod 3: 112% of Target */}
                <div className="bmi-metric-pod flex flex-col items-center text-center">
                  <div className="p-2 rounded-xl bg-emerald-500/10 mb-1">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                    {counterTarget}%
                  </span>
                  <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase mt-1">
                    112% OF TARGET
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 inline-block">
                <p className="text-xs sm:text-sm font-black tracking-wider text-amber-800 uppercase">
                  ONE INCREDIBLE MILESTONE.
                </p>
              </div>
            </div>
          )}

          {/* =================================================================
              FINAL SCREEN: GDG ON-CAMPUS NECN CELEBRATION
              ================================================================= */}
          {currentSceneIndex === 7 && (
            <div className="py-2 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-300 mx-auto flex items-center justify-center shadow-xs">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-black text-slate-500 tracking-widest uppercase">
                  GDG ON-CAMPUS NECN
                </p>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  ONE TEAM. ONE COMMUNITY. ONE GOLDEN MILESTONE.
                </h2>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bmi-text-gold tracking-tight pt-1">
                  WE MADE IT HAPPEN.
                </h1>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSkip}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_4px_20px_rgba(251,188,4,0.4)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Chapter Leaderboard & Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Card Footer: Scene Counter & Next Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="font-mono text-[11px] text-slate-400">
              SCENE 0{currentSceneIndex + 1} OF 0{CINEMATIC_SCENES.length}
            </span>

            {currentSceneIndex < CINEMATIC_SCENES.length - 1 ? (
              <button
                onClick={() => goToScene(currentSceneIndex + 1)}
                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-bold transition-colors cursor-pointer"
              >
                <span>Next Scene</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[#34A853] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Celebration Concluded</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5. Bottom Chapter Identity Strip */}
      <footer className="w-full max-w-5xl py-2 px-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default BronzeMilestoneIntro;
