import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Users, Sparkles, ArrowRight, ChevronRight, Terminal, Heart, Code2 } from 'lucide-react';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

interface CaptionItem {
  text: string;
  theme: 'pink-magenta' | 'cyan-magenta' | 'lime-cyan' | 'blue-violet' | 'gold' | 'showcase' | 'rainbow';
  illustration?: 'journey' | 'code' | 'unity' | 'community' | 'trophy' | 'cloud';
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
      { text: 'IT WAS NEVER\nAN EASY JOURNEY.', theme: 'pink-magenta', illustration: 'journey' },
      { text: 'EVERY CHALLENGE\nMADE US STRONGER.', theme: 'cyan-magenta', illustration: 'journey' },
      { text: 'BUT WE NEVER\nGAVE UP.', theme: 'pink-magenta', illustration: 'journey' },
    ],
  },
  // Scene 2 — The Struggle
  {
    tag: 'SCENE 2 — THE STRUGGLE',
    isGold: false,
    captions: [
      { text: 'COUNTLESS LABS.', theme: 'blue-violet', illustration: 'code' },
      { text: 'LATE NIGHTS.', theme: 'pink-magenta', illustration: 'code' },
      { text: 'ONE GOAL.', theme: 'cyan-magenta', illustration: 'code' },
      { text: 'WE KEPT MOVING\nFORWARD.', theme: 'pink-magenta', illustration: 'code' },
    ],
  },
  // Scene 3 — The Unity
  {
    tag: 'SCENE 3 — THE UNITY',
    isGold: false,
    captions: [
      { text: "WE DIDN'T\nDO IT ALONE.", theme: 'lime-cyan', illustration: 'unity' },
      { text: 'WE LEARNED\nTOGETHER.', theme: 'cyan-magenta', illustration: 'unity' },
      { text: 'EVERY EFFORT\nCOUNTED.', theme: 'lime-cyan', illustration: 'unity' },
    ],
  },
  // Scene 4 — The Turning Point
  {
    tag: 'SCENE 4 — THE TURNING POINT',
    isGold: false,
    captions: [
      { text: '438 STUDENTS.', theme: 'cyan-magenta', illustration: 'community' },
      { text: 'ONE COMMUNITY.', theme: 'pink-magenta', illustration: 'community' },
      { text: 'ONE\nUNSTOPPABLE\nTEAM.', theme: 'cyan-magenta', illustration: 'community' },
      { text: 'AND FINALLY...', theme: 'blue-violet', illustration: 'community' },
    ],
  },
  // Scene 5 — The Gold Reveal (The Climax)
  {
    tag: 'SCENE 5 — THE GOLD REVEAL',
    isGold: true,
    captions: [
      { text: 'THE WAIT IS OVER.', theme: 'gold', illustration: 'trophy' },
      { text: 'WE DID IT!', theme: 'gold', illustration: 'trophy' },
      { text: 'WE REACHED\nGOLD!', theme: 'gold', illustration: 'trophy' },
    ],
  },
  // Scene 6 — The Achievement
  {
    tag: 'SCENE 6 — THE ACHIEVEMENT',
    isGold: true,
    captions: [
      { text: '280 ACHIEVERS.', theme: 'gold', illustration: 'trophy' },
      { text: '2,661\nSKILL BADGES.', theme: 'showcase', illustration: 'trophy' },
    ],
  },
  // Scene 7 — The Finale & Victory Screen
  {
    tag: 'GDG ON-CAMPUS NECN',
    isGold: true,
    captions: [
      { text: 'THIS GOLD BELONGS\nTO EVERYONE.', theme: 'rainbow', illustration: 'cloud' },
      { text: 'ONE TEAM.', theme: 'cyan-magenta', illustration: 'cloud' },
      { text: 'ONE COMMUNITY.', theme: 'pink-magenta', illustration: 'cloud' },
      { text: 'ONE GOLDEN\nMILESTONE.', theme: 'gold', illustration: 'cloud' },
      { text: 'WE MADE IT HAPPEN.', theme: 'rainbow', illustration: 'cloud' },
    ],
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

// Flowing Energy Trail Interface (Image 7 Reference)
interface EnergyTrail {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  speed: number;
  angle: number;
  phase: number;
}

/**
 * Concentric Multi-Tube Neon Cloud Logo Component
 * Modeled directly on the concentric neon heart in Image 2
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

      {/* Layer 1: Ambient Outer Neon Glow */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        filter="url(#bmiNeonGlowFilter)"
      />

      {/* Layer 2: Main Vibrant Neon Tube (Outer Loop) */}
      <path
        d="M 38 78 C 24 78 14 66 14 52 C 14 39 24 28 37 27 C 42 15 54 8 68 8 C 84 8 98 19 101 34 C 105 32 110 31 115 31 C 130 31 142 43 142 58 C 142 59 142 60 142 61 C 145 61 146 61 146 61 C 151 61 156 66 156 71 C 156 75 151 78 146 78 Z"
        stroke="url(#bmiNeonCloudGrad)"
        strokeWidth="3.6"
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

/**
 * Continuous Line-Art Neon Technology Illustration Component
 * Modeled on Image 1 (Guitar outline), Image 5 (AI Hand), Image 6 (Neon Hand)
 */
const NeonTechIllustration: React.FC<{ type?: string }> = ({ type }) => {
  switch (type) {
    case 'journey':
      return (
        <div className="bmi-tech-art-wrap" aria-hidden="true">
          <svg className="w-20 h-20 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
            <path
              d="M 10 75 Q 30 25 50 50 T 90 25"
              stroke="#FF007F"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="bmi-line-draw"
            />
            <circle cx="90" cy="25" r="4" fill="#00F0FF" className="animate-ping" />
            <circle cx="90" cy="25" r="3" fill="#FFFFFF" />
            <path
              d="M 25 85 L 50 45 L 75 85"
              stroke="#00F0FF"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          </svg>
        </div>
      );
    case 'code':
      return (
        <div className="bmi-tech-art-wrap" aria-hidden="true">
          <svg className="w-20 h-20 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
            <rect
              x="15"
              y="20"
              width="70"
              height="50"
              rx="6"
              stroke="#A855F7"
              strokeWidth="2.5"
              fill="none"
              className="bmi-line-draw"
            />
            <path d="M 15 32 L 85 32" stroke="#A855F7" strokeWidth="1.5" />
            <path d="M 30 45 L 42 55 L 30 65" stroke="#00F0FF" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 50 65 L 68 65" stroke="#FF007F" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'unity':
      return (
        <div className="bmi-tech-art-wrap" aria-hidden="true">
          <svg className="w-20 h-20 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
            <circle cx="35" cy="40" r="14" stroke="#00FF88" strokeWidth="2.5" className="bmi-line-draw" />
            <circle cx="65" cy="40" r="14" stroke="#00F0FF" strokeWidth="2.5" className="bmi-line-draw" />
            <path
              d="M 25 78 C 25 62 45 62 50 62 C 55 62 75 62 75 78"
              stroke="#FF007F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" className="animate-pulse" />
          </svg>
        </div>
      );
    case 'community':
      return (
        <div className="bmi-tech-art-wrap" aria-hidden="true">
          <svg className="w-20 h-20 sm:w-28 sm:h-28" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="32" stroke="#00F0FF" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="50" cy="22" r="5" fill="#FF007F" />
            <circle cx="75" cy="62" r="5" fill="#00FF88" />
            <circle cx="25" cy="62" r="5" fill="#FFB800" />
            <path d="M 50 22 L 75 62 L 25 62 Z" stroke="#A855F7" strokeWidth="1.8" fill="none" />
          </svg>
        </div>
      );
    case 'trophy':
      return (
        <div className="bmi-tech-art-wrap" aria-hidden="true">
          <svg className="w-24 h-24 sm:w-32 sm:h-32" viewBox="0 0 100 100" fill="none">
            <path
              d="M 30 20 L 70 20 C 70 45 58 55 50 60 C 42 55 30 45 30 20 Z"
              stroke="#FFD700"
              strokeWidth="3"
              strokeLinecap="round"
              className="bmi-line-draw"
            />
            <path d="M 30 30 C 18 30 18 45 30 48" stroke="#FFA500" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 70 30 C 82 30 82 45 70 48" stroke="#FFA500" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 50 60 L 50 75 M 35 75 L 65 75" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="38" r="4" fill="#FFFFFF" className="animate-ping" />
          </svg>
        </div>
      );
    case 'cloud':
    default:
      return null;
  }
};

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({
  onComplete,
  onPreload,
}) => {
  // Scene & Sentence Tracking
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Canvases
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);
  const captionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Particles & Trails Ref
  const sparksRef = useRef<Spark[]>([]);
  const trailsRef = useRef<EnergyTrail[]>([]);
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
      particleCount: 70,
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
      particleCount: 70,
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
        particleCount: 95,
        spread: 110,
        origin: { x: 0.5, y: 0.35 },
        colors: multiNeonCelebrationColors,
        scalar: 1.3,
        startVelocity: 35,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 280);
  }, []);

  // Multi-Color Neon Sparks Engine + Flowing Energy Trails (Images 2, 6, 7)
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

    // Spawn floating ambient sparks
    const ambientCount = 44;
    const sparks: Spark[] = [];
    for (let i = 0; i < ambientCount; i++) {
      sparks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 1.3,
        size: 1.3 + Math.random() * 2.8,
        color: multiNeonColors[Math.floor(Math.random() * multiNeonColors.length)],
        alpha: Math.random() * 0.85,
        maxAlpha: 0.45 + Math.random() * 0.55,
        decay: 0.003 + Math.random() * 0.006,
        isBurst: false,
      });
    }
    sparksRef.current = sparks;

    // Initialize 8 Flowing Energy Trails (Image 7 Reference)
    const trails: EnergyTrail[] = [];
    const trailColors = ['rgba(0,240,255,0.22)', 'rgba(255,0,127,0.20)', 'rgba(168,85,247,0.20)', 'rgba(0,255,136,0.18)'];
    for (let i = 0; i < 8; i++) {
      trails.push({
        points: [],
        color: trailColors[i % trailColors.length],
        width: 1.5 + Math.random() * 2,
        speed: 0.008 + Math.random() * 0.012,
        angle: (i * Math.PI) / 4,
        phase: Math.random() * Math.PI * 2,
      });
    }
    trailsRef.current = trails;

    // Animation Loop
    let isRunning = true;
    let time = 0;
    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // 1. Draw Flowing Energy Trails (Image 7 Reference)
      const centerX = width / 2;
      const centerY = height * 0.48;
      trailsRef.current.forEach((t) => {
        ctx.save();
        ctx.strokeStyle = t.color;
        ctx.lineWidth = t.width;
        ctx.lineCap = 'round';
        ctx.beginPath();

        const baseRadius = min(width, height) * 0.28;
        for (let a = 0; a <= Math.PI * 2; a += 0.2) {
          const r = baseRadius + Math.sin(a * 3 + time * t.speed * 20 + t.phase) * 35;
          const px = centerX + Math.cos(a + t.angle) * r;
          const py = centerY + Math.sin(a + t.angle) * (r * 0.65);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      // 2. Draw Sparks & Particles
      const activeSparks = sparksRef.current;
      for (let i = activeSparks.length - 1; i >= 0; i--) {
        const s = activeSparks[i];
        s.x += s.vx;
        s.y += s.vy;

        if (s.isBurst) {
          s.vx *= 0.95;
          s.vy *= 0.95;
          s.alpha -= s.decay;

          if (s.alpha <= 0) {
            activeSparks.splice(i, 1);
            continue;
          }
        } else {
          s.alpha += (Math.random() - 0.5) * 0.04;
          if (s.alpha < 0.15) s.alpha = 0.15;
          if (s.alpha > s.maxAlpha) s.alpha = s.maxAlpha;

          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
          }
          if (s.x < -10) s.x = width + 10;
          if (s.x > width + 10) s.x = -10;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.size * 6;
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

  // Helper function for min
  function min(a: number, b: number) {
    return a < b ? a : b;
  }

  // Burst multi-color neon sparks on caption change
  const triggerSparksBurst = useCallback(() => {
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.48;
    const multiNeonColors = ['#00F0FF', '#FF007F', '#A855F7', '#00FF88', '#FFD700', '#FFFFFF'];
    const burstCount = 36;

    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.0 + Math.random() * 6.5;
      sparksRef.current.push({
        x: centerX + (Math.random() - 0.5) * 180,
        y: centerY + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.9,
        size: 1.6 + Math.random() * 3.2,
        color: multiNeonColors[Math.floor(Math.random() * multiNeonColors.length)],
        alpha: 0.98,
        maxAlpha: 1.0,
        decay: 0.02 + Math.random() * 0.022,
        isBurst: true,
      });
    }
  }, []);

  // Advance to next caption or scene
  const advanceNext = useCallback(() => {
    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    triggerSparksBurst();

    if (currentCaptionIndex < activeScene.captions.length - 1) {
      const nextIdx = currentCaptionIndex + 1;
      setCurrentCaptionIndex(nextIdx);

      // Gold / multi-neon confetti on major climaxes
      if (currentSceneIndex === 4 && nextIdx === activeScene.captions.length - 1) {
        fireMultiNeonCelebration();
      }
      if (currentSceneIndex === 6 && nextIdx === activeScene.captions.length - 1) {
        fireMultiNeonCelebration();
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
        }, 1100);
      }
    }
  }, [currentSceneIndex, currentCaptionIndex, fireMultiNeonCelebration, triggerSparksBurst]);

  // Jump directly to specific scene
  const jumpToScene = useCallback(
    (sceneIdx: number) => {
      setCurrentSceneIndex(sceneIdx);
      setCurrentCaptionIndex(0);
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

  // Quick Cinematic Caption Pacing (~1.6s to 2.2s per user prompt)
  useEffect(() => {
    if (captionTimerRef.current) clearTimeout(captionTimerRef.current);

    const activeScene = CINEMATIC_SCENES[currentSceneIndex];
    if (!activeScene) return;

    const isLastCaptionOfScene = currentCaptionIndex === activeScene.captions.length - 1;
    // Fast cinematic trailer rhythm: 1.8s for standard lines, 3.2s for major climaxes
    const duration = isLastCaptionOfScene ? 3200 : 1800;

    captionTimerRef.current = setTimeout(advanceNext, duration);

    return () => {
      if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
    };
  }, [currentSceneIndex, currentCaptionIndex, advanceNext]);

  // Skip directly to website
  const handleSkip = useCallback(() => {
    onPreloadRef.current?.();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 400);
  }, []);

  const activeScene = CINEMATIC_SCENES[currentSceneIndex];
  const activeCaption = activeScene.captions[currentCaptionIndex];
  const activeLine = activeCaption?.text || '';
  const isClimaxCaption = currentCaptionIndex === activeScene.captions.length - 1;
  const isFinalScreen = currentSceneIndex === 6 && isClimaxCaption;

  /**
   * Assigns authentic illuminated neon tube classes matching the Last Image reference
   */
  const getLineNeonClass = (lineIdx: number, totalLines: number, isClimax: boolean): string => {
    if (isClimax) {
      if (activeScene.isGold || activeCaption?.theme === 'gold') return 'bmi-neon-lastref-gold';
      if (activeCaption?.theme === 'rainbow') return 'bmi-neon-lastref-rainbow';
      return 'bmi-neon-lastref-pink';
    }

    switch (activeCaption?.theme) {
      case 'pink-magenta':
        return lineIdx % 2 === 0 ? 'bmi-neon-lastref-pink' : 'bmi-neon-lastref-magenta';
      case 'cyan-magenta':
        return lineIdx % 2 === 0 ? 'bmi-neon-lastref-cyan' : 'bmi-neon-lastref-pink';
      case 'lime-cyan':
        return lineIdx % 2 === 0 ? 'bmi-neon-lastref-lime' : 'bmi-neon-lastref-cyan';
      case 'blue-violet':
        return lineIdx % 2 === 0 ? 'bmi-neon-lastref-blue' : 'bmi-neon-lastref-violet';
      case 'gold':
        return 'bmi-neon-lastref-gold';
      case 'showcase':
        if (currentCaptionIndex === 0) return 'bmi-neon-lastref-gold';
        return 'bmi-neon-lastref-cyan';
      case 'rainbow':
      default:
        return lineIdx % 2 === 0 ? 'bmi-neon-lastref-pink' : 'bmi-neon-lastref-cyan';
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

      {/* 2. Fluid Abstract Light Waves & Volumetric God Rays (Images 4 & 7) */}
      <div className="bmi-volumetric-container" aria-hidden="true">
        <div className={`bmi-volumetric-rays bmi-rays-${activeCaption?.theme || 'gold'}`} />
        <div className="bmi-central-flare" />
      </div>

      {/* 3. Multi-Color Neon Sparks & Energy Trails Canvas (Images 6 & 7) */}
      <canvas ref={sparksCanvasRef} className="bmi-sparks-canvas" aria-hidden="true" />

      {/* 4. Dedicated Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* 5. Top Header Bar with Concentric Neon Cloud Emblem (Image 2) */}
      <header
        className="w-full max-w-5xl px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* GDG Chapter Title with Concentric Neon Cloud Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-8 flex items-center justify-center shrink-0">
            <ConcentricNeonCloud size={42} />
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

      {/* 6. Main Stage (ZERO BACKGROUND — ILLUMINATED NEON TUBE TYPOGRAPHY MATCHING LAST IMAGE) */}
      <main className="bmi-experience-stage w-full">
        {/* Scene Tag Pill with Google Quad-Color Dots & Neon Glow */}
        <div className="mb-4 sm:mb-8 flex justify-center">
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

        {/* Continuous-Line Neon Technology Illustration (Images 1, 5, 6) */}
        {!isFinalScreen && (
          <div className="mb-3 sm:mb-5 animate-pulse">
            <NeonTechIllustration type={activeCaption?.illustration} />
          </div>
        )}

        {/* ===================================================================
            CINEMATIC CAPTION REVEAL (BLENDER / PREMIERE PRO PERSPECTIVE MOTION)
            - Illuminated neon tube lettering matching Last Image Reference
            - Quick 1–2s transitions
            - Word-by-word / Letter-assembly zoom-in
            =================================================================== */}
        <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center px-4 relative z-10">
          <div
            key={`${currentSceneIndex}-${currentCaptionIndex}`}
            className="bmi-neon-premiere-reveal w-full flex flex-col items-center justify-center"
          >
            {/* Climax defining moment badge */}
            {isClimaxCaption && !isFinalScreen && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-cyan-600 uppercase">
                  ★ THE DEFINING MOMENT ★
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FF007F] shadow-[0_0_8px_#FF007F]" />
              </div>
            )}

            {/* Final Screen Grand Finale (Matching Frame 4 & Images 1–7) */}
            {isFinalScreen ? (
              <div className="w-full flex flex-col items-center justify-center space-y-4 sm:space-y-6">
                {/* Concentric Neon Cloud Emblem (Image 2 aesthetic) */}
                <div className="mb-2 sm:mb-4 animate-pulse">
                  <ConcentricNeonCloud size={118} />
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest bmi-neon-lastref-cyan">
                  GDG ON-CAMPUS NECN
                </h2>

                <p className="text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-purple-700/90 bmi-neon-lastref-violet">
                  • ONE TEAM • ONE COMMUNITY • ONE GOLDEN MILESTONE •
                </p>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-center bmi-neon-lastref-rainbow bmi-streak-effect flex items-center justify-center gap-3 sm:gap-6">
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
              /* Standard & Climax Sentences with Last Image Neon Tube Outlines */
              <h1 className="w-full max-w-3xl font-black uppercase tracking-tight text-center">
                {activeLine.split('\n').map((line, idx, arr) => {
                  const lineClass = getLineNeonClass(idx, arr.length, isClimaxCaption);
                  return (
                    <span
                      key={idx}
                      className={`block leading-[1.12] my-1 sm:my-2 ${
                        isClimaxCaption
                          ? 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl'
                          : 'text-2xl sm:text-4xl md:text-5xl'
                      } ${lineClass} bmi-streak-effect`}
                    >
                      {/* Animate words individually with Premiere Pro stagger */}
                      {line.split(' ').map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="bmi-word-pop inline-block mx-1.5"
                          style={{ animationDelay: `${wIdx * 0.08}s` }}
                        >
                          {word}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </h1>
            )}
          </div>

          {/* Subdued Line Tracker */}
          <div className="mt-8 sm:mt-12 flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span>
              CAPTION 0{currentCaptionIndex + 1} OF 0{activeScene.captions.length}
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
