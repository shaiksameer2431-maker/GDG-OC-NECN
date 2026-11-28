import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Users, Sparkles, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
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
  const [sentenceVisible, setSentenceVisible] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Animated counters for Scene 6
  const [countAchievers, setCountAchievers] = useState<number>(0);
  const [countBadges, setCountBadges] = useState<number>(0);
  const [countTarget, setCountTarget] = useState<number>(0);

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
        particleCount: 65,
        spread: 95,
        origin: { x: 0.5, y: 0.35 },
        colors: goldCelebrationColors,
        scalar: 1.25,
        startVelocity: 30,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 350);
  }, []);

  // Animate counters when entering Scene 6
  useEffect(() => {
    if (currentSceneIndex !== 5) return;

    const duration = 2000;
    const startTime = performance.now();
    const targetAch = 280;
    const targetBad = 2661;
    const targetPct = 112;

    const animateCounters = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      setCountAchievers(Math.round(targetAch * ease));
      setCountBadges(Math.round(targetBad * ease));
      setCountTarget(Math.round(targetPct * ease));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [currentSceneIndex]);

  // Advance to next sentence or next scene
  const advanceNext = useCallback(() => {
    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    // In Scene 6, showcase the metric pods as a single grand scene
    if (currentSceneIndex === 5) {
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        setSentenceVisible(false);
        setTimeout(() => {
          setCurrentSceneIndex((prev) => prev + 1);
          setCurrentSentenceIndex(0);
          setSentenceVisible(true);
        }, 300);
      } else {
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => onCompleteRef.current?.(), 1000);
      }
      return;
    }

    if (currentSentenceIndex < activeScene.lines.length - 1) {
      // Step to next sentence within the same scene
      setSentenceVisible(false);
      setTimeout(() => {
        setCurrentSentenceIndex((prev) => prev + 1);
        setSentenceVisible(true);

        // Climax sentence in Scene 5 ("WE REACHED GOLD!") triggers gold confetti
        if (currentSceneIndex === 4 && currentSentenceIndex + 1 === activeScene.lines.length - 1) {
          fireGoldCelebration();
        }
      }, 260);
    } else {
      // Finished all sentences in this scene -> advance to next scene
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        setSentenceVisible(false);
        setTimeout(() => {
          setCurrentSceneIndex((prev) => prev + 1);
          setCurrentSentenceIndex(0);
          setSentenceVisible(true);
        }, 320);
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
    setSentenceVisible(false);
    setTimeout(() => {
      setCurrentSceneIndex(sceneIdx);
      setCurrentSentenceIndex(0);
      setSentenceVisible(true);

      if (sceneIdx === 4) {
        fireGoldCelebration();
      }
    }, 280);
  }, [fireGoldCelebration]);

  // Automated sentence pacing:
  // Non-climax sentences pause for ~2.2s; Climax sentences pause for ~3.6s
  useEffect(() => {
    if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current);

    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    // Special duration for Scene 6 (metric pods)
    if (currentSceneIndex === 5) {
      sentenceTimerRef.current = setTimeout(advanceNext, 5600);
      return () => {
        if (sentenceTimerRef.current) clearTimeout(sentenceTimerRef.current);
      };
    }

    const isLastSentenceOfScene = currentSentenceIndex === activeScene.lines.length - 1;
    const duration = isLastSentenceOfScene ? 3600 : 2200;

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

  // Split words for neon word-level borders
  const words = activeLine.split(' ');

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Cinematic Celebration"
      onClick={advanceNext} // Click anywhere to step forward
    >
      {/* 1. EXACT Same Background Ambient Radial Glow (Preserved from existing Intro Design) */}
      <div className="bmi-bg-radial" aria-hidden="true" />

      {/* 2. Dedicated High-Z-Index Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 3. Top Header Bar (Chapter Identity & Navigation) */}
      <header
        className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()} // Prevent accidental trigger when clicking buttons
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

      {/* 4. Main Stage (Open, Transparent, Sentence-by-Sentence with Neon Text Borders) */}
      <main className="bmi-experience-stage w-full">
        {/* Scene Tag Pill with Google Quad-Color Dots & Neon Border */}
        <div className="mb-8 flex justify-center">
          <div className={`bmi-scene-tag ${activeScene.isGold ? 'bmi-scene-tag-gold' : ''}`}>
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
            SCENES 1, 2, 3, 4, 5, 7, 8: SENTENCE-BY-SENTENCE CINEMATIC PRESENTATION
            =================================================================== */}
        {currentSceneIndex !== 5 && (
          <div
            className={`w-full max-w-3xl flex flex-col items-center justify-center text-center transition-all duration-300 transform ${
              sentenceVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
            }`}
          >
            {/* If NOT Climax: Sleek Neon Sentence Pod */}
            {!isClimaxSentence ? (
              <div className="bmi-sentence-pill">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-sans uppercase tracking-tight bmi-neon-text-cyan bmi-streak-effect">
                  {words.map((word, wIdx) => (
                    <span key={wIdx} className="bmi-neon-word-box">
                      {word}
                    </span>
                  ))}
                </h1>
              </div>
            ) : (
              /* If CLIMAX / MAIN CONTEXT: Massive Special Effect with Pulsing Gold Aura & Neon Halo */
              <div className="bmi-climax-special-effect">
                <div className="flex items-center gap-2 mb-2" aria-hidden="true">
                  <span className="w-2 h-2 rounded-full bg-[#FBBC04] animate-ping" />
                  <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-600 uppercase">
                    ★ THE DEFINING MOMENT ★
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FBBC04] animate-ping" />
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-sans uppercase tracking-tight bmi-neon-text-gold bmi-streak-effect">
                  {words.map((word, wIdx) => (
                    <span key={wIdx} className="bmi-neon-word-box bmi-neon-word-box-gold">
                      {word}
                    </span>
                  ))}
                </h1>

                {/* Subtitle tag on final screen */}
                {currentSceneIndex === 7 && (
                  <div className="mt-6 pt-4 border-t border-amber-300/60" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={handleSkip}
                      className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_24px_rgba(251,188,4,0.6)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Enter Chapter Leaderboard & Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Sentence Index Indicator */}
            <div className="mt-8 flex items-center gap-2 text-xs font-mono font-bold text-slate-500">
              <span>LINE 0{currentSentenceIndex + 1} OF 0{activeScene.lines.length}</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 flex items-center gap-1">
                <span>Tap or Click to Advance</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCENE 6: ACHIEVEMENT SHOWCASE WITH METRIC PODS
            =================================================================== */}
        {currentSceneIndex === 5 && (
          <div
            className={`w-full max-w-3xl flex flex-col items-center justify-center text-center transition-all duration-400 transform ${
              sentenceVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
            }`}
          >
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight mb-4 bmi-neon-text-cyan">
              OUR HISTORIC GOLD CHAPTER MILESTONES
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-2 w-full">
              {/* Pod 1: 280 Achievers */}
              <div className="bmi-metric-pod flex flex-col items-center text-center">
                <div className="p-2 rounded-xl bg-amber-500/10 mb-1">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 tracking-tight">
                  {countAchievers}
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
                  {countBadges.toLocaleString()}
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
                  {countTarget}%
                </span>
                <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase mt-1">
                  112% OF TARGET
                </span>
              </div>
            </div>

            {/* Special Climax Pill for Scene 6 */}
            <div className="mt-4 bmi-climax-special-effect py-3 px-6">
              <span className="text-sm sm:text-base font-black tracking-widest uppercase bmi-neon-text-gold">
                ONE INCREDIBLE MILESTONE.
              </span>
            </div>
          </div>
        )}
      </main>

      {/* 5. Bottom Chapter Identity Strip */}
      <footer className="w-full max-w-5xl py-2 px-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider z-20">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default BronzeMilestoneIntro;
