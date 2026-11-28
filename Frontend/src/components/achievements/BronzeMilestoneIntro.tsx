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

const CINEMATIC_SCENES: SceneData[] = [
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
  },
  // Scene 6 — Achievement Showcase
  {
    tag: 'SCENE 6 — ACHIEVEMENT SHOWCASE',
    lines: [
      '280 ACHIEVERS.',
      '2,661 SKILL BADGES.',
      '112% OF OUR TARGET.',
      'ONE INCREDIBLE MILESTONE.',
    ],
    isGold: true,
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

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  // Scene & Sentence Tracking
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const sentenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Dedicated Gold Celebration Confetti Colors
  const goldCelebrationColors = [
    '#FFD700', // 24K Brilliant Gold
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

  // Trigger Gold Confetti celebration blast
  const fireGoldCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    // Cannon 1 (Left)
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

    // Cannon 2 (Right)
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

    // Apex Starburst (Center)
    setTimeout(() => {
      party({
        particleCount: 75,
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

  // Advance to next sentence or next scene
  const advanceNext = useCallback(() => {
    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    if (currentSentenceIndex < activeScene.lines.length - 1) {
      // Step to next sentence within the same scene
      const nextIdx = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIdx);

      // Climax sentence in Scene 5 ("WE REACHED GOLD!") triggers gold confetti
      if (currentSceneIndex === 4 && nextIdx === activeScene.lines.length - 1) {
        fireGoldCelebration();
      }
      // Climax sentence in Final Scene ("WE MADE IT HAPPEN!") triggers gold confetti
      if (currentSceneIndex === 7 && nextIdx === activeScene.lines.length - 1) {
        fireGoldCelebration();
      }
    } else {
      // Finished all sentences in this scene -> advance to next scene
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        const nextSceneIdx = currentSceneIndex + 1;
        setCurrentSceneIndex(nextSceneIdx);
        setCurrentSentenceIndex(0);

        // Preload when entering the final scenes
        if (nextSceneIdx >= 6) {
          onPreloadRef.current?.();
        }
      } else {
        // Reached end of final screen -> preload & exit
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 1100);
      }
    }
  }, [currentSceneIndex, currentSentenceIndex, fireGoldCelebration]);

  // Jump directly to specific scene
  const jumpToScene = useCallback((sceneIdx: number) => {
    setCurrentSceneIndex(sceneIdx);
    setCurrentSentenceIndex(0);

    if (sceneIdx === 4 || sceneIdx === 7) {
      fireGoldCelebration();
    }
    if (sceneIdx >= 6) {
      onPreloadRef.current?.();
    }
  }, [fireGoldCelebration]);

  // Automated sentence pacing:
  // Non-climax sentences: 2.3s; Climax sentences: 3.6s
  useEffect(() => {
    if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current);

    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    const isLastSentenceOfScene = currentSentenceIndex === activeScene.lines.length - 1;
    const duration = isLastSentenceOfScene ? 3600 : 2300;

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

      {/* 2. Dedicated High-Z-Index Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 3. Top Header Bar (Chapter Identity & Navigation) */}
      <header
        className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GDG Chapter Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/70 shadow-xs border border-[#00F0FF]/50 p-1 flex items-center justify-center shrink-0 backdrop-blur-md">
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
          className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#00F0FF]/40 shadow-xs backdrop-blur-md"
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

      {/* 4. Main Stage (ZERO BACKGROUND — SENTENCE-BY-SENTENCE FADE WITH NEON BORDER TYPOGRAPHY) */}
      <main className="bmi-experience-stage w-full">
        {/* Scene Tag Pill with Google Quad-Color Dots & Clean Neon Outline */}
        <div className="mb-8 sm:mb-12 flex justify-center">
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
            ALL SCENES (1 to 8): UNIFIED SENTENCE-BY-SENTENCE FADE PRESENTATION
            ZERO BACKGROUND BOXES — NATURAL TYPOGRAPHY WITH NEON BORDERS
            =================================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center px-4">
          {/* Active sentence container with key to trigger fade animation on every sentence change */}
          <div
            key={`${currentSceneIndex}-${currentSentenceIndex}`}
            className="bmi-sentence-fade w-full flex flex-col items-center justify-center"
          >
            {/* Contextual Icon for Scene 6 Metrics (zero boxes, pure floating glow) */}
            {currentSceneIndex === 5 && (
              <div className="mb-4 sm:mb-6 flex items-center justify-center">
                {currentSentenceIndex === 0 && (
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 drop-shadow-[0_0_16px_rgba(255,184,0,0.85)]" />
                )}
                {currentSentenceIndex === 1 && (
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 drop-shadow-[0_0_16px_rgba(59,130,246,0.85)]" />
                )}
                {currentSentenceIndex === 2 && (
                  <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 drop-shadow-[0_0_18px_rgba(251,188,4,0.95)]" />
                )}
                {currentSentenceIndex === 3 && (
                  <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400 drop-shadow-[0_0_20px_rgba(251,188,4,1)]" />
                )}
              </div>
            )}

            {/* Climax tag if it's the main context sentence */}
            {isClimaxSentence && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#FBBC04] shadow-[0_0_8px_#FBBC04]" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-600 uppercase">
                  ★ THE DEFINING MOMENT ★
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FBBC04] shadow-[0_0_8px_#FBBC04]" />
              </div>
            )}

            {/* Natural, Whole Sentence with Neon Border Typography (Zero background box, zero word splitting) */}
            <h1
              className={`w-full max-w-3xl font-black uppercase tracking-tight text-center ${
                isClimaxSentence
                  ? 'bmi-neon-text-climax bmi-streak-effect text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
                  : 'bmi-neon-text bmi-streak-effect text-2xl sm:text-4xl md:text-5xl'
              }`}
            >
              {activeLine}
            </h1>

            {/* Final screen call-to-action button */}
            {currentSceneIndex === 7 && isClimaxSentence && (
              <div className="mt-8 pt-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleSkip}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_28px_rgba(251,188,4,0.65)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Chapter Leaderboard & Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Subdued Line Tracker */}
          <div className="mt-10 sm:mt-14 flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span>SENTENCE 0{currentSentenceIndex + 1} OF 0{activeScene.lines.length}</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-600 flex items-center gap-1 font-sans">
              <span>Click anywhere to advance</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </main>

      {/* 5. Bottom Chapter Identity Strip */}
      <footer className="w-full max-w-5xl py-2 px-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider z-20">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default BronzeMilestoneIntro;
