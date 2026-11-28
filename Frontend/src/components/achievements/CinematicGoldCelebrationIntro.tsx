import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CinematicFireworksEngine } from './CinematicFireworksCanvas';
import { GoldTrophy3D } from './GoldTrophy3D';
import { Trophy, Award, Users, Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import './CinematicGoldCelebrationIntro.css';

interface CinematicGoldCelebrationIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface StoryScene {
  tag: string;
  headline: string;
  body: string;
  badgeClass?: string;
  fireworksIntensity: 'off' | 'subtle' | 'building' | 'grand_finale';
  fireworksTheme: 'gold' | 'google' | 'mixed';
  duration: number; // in ms
}

const STORY_SCENES: StoryScene[] = [
  {
    tag: 'SCENE 01 — THE CHALLENGE',
    headline: "IT WASN'T AN EASY JOURNEY.",
    body: 'There were tough situations, tight deadlines, difficult labs, and moments that tested our patience.',
    fireworksIntensity: 'off',
    fireworksTheme: 'google',
    duration: 5200,
  },
  {
    tag: 'SCENE 02 — THE STRUGGLE',
    headline: 'SOME DAYS WERE TOUGH. BUT WE NEVER STOPPED.',
    body: 'Some goals felt impossible. Some challenges took multiple attempts. But we kept learning, trying, and moving forward.',
    fireworksIntensity: 'off',
    fireworksTheme: 'google',
    duration: 5200,
  },
  {
    tag: 'SCENE 03 — THE TEAMWORK',
    headline: "WE DIDN'T WALK THIS JOURNEY ALONE.",
    body: 'Students supported students. Volunteers helped clear doubts. The team stood together, motivated one another, and never gave up.',
    fireworksIntensity: 'subtle',
    fireworksTheme: 'mixed',
    duration: 5400,
  },
  {
    tag: 'SCENE 04 — THE BREAKTHROUGH',
    headline: 'INDIVIDUAL EFFORTS. ONE POWERFUL COMMUNITY.',
    body: 'Every completed lab, every earned badge, and every helping hand brought us closer to our shared goal.',
    fireworksIntensity: 'building',
    fireworksTheme: 'mixed',
    duration: 5400,
  },
  {
    tag: 'SCENE 05 — THE VICTORY',
    headline: 'TOGETHER, WE MADE IT HAPPEN.',
    body: 'We turned challenges into achievements, determination into results, and teamwork into something extraordinary.',
    fireworksIntensity: 'building',
    fireworksTheme: 'gold',
    duration: 5400,
  },
];

export const CinematicGoldCelebrationIntro: React.FC<CinematicGoldCelebrationIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  // Phase management
  // 0-4: Story Scenes 01 to 05
  // 5: Dramatic Pause
  // 6: Grand Gold Reveal (Trophy + Animated Metrics)
  // 7: Final Emotional Message
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [cardVisible, setCardVisible] = useState<boolean>(true);

  // Animated counters for Scene 6
  const [achieversCount, setAchieversCount] = useState<number>(0);
  const [badgesCount, setBadgesCount] = useState<number>(0);
  const [targetPercentage, setTargetPercentage] = useState<number>(0);

  // References
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CinematicFireworksEngine | null>(null);
  const sceneTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // 1. Initialize Fireworks Canvas Engine
  useEffect(() => {
    if (!fireworksCanvasRef.current) return;

    try {
      const engine = new CinematicFireworksEngine(fireworksCanvasRef.current);
      engine.start();
      engineRef.current = engine;

      const handleResize = () => engine.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        engine.stop();
        engine.clear();
      };
    } catch {
      // safe fallback if canvas 2d unsupported
    }
  }, []);

  // 2. Animate Counters when entering Scene 6 (Grand Gold Reveal)
  useEffect(() => {
    if (currentScene !== 6) return;

    const duration = 2200; // ms
    const startTime = performance.now();

    const targetAchievers = 280;
    const targetBadges = 2661;
    const targetPct = 112;

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setAchieversCount(Math.round(targetAchievers * ease));
      setBadgesCount(Math.round(targetBadges * ease));
      setTargetPercentage(Math.round(targetPct * ease));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      }
    };

    requestAnimationFrame(animateCounters);
  }, [currentScene]);

  // 3. Scene Progression Controller
  const advanceToScene = useCallback((nextScene: number) => {
    setCardVisible(false);

    // Short crossfade interval between cards
    setTimeout(() => {
      setCurrentScene(nextScene);
      setCardVisible(true);

      // Fireworks orchestration
      if (engineRef.current) {
        if (nextScene < 5) {
          const cfg = STORY_SCENES[nextScene];
          engineRef.current.setIntensity(cfg.fireworksIntensity, cfg.fireworksTheme);
        } else if (nextScene === 5) {
          // Dramatic pause: quiet darkness
          engineRef.current.setIntensity('off');
        } else if (nextScene === 6) {
          // Grand Reveal: Blinding fireworks grand finale!
          engineRef.current.setIntensity('grand_finale', 'gold');
        } else if (nextScene === 7) {
          // Final Message: Sustained warm golden sparkle
          engineRef.current.setIntensity('subtle', 'gold');
        }
      }
    }, 450);
  }, []);

  // 4. Automated Scene Progression Pipeline
  useEffect(() => {
    if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);

    let nextTimeout = 5200;

    if (currentScene < 5) {
      nextTimeout = STORY_SCENES[currentScene].duration;
    } else if (currentScene === 5) {
      // Dramatic pause duration
      nextTimeout = 1600;
    } else if (currentScene === 6) {
      // Grand Reveal duration before Final Message
      nextTimeout = 9200;
    } else if (currentScene === 7) {
      // Final Message duration before exit
      nextTimeout = 8500;
    }

    sceneTimerRef.current = setTimeout(() => {
      if (currentScene < 7) {
        advanceToScene(currentScene + 1);
      } else {
        // Preload & exit
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 1100);
      }
    }, nextTimeout);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    };
  }, [currentScene, advanceToScene]);

  // Skip / Instant Exit Handler
  const handleSkip = useCallback(() => {
    onPreloadRef.current?.();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 400);
  }, []);

  return (
    <div
      className={`cg-overlay ${isExiting ? 'cg-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Cinematic Celebration"
    >
      {/* 1. Moving Aurora & Volumetric Light Beams */}
      <div className="cg-aurora-container" aria-hidden="true">
        <div className="cg-aurora-beam cg-aurora-beam-1" />
        <div className="cg-aurora-beam cg-aurora-beam-2" />
        {currentScene >= 5 && <div className="cg-aurora-beam cg-aurora-beam-gold" />}
      </div>

      {/* 2. Custom Fireworks Light & Sparks Canvas Engine */}
      <canvas ref={fireworksCanvasRef} className="cg-fireworks-canvas" aria-hidden="true" />

      {/* 3. Top Navigation & Progress Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Chapter Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shadow-xs">
            <img src="/gdg-brackets-logo.png" alt="GDG" className="w-full h-full object-contain" />
          </div>
          <div className="hidden min-[420px]:block">
            <p className="text-[11px] font-black tracking-widest text-white/90 uppercase leading-none">
              GDG On-Campus NECN
            </p>
            <p className="text-[9px] font-semibold text-amber-300 tracking-wider uppercase mt-0.5">
              Google Cloud 2026
            </p>
          </div>
        </div>

        {/* Scene Indicator Dots */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md">
          {[0, 1, 2, 3, 4, 6, 7].map((sIndex, idx) => {
            const isCurrent = currentScene === sIndex || (currentScene === 5 && sIndex === 4);
            const isPast = currentScene > sIndex;
            return (
              <button
                key={sIndex}
                onClick={() => advanceToScene(sIndex)}
                className={`cg-step-dot ${isCurrent ? 'active' : ''} ${isPast ? 'past' : ''}`}
                title={`Jump to Scene ${idx + 1}`}
                aria-label={`Jump to Scene ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Skip to Dashboard Button */}
        <button
          onClick={handleSkip}
          className="cg-skip-button"
          title="Proceed directly to website dashboard"
        >
          <span>Skip to Leaderboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-300" />
        </button>
      </header>

      {/* 4. Main Stage — Cinematic Scenes */}
      <main className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center justify-center text-center">
        {/* ===================================================================
            SCENES 01 to 05 — THE EMOTIONAL STORYTELLING SEQUENCE
            =================================================================== */}
        {currentScene < 5 && (
          <div
            className={`w-full max-w-2xl cg-liquid-glass-card p-6 sm:p-10 transition-all duration-500 transform ${
              cardVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="cg-luminous-outline" />

            {/* Scene Tag Pill */}
            <div className="mb-4 sm:mb-6">
              <span className="cg-scene-badge">
                <Sparkles className="w-3 h-3 text-[#00F0FF]" />
                <span>{STORY_SCENES[currentScene].tag}</span>
              </span>
            </div>

            {/* Headline with Light Streak */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4 sm:mb-6 cg-title-cinematic">
              <span className="cg-light-streak-text">
                {STORY_SCENES[currentScene].headline}
              </span>
            </h2>

            {/* Body Text */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300/95 font-medium leading-relaxed max-w-xl mx-auto">
              {STORY_SCENES[currentScene].body}
            </p>

            {/* Next Cue Button */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-mono tracking-wider text-slate-400">
                SCENE 0{currentScene + 1} OF 05
              </span>
              <button
                onClick={() => advanceToScene(currentScene + 1)}
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCENE 05b — DRAMATIC PAUSE (Darkness & Anticipation)
            =================================================================== */}
        {currentScene === 5 && (
          <div className="text-center animate-pulse">
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 mx-auto shadow-[0_0_24px_#FFD700]" />
          </div>
        )}

        {/* ===================================================================
            SCENE 06 — THE GRAND GOLD ACHIEVEMENT REVEAL
            =================================================================== */}
        {currentScene === 6 && (
          <div
            className={`w-full max-w-3xl cg-liquid-glass-card cg-liquid-glass-gold p-6 sm:p-9 transition-all duration-700 transform ${
              cardVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            {/* Header Badge */}
            <div className="mb-3 sm:mb-4">
              <span className="cg-scene-badge cg-scene-badge-gold">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>OFFICIAL CHAPTER MILESTONE • 2026</span>
              </span>
            </div>

            {/* 3D Interactive Gold Trophy Hero View */}
            <div className="w-full h-44 sm:h-56 md:h-64 my-1 relative">
              <GoldTrophy3D className="w-full h-full" isRevealed={true} />
            </div>

            {/* The Grand Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight mb-2 cg-title-gold">
              <span className="cg-light-streak-text">
                WE DID IT. WE REACHED GOLD!
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-amber-200/90 font-semibold tracking-wide uppercase mb-6">
              Google Cloud Learn with Communities 2026 • GDG On-Campus NECN
            </p>

            {/* The 3 Extraordinary Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-2">
              {/* Pod 1: Achievers */}
              <div className="cg-metric-pod flex flex-col items-center text-center">
                <Users className="w-5 h-5 text-amber-300 mb-1" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                  {achieversCount}
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-300 uppercase mt-1">
                  ACHIEVERS
                </span>
              </div>

              {/* Pod 2: Skill Badges */}
              <div className="cg-metric-pod flex flex-col items-center text-center">
                <Award className="w-5 h-5 text-amber-300 mb-1" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                  {badgesCount.toLocaleString()}
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-300 uppercase mt-1">
                  SKILL BADGES
                </span>
              </div>

              {/* Pod 3: Target Percentage */}
              <div className="cg-metric-pod flex flex-col items-center text-center">
                <Trophy className="w-5 h-5 text-amber-300 mb-1" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-black font-mono text-white tracking-tight">
                  {targetPercentage}%
                </span>
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-300 uppercase mt-1">
                  GOLD TARGET ACHIEVED
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-amber-400/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-amber-200/80 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Official Tier Status: GOLD CHAPTER</span>
              </span>
              <button
                onClick={() => advanceToScene(7)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Read Final Message</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            SCENE 07 — FINAL EMOTIONAL MESSAGE
            =================================================================== */}
        {currentScene === 7 && (
          <div
            className={`w-full max-w-2xl cg-liquid-glass-card cg-liquid-glass-gold p-7 sm:p-11 text-center transition-all duration-700 transform ${
              cardVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="cg-luminous-outline" />

            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-300/30 mx-auto mb-5 flex items-center justify-center shadow-[0_0_30px_rgba(255,215,0,0.25)]">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>

            {/* Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4 cg-title-gold">
              "THIS ACHIEVEMENT BELONGS TO EVERYONE."
            </h2>

            {/* Emotional Body */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed max-w-lg mx-auto mb-6 font-medium">
              Every student who participated. Every volunteer who guided. Every team member who supported. Every person who refused to give up.
            </p>

            {/* Inspiring Tagline */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-8 inline-block">
              <p className="text-xs sm:text-sm font-black tracking-widest text-amber-300 uppercase">
                ONE TEAM. ONE COMMUNITY. ONE GOLDEN MILESTONE.
              </p>
            </div>

            {/* Final Call to Action */}
            <div>
              <button
                onClick={handleSkip}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_0_32px_rgba(255,215,0,0.6)] hover:scale-105 active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Chapter Leaderboard & Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 5. Bottom Chapter Verification Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-center text-[10px] text-slate-400 font-semibold tracking-wider uppercase border-t border-white/5 bg-black/20 backdrop-blur-md">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default CinematicGoldCelebrationIntro;
