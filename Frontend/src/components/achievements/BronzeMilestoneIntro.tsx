import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight } from 'lucide-react';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface LuxuryCaption {
  text: string;
  theme: 'pink' | 'cyan' | 'violet' | 'gold' | 'rainbow';
  duration: number; // in milliseconds
  isCelebration?: boolean;
}

// Master Sequence: Exact Captions and Groups Provided by User
const LUXURY_CAPTIONS: LuxuryCaption[] = [
  // ### Group 1
  { text: 'IT WAS NEVER\nAN EASY JOURNEY.', theme: 'pink', duration: 2500 },
  { text: 'EVERY CHALLENGE\nMADE US STRONGER.', theme: 'cyan', duration: 2500 },
  { text: 'BUT WE NEVER\nGAVE UP.', theme: 'pink', duration: 2600 },

  // ### Group 2
  { text: 'COUNTLESS LABS.', theme: 'violet', duration: 2200 },
  { text: 'LATE NIGHTS.', theme: 'violet', duration: 2200 },
  { text: 'ONE GOAL.', theme: 'cyan', duration: 2200 },
  { text: 'WE KEPT MOVING\nFORWARD.', theme: 'pink', duration: 2600 },

  // ### Group 3
  { text: "WE DIDN'T\nDO IT ALONE.", theme: 'cyan', duration: 2400 },
  { text: 'WE LEARNED\nTOGETHER.', theme: 'cyan', duration: 2400 },
  { text: 'EVERY EFFORT\nCOUNTED.', theme: 'pink', duration: 2600 },

  // ### Group 4
  { text: '438 STUDENTS.', theme: 'cyan', duration: 2400 },
  { text: 'ONE COMMUNITY.', theme: 'pink', duration: 2400 },
  { text: 'ONE UNSTOPPABLE\nTEAM.', theme: 'cyan', duration: 2500 },
  { text: 'AND FINALLY...', theme: 'violet', duration: 2300 },

  // ### Group 5 — The Gold Reveal
  { text: 'THE WAIT IS OVER.', theme: 'gold', duration: 2400 },
  { text: 'WE DID IT!', theme: 'gold', duration: 2400, isCelebration: true },
  { text: 'WE REACHED\nGOLD!', theme: 'gold', duration: 3400, isCelebration: true },

  // ### Group 6 — Achievements
  { text: '280 ACHIEVERS.', theme: 'gold', duration: 2600 },
  { text: '2,661\nSKILL BADGES.', theme: 'gold', duration: 2800 },

  // ### Group 7 — Finale
  { text: 'THIS GOLD BELONGS\nTO EVERYONE.', theme: 'pink', duration: 2600 },
  { text: 'ONE TEAM.', theme: 'cyan', duration: 2200 },
  { text: 'ONE COMMUNITY.', theme: 'violet', duration: 2200 },
  { text: 'ONE GOLDEN\nMILESTONE.', theme: 'gold', duration: 2600 },
  { text: 'WE MADE IT HAPPEN.', theme: 'rainbow', duration: 3500, isCelebration: true },

  // Final Screen: GDG ON-CAMPUS NECN Grand Reveal
  { text: 'GDG ON-CAMPUS\nNECN', theme: 'gold', duration: 5000, isCelebration: true },
];

