import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ChevronRight, ArrowRight } from 'lucide-react';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface CaptionItem {
  text: string;
  theme: 'pink' | 'cyan' | 'violet' | 'lime' | 'gold' | 'rainbow';
}

interface SceneData {
  tag: string;
  captions: CaptionItem[];
  isGold: boolean;
}

// Master Cinematic Caption Sequence (7 Scenes with exact captions requested)
const CINEMATIC_SCENES: SceneData[] = [
  // Scene 1 — The Journey
  {
    tag: 'SCENE 1 — THE JOURNEY',
    isGold: false,
    captions: [
      { text: 'IT WAS NEVER\nAN EASY JOURNEY.', theme: 'pink' },
      { text: 'EVERY CHALLENGE\nMADE US STRONGER.', theme: 'cyan' },
      { text: 'BUT WE NEVER\nGAVE UP.', theme: 'pink' },
    ],
  },
  // Scene 2 — The Struggle
  {
    tag: 'SCENE 2 — THE STRUGGLE',
    isGold: false,
    captions: [
      { text: 'COUNTLESS LABS.', theme: 'violet' },
      { text: 'LATE NIGHTS.', theme: 'pink' },
      { text: 'ONE GOAL.', theme: 'cyan' },
      { text: 'WE KEPT MOVING\nFORWARD.', theme: 'pink' },
    ],
  },
  // Scene 3 — The Unity
  {
    tag: 'SCENE 3 — THE UNITY',
    isGold: false,
    captions: [
      { text: "WE DIDN'T\nDO IT ALONE.", theme: 'lime' },
      { text: 'WE LEARNED\nTOGETHER.', theme: 'cyan' },
      { text: 'EVERY EFFORT\nCOUNTED.', theme: 'pink' },
    ],
  },
  // Scene 4 — The Turning Point
  {
    tag: 'SCENE 4 — THE TURNING POINT',
    isGold: false,
    captions: [
      { text: '438 STUDENTS.', theme: 'cyan' },
      { text: 'ONE COMMUNITY.', theme: 'pink' },
      { text: 'ONE UNSTOPPABLE\nTEAM.', theme: 'violet' },
      { text: 'AND FINALLY...', theme: 'cyan' },
    ],
  },
  // Scene 5 — The Gold Reveal (The Climax)
  {
    tag: 'SCENE 5 — THE GOLD REVEAL',
    isGold: true,
    captions: [
      { text: 'THE WAIT IS OVER.', theme: 'gold' },
      { text: 'WE DID IT!', theme: 'gold' },
      { text: 'WE REACHED\nGOLD!', theme: 'gold' },
    ],
  },
  // Scene 6 — The Achievement
  {
    tag: 'SCENE 6 — THE ACHIEVEMENT',
    isGold: true,
    captions: [
      { text: '280 ACHIEVERS.', theme: 'gold' },
      { text: '2,661\nSKILL BADGES.', theme: 'gold' },
    ],
  },
  // Scene 7 — The Finale & Victory Screen
  {
    tag: 'GDG ON-CAMPUS NECN',
    isGold: true,
    captions: [
      { text: 'THIS GOLD BELONGS\nTO EVERYONE.', theme: 'pink' },
      { text: 'ONE TEAM.', theme: 'cyan' },
      { text: 'ONE COMMUNITY.', theme: 'violet' },
      { text: 'ONE GOLDEN\nMILESTONE.', theme: 'gold' },
      { text: 'WE MADE IT HAPPEN.', theme: 'rainbow' },
    ],
  },
];

/**
 * Concentric Multi-Tube Neon Cloud Logo Component
 * Modeled directly on the concentric neon heart reference
 */
