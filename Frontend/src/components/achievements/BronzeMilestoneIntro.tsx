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

interface LaserPhoton {
  t: number;
  speed: number;
  size: number;
  color: string;
  glyph?: string;
  offset: number;
}

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
  const photonCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

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

  // Ensure HD video autoplay plays reliably across all browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback handled cleanly
      });
    }
  }, []);

  // -------------------------------------------------------------------------
  // COHERENT PHOTONICS LASER ANIMATION ENGINE
  // Renders real streaming photons, fiber-optic laser pulses, and data particles
  // traveling along the curved trajectory of the Coherent hero graphic
  // -------------------------------------------------------------------------
  useEffect(() => {
    const canvas = photonCanvasRef.current;
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

    // Quadratic Bezier Curve evaluation for the Coherent photonics arc
    const getCurvePoint = (t: number, offset: number) => {
      const p0 = { x: width * 0.04, y: height * 0.08 };
      const p1 = { x: width * 0.36, y: height * 0.94 };
      const p2 = { x: width * 0.98, y: height * 0.58 };

      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;

      // Base point on quadratic bezier
      const bx = uu * p0.x + 2 * u * t * p1.x + tt * p2.x;
      const by = uu * p0.y + 2 * u * t * p1.y + tt * p2.y;

      // Normal vector to create multiple concentric fiber cables
      const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;

      return {
        x: bx + nx * offset,
        y: by + ny * offset,
      };
    };

    // Initialize 48 streaming laser photons
    const laserColors = ['#00F0FF', '#FF007F', '#A855F7', '#3B82F6', '#FFFFFF'];
    const photons: LaserPhoton[] = [];
    for (let i = 0; i < 48; i++) {
      photons.push({
        t: Math.random(),
        speed: 0.0018 + Math.random() * 0.0035,
        size: 1.5 + Math.random() * 2.8,
        color: laserColors[Math.floor(Math.random() * laserColors.length)],
        glyph: i % 7 === 0 ? (Math.random() > 0.5 ? '1' : '0') : undefined,
        offset: (Math.random() - 0.5) * 55, // Spreads across multiple fiber strands
      });
    }

    let isRunning = true;
    let laserPulseT = 0;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // 1. Advance & Draw Traveling Soliton Laser Wave Pulse
      laserPulseT += 0.0045;
      if (laserPulseT > 1) laserPulseT = 0;

      const pulseHead = getCurvePoint(laserPulseT, 0);
      const pulseGrad = ctx.createRadialGradient(
        pulseHead.x,
        pulseHead.y,
        0,
        pulseHead.x,
        pulseHead.y,
        width * 0.18
      );
      pulseGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
      pulseGrad.addColorStop(0.35, 'rgba(255, 0, 127, 0.28)');
      pulseGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.12)');
      pulseGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = pulseGrad;
      ctx.beginPath();
      ctx.arc(pulseHead.x, pulseHead.y, width * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Advance & Draw Streaming Photons
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      photons.forEach((p) => {
        // Advance progress
        const prevT = p.t;
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.offset = (Math.random() - 0.5) * 55;
        }

        const curr = getCurvePoint(p.t, p.offset);
        const prev = getCurvePoint(Math.max(0, prevT - 0.025), p.offset);

        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 5;

        // Glowing light streak tail
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();

        // Spark / Glyph at the head
        if (p.glyph) {
          ctx.fillText(p.glyph, curr.x, curr.y);
        } else {
          ctx.beginPath();
          ctx.arc(curr.x, curr.y, p.size * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
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
      {/* 1. Official Coherent Photonics HD Video Loop */}
      <video
        ref={videoRef}
        className="bmi-bg-video"
        autoPlay
        loop
        muted
        playsInline
        poster="/coherent-photonics-bg.jpg"
        aria-hidden="true"
      >
        <source src="/coherent-bg.mp4" type="video/mp4" />
      </video>

      {/* 2. Living Animated Coherent Photonics Video Layer (Fallback & ambient drift) */}
      <div className="bmi-bg-animated-layer" aria-hidden="true" />

      {/* 3. Optical Laser Vignette */}
      <div className="bmi-ambient-wall" aria-hidden="true" />

      {/* 4. Real 60FPS Streaming Photonics Laser & Data Pulse Canvas */}
      <canvas ref={photonCanvasRef} className="bmi-photon-canvas" aria-hidden="true" />

      {/* 5. Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 5. Pure Full-Screen Center Stage */}
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