/**
 * Concentric Multi-Tube Neon Cloud Logo Component
 * Modeled on the concentric neon heart reference
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
        <linearGradient id="bmiLuxuryCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="28%" stopColor="#3B82F6" />
          <stop offset="55%" stopColor="#A855F7" />
          <stop offset="82%" stopColor="#FF007F" />
          <stop offset="100%" stopColor="#FF3366" />
        </linearGradient>

        <filter id="bmiLuxuryGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Tube Ambient Glow */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiLuxuryCloudGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        filter="url(#bmiLuxuryGlow)"
      />

      {/* Outer Loop */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiLuxuryCloudGrad)"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Middle Loop */}
      <path
        d="M 44 71 C 33 71 25 62 25 51 C 25 41 33 33 43 32 C 47 23 57 17 68 17 C 81 17 92 25 94 37 C 98 36 102 35 106 35 C 118 35 128 45 128 57 C 128 58 128 59 128 60 C 132 60 136 63 136 67 C 136 71 132 71 128 71 Z"
        stroke="url(#bmiLuxuryCloudGrad)"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Inner Core */}
      <path
        d="M 50 64 C 42 64 36 57 36 49 C 36 41 42 35 50 35 C 53 29 60 25 68 25 C 77 25 84 31 86 39 C 89 38 92 37 95 37 C 104 37 111 44 111 53 C 111 59 106 64 100 64 Z"
        stroke="url(#bmiLuxuryCloudGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* White-Hot Filament */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.92"
      />
    </svg>
  );
};

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  const [captionIndex, setCaptionIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Multi-Neon Confetti Palette
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

  // Fire multi-neon confetti on major achievements
  const fireCelebration = useCallback(() => {
    const party = partyConfettiRef.current;
    if (!party) return;

    party({
      particleCount: 85,
      angle: 60,
      spread: 75,
      origin: { x: 0.1, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.25,
      startVelocity: 45,
      gravity: 0.8,
      ticks: 260,
      disableForReducedMotion: true,
    });

    party({
      particleCount: 85,
      angle: 120,
      spread: 75,
      origin: { x: 0.9, y: 0.8 },
      colors: multiNeonCelebrationColors,
      scalar: 1.25,
      startVelocity: 45,
      gravity: 0.8,
      ticks: 260,
      disableForReducedMotion: true,
    });

    setTimeout(() => {
      party({
        particleCount: 115,
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
    if (captionIndex < LUXURY_CAPTIONS.length - 1) {
      const nextIdx = captionIndex + 1;
      setCaptionIndex(nextIdx);

      // Preload dashboard data before final screens
      if (nextIdx >= 14) {
        onPreloadRef.current?.();
      }

      // Trigger celebratory confetti when reaching major gold moments
      if (LUXURY_CAPTIONS[nextIdx]?.isCelebration) {
        fireCelebration();
      }
    } else {
      // Final exit
      onPreloadRef.current?.();
      setIsExiting(true);
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 900);
    }
  }, [captionIndex, fireCelebration]);

  // Attractive cinematic timing
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const currentItem = LUXURY_CAPTIONS[captionIndex];
    if (!currentItem) return;

    timerRef.current = setTimeout(advanceNext, currentItem.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [captionIndex, advanceNext]);

  // Complete immediately on final button click
  const handleComplete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onPreloadRef.current?.();
      setIsExiting(true);
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 350);
    },
    []
  );

  const currentItem = LUXURY_CAPTIONS[captionIndex];
  const isFinalScreen = captionIndex === LUXURY_CAPTIONS.length - 1;

  // Map theme to neon tube style
  const getTubeClass = (theme: LuxuryCaption['theme']): string => {
    switch (theme) {
      case 'pink':
        return 'bmi-tube-pink';
      case 'cyan':
        return 'bmi-tube-cyan';
      case 'violet':
        return 'bmi-tube-violet';
      case 'gold':
        return 'bmi-tube-gold';
      case 'rainbow':
        return 'bmi-tube-rainbow';
      default:
        return 'bmi-tube-pink';
    }
  };

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Google Cloud Gold Milestone Celebration"
      onClick={advanceNext} // Click anywhere to step forward
    >
      {/* 1. Deep Ambient Dark Luxury Wall */}
      <div className="bmi-ambient-wall" aria-hidden="true" />

      {/* 2. Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 3. Pure Full-Screen Center Stage */}
      <main className="bmi-fullscreen-stage">
        <div
          key={captionIndex}
          className="bmi-caption-ignition w-full flex flex-col items-center justify-center"
        >
          {isFinalScreen ? (
            /* Grand Finale Reveal: GDG ON-CAMPUS NECN */
            <div className="w-full flex flex-col items-center justify-center space-y-5 sm:space-y-7">
              <div className="mb-2 animate-pulse">
                <ConcentricNeonCloud size={115} />
              </div>

              <h2 className="bmi-luxury-neon-text bmi-tube-cyan text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black">
                GDG ON-CAMPUS NECN
              </h2>

              <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-purple-300/90 text-shadow-[0_0_10px_#A855F7]">
                • ONE TEAM • ONE COMMUNITY • ONE GOLDEN MILESTONE •
              </p>

              <h1 className="bmi-luxury-neon-text bmi-tube-rainbow text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
                WE MADE IT HAPPEN
              </h1>

              <div className="mt-8 pt-3">
                <button onClick={handleComplete} className="bmi-enter-btn">
                  <span>Enter Chapter Leaderboard & Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Standard and Climax Captions (100% Full-Screen Centered Neon Text) */
            <h1 className="w-full max-w-5xl text-center">
              {currentItem.text.split('\n').map((line, idx) => (
                <span
                  key={idx}
                  className={`bmi-luxury-neon-text ${getTubeClass(currentItem.theme)}`}
                >
                  {line}
                </span>
              ))}
            </h1>
          )}
        </div>
      </main>
    </div>
  );
};

export default BronzeMilestoneIntro;