export const ConcentricNeonCloud: React.FC<{ size?: number; className?: string }> = ({
  size = 54,
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
        <linearGradient id="bmiNeonCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="28%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="82%" stopColor="#FF007F" />
          <stop offset="100%" stopColor="#FF3366" />
        </linearGradient>

        <filter id="bmiNeonGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Tube Glow */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        filter="url(#bmiNeonGlowFilter)"
      />

      {/* Outer Tube */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Middle Concentric Loop */}
      <path
        d="M 44 71 C 33 71 25 62 25 51 C 25 41 33 33 43 32 C 47 23 57 17 68 17 C 81 17 92 25 94 37 C 98 36 102 35 106 35 C 118 35 128 45 128 57 C 128 58 128 59 128 60 C 132 60 136 63 136 67 C 136 71 132 71 128 71 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Inner Concentric Core */}
      <path
        d="M 50 64 C 42 64 36 57 36 49 C 36 41 42 35 50 35 C 53 29 60 25 68 25 C 77 25 84 31 86 39 C 89 38 92 37 95 37 C 104 37 111 44 111 53 C 111 59 106 64 100 64 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* White-Hot Core Filament */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const captionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Multi-Neon Confetti Palette for Gold Reveal
  const multiNeonCelebrationColors = [
    '#00F0FF', // Electric Cyan
    '#FF007F', // Hot Magenta
    '#A855F7', // Neon Violet
    '#FFD700', // 24K Gold
    '#00FF88', // Electric Lime
    '#FFFFFF', // Specular White
  ];

  // Initialize Confetti
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

  // Fire multi-neon confetti on Gold Reveal
  const fireGoldCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    party({
      particleCount: 80,
      angle: 60,
      spread: 70,
      origin: { x: 0.1, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.2,
      startVelocity: 45,
      gravity: 0.8,
      ticks: 250,
      disableForReducedMotion: true,
    });

    party({
      particleCount: 80,
      angle: 120,
      spread: 70,
      origin: { x: 0.9, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.2,
      startVelocity: 45,
      gravity: 0.8,
      ticks: 250,
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      party({
        particleCount: 110,
        spread: 120,
        origin: { x: 0.5, y: 0.35 },
        colors: multiNeonCelebrationColors,
        scalar: 1.35,
        startVelocity: 38,
        gravity: 0.72,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 280);
  }, []);

  // Advance to next caption
  const advanceNext = useCallback(() => {
    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    if (currentCaptionIndex < activeScene.captions.length - 1) {
      const nextIdx = currentCaptionIndex + 1;
      setCurrentCaptionIndex(nextIdx);

      // Trigger celebration on Gold reveals
      if (currentSceneIndex === 4 && nextIdx === activeScene.captions.length - 1) {
        fireGoldCelebration();
      }
      if (currentSceneIndex === 6 && nextIdx === activeScene.captions.length - 1) {
        fireGoldCelebration();
      }
    } else {
      if (currentSceneIndex < CINEMATIC_SCENES.length - 1) {
        const nextSceneIdx = currentSceneIndex + 1;
        setCurrentSceneIndex(nextSceneIdx);
        setCurrentCaptionIndex(0);

        if (nextSceneIdx >= 5) {
          onPreloadRef.current?.();
        }
      } else {
        onPreloadRef.current?.();
        setIsExiting(true);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 1000);
      }
    }
  }, [currentSceneIndex, currentCaptionIndex, fireGoldCelebration]);

  // Jump directly to specific scene
  const jumpToScene = useCallback(
    (sceneIdx: number) => {
      setCurrentSceneIndex(sceneIdx);
      setCurrentCaptionIndex(0);

      if (sceneIdx === 4 || sceneIdx === 6) {
        fireGoldCelebration();
      }
      if (sceneIdx >= 5) {
        onPreloadRef.current?.();
      }
    },
    [fireGoldCelebration]
  );

  // Auto-advance with cinematic pacing (2.2s for standard, 3.4s for climaxes)
  useEffect(() => {
    if (captionTimerRef.current) clearTimeout(captionTimerRef.current);

    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    const isLastCaptionOfScene = currentCaptionIndex === activeScene.captions.length - 1;
    const duration = isLastCaptionOfScene ? 3200 : 2200;

    captionTimerRef.current = setTimeout(advanceNext, duration);

    return () => {
      if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
    };
  }, [currentSceneIndex, currentCaptionIndex, advanceNext]);

  // Skip directly to dashboard
  const handleSkip = useCallback(() => {
    onPreloadRef.current?.();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 350);
  }, []);

  const activeScene = CINEMATIC_SCENES[currentSceneIndex];
  const activeCaption = activeScene.captions[currentCaptionIndex];
  const isFinalScreen = currentSceneIndex === 6 && currentCaptionIndex === activeScene.captions.length - 1;

  // Determine neon tube style matching reference image
  const getTubeClass = (theme: CaptionItem['theme']): string => {
    switch (theme) {
      case 'pink':
        return 'bmi-neon-tube-pink';
      case 'cyan':
        return 'bmi-neon-tube-cyan';
      case 'violet':
        return 'bmi-neon-tube-violet';
      case 'lime':
        return 'bmi-neon-tube-lime';
      case 'gold':
        return 'bmi-neon-tube-gold';
      case 'rainbow':
        return 'bmi-neon-tube-rainbow';
      default:
        return 'bmi-neon-tube-pink';
    }
  };

  const currentTheme = activeCaption?.theme || 'pink';
  const tagClass = activeScene.isGold ? 'tag-gold' : currentTheme === 'cyan' ? 'tag-cyan' : '';
  const subClass = activeScene.isGold ? 'sub-gold' : currentTheme === 'cyan' ? 'sub-cyan' : '';

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Celebration"
      onClick={advanceNext}
    >
      {/* 1. Deep Ambient Dark Wall Depth */}
      <div className="bmi-ambient-wall" aria-hidden="true" />

      {/* 2. Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 3. Top Header Bar */}
      <header className="bmi-top-header" onClick={(e) => e.stopPropagation()}>
        {/* Chapter Branding */}
        <div className="bmi-header-branding">
          <ConcentricNeonCloud size={40} />
          <div>
            <p className="bmi-header-title">GDG On-Campus NECN</p>
            <p className="bmi-header-sub">Gold Milestone 2026</p>
          </div>
        </div>

        {/* Scene Dot Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {CINEMATIC_SCENES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToScene(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSceneIndex === idx
                  ? 'w-7 bg-pink-500 shadow-[0_0_12px_#FF007F]'
                  : currentSceneIndex > idx
                  ? 'w-2 bg-slate-600'
                  : 'w-2 bg-slate-800'
              }`}
              title={`Scene 0${idx + 1}`}
              aria-label={`Jump to scene 0${idx + 1}`}
            />
          ))}
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="bmi-skip-btn"
          title="Proceed to dashboard"
        >
          <span>Skip to Leaderboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* 4. Main Stage — EXACT Composition of Reference Image (media_1795861002889_69e74b9a.jpg) */}
      <main className="bmi-main-stage">
        {/* Top Tag (Exact Reference: "NEON TEXT EFFECT") */}
        <p className={`bmi-reference-tag ${tagClass}`}>
          {activeScene.tag}
        </p>

        {/* Center Glowing Neon Typography (Exact Reference: "NEON") */}
        <div
          key={`${currentSceneIndex}-${currentCaptionIndex}`}
          className="bmi-caption-ignition w-full flex flex-col items-center justify-center my-4 sm:my-8"
        >
          {isFinalScreen ? (
            /* Grand Finale Reveal */
            <div className="w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
              <div className="mb-2 animate-pulse">
                <ConcentricNeonCloud size={105} />
              </div>

              <h2 className="bmi-neon-tube-base bmi-neon-tube-cyan text-2xl sm:text-4xl md:text-5xl font-black">
                GDG ON-CAMPUS NECN
              </h2>

              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-purple-300/90 text-shadow-[0_0_8px_#A855F7]">
                • ONE TEAM • ONE COMMUNITY • ONE GOLDEN MILESTONE •
              </p>

              <h1 className="bmi-neon-tube-base bmi-neon-tube-rainbow text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
                WE MADE IT HAPPEN
              </h1>

              <div className="mt-6 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handleSkip}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black text-sm tracking-wide shadow-[0_0_24px_rgba(0,240,255,0.65)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enter Chapter Leaderboard & Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Standard and Climax Captions */
            <h1 className="w-full max-w-4xl text-center">
              {activeCaption?.text.split('\n').map((line, lIdx) => (
                <span
                  key={lIdx}
                  className={`bmi-neon-tube-base ${getTubeClass(activeCaption.theme)} ${
                    activeScene.isGold
                      ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
                      : 'text-3xl sm:text-5xl md:text-6xl'
                  }`}
                >
                  {line}
                </span>
              ))}
            </h1>
          )}
        </div>

        {/* Bottom Subtitle / Counter (Exact Reference: "EDITABLE VECTOR TEXT EFFECT") */}
        <p className={`bmi-reference-sub ${subClass}`}>
          CAPTION 0{currentCaptionIndex + 1} OF 0{activeScene.captions.length} • TAP ANYWHERE TO ADVANCE
        </p>
      </main>

      {/* 5. Bottom Chapter Identity Strip */}
      <footer className="bmi-bottom-footer">
        <span>Narayana Engineering College, Nellore • Google Cloud Learn with Communities</span>
      </footer>
    </div>
  );
};

export default BronzeMilestoneIntro;
