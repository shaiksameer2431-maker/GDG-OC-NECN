import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { BronzeMilestoneExperience } from './BronzeMilestoneExperience';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({ onComplete, onPreload }) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const partyConfettiRef = useRef<confetti.CreateTypes | null>(null);

  // Keep callback references stable to prevent re-triggering lifecycle
  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Dedicated Gold Celebration Paper Effects & Choreographed Sequence
  useEffect(() => {
    if (!confettiCanvasRef.current) return;

    // Create dedicated confetti instance directly on our overlay canvas (z-index 100005)
    const partyConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    });
    partyConfettiRef.current = partyConfetti;

    // Premium Combination of Pure Gold, Champagne, and Subtle Metallic Shades
    const goldCelebrationColors = [
      '#FFD700', // Pure 24K Brilliant Gold
      '#F3E5AB', // Soft Polished Champagne
      '#E6B800', // Imperial Metallic Gold
      '#D4AF37', // Burnished Antique Gold
      '#FFF8DC', // Pale Cornsilk / Starlight Gold
      '#ECC5A8', // Warm Rose-Gold Metallic Accent
      '#C5A059', // Vegas Gold Satin
      '#FFFFFF', // Diamond Specular Fleck
    ];

    // =========================================================================
    // CHOREOGRAPHED TIMELINE:
    // 0.0s - 1.5s: Bronze enters
    // 1.5s - 3.2s: Bronze remains visible and floating
    // 3.2s - 5.0s: Bronze transforms to Silver
    // 3.35s - 4.5s: GOLD celebration paper effects activate during transformation
    // 5.0s - 7.6s: Silver prominently highlighted
    // 7.6s - 8.8s: Preload and smooth exit dissolve into Overview dashboard
    // =========================================================================

    // Cannon 1 (Left): Fires upward towards center during transformation (3.35s)
    const goldBlastTimer1 = setTimeout(() => {
      partyConfetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.12, y: 0.84 },
        colors: goldCelebrationColors,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        startVelocity: 42,
        gravity: 0.8,
        ticks: 240,
        disableForReducedMotion: true,
      });
    }, 3350);

    // Cannon 2 (Right): Fires upward towards center during transformation (3.45s)
    const goldBlastTimer2 = setTimeout(() => {
      partyConfetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.88, y: 0.84 },
        colors: goldCelebrationColors,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        startVelocity: 42,
        gravity: 0.8,
        ticks: 240,
        disableForReducedMotion: true,
      });
    }, 3450);

    // Apex Starburst (Center): Celebrates the reveal of the Silver achievement (3.80s)
    const goldBlastTimer3 = setTimeout(() => {
      partyConfetti({
        particleCount: 50,
        spread: 95,
        origin: { x: 0.5, y: 0.38 },
        colors: goldCelebrationColors,
        shapes: ['square', 'circle'],
        scalar: 1.25,
        startVelocity: 26,
        gravity: 0.72,
        ticks: 260,
        disableForReducedMotion: true,
      });
    }, 3800);

    // Gentle Flutter / Streamer Drift: Natural slow-falling paper drift (4.30s)
    const goldBlastTimer4 = setTimeout(() => {
      partyConfetti({
        particleCount: 30,
        spread: 120,
        origin: { x: 0.5, y: 0.08 },
        colors: goldCelebrationColors,
        shapes: ['square', 'circle'],
        scalar: 0.95,
        startVelocity: 14,
        gravity: 0.65,
        drift: 0.05,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 4300);

    // Preload Overview page DOM at 7.6 seconds
    const preloadTimer = setTimeout(() => {
      onPreloadRef.current?.();
    }, 7600);

    // Smooth exit dissolve transition starts at 8.0 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 8000);

    // 8.8 seconds total intro duration: cleanly transition & reveal website
    const completeTimer = setTimeout(() => {
      partyConfetti.reset();
      onCompleteRef.current?.();
    }, 8800);

    return () => {
      clearTimeout(goldBlastTimer1);
      clearTimeout(goldBlastTimer2);
      clearTimeout(goldBlastTimer3);
      clearTimeout(goldBlastTimer4);
      clearTimeout(preloadTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      partyConfetti.reset();
    };
  }, []);

  // Instant skip action
  const handleSkip = () => {
    partyConfettiRef.current?.reset();
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current?.();
    }, 300);
  };

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Official Chapter Milestone Achievement Introduction"
    >
      {/* Skip Button for quick navigation */}
      <button
        onClick={handleSkip}
        className="bmi-skip-btn"
        aria-label="Skip intro to Overview dashboard"
      >
        <span>Skip to Dashboard</span>
        <span>→</span>
      </button>

      {/* Dedicated High-Z-Index Confetti Canvas: Gold celebration paper renders cleanly in front */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* Standalone Milestone Achievement Component in Intro Mode */}
      <div className="bmi-experience-stage w-full">
        <BronzeMilestoneExperience
          id="intro-bronze-milestone"
          className="bmi-experience-clean"
          isIntro={true}
        />
      </div>
    </div>
  );
};

export default BronzeMilestoneIntro;
