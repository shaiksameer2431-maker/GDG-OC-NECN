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

  // Dedicated Party Paper Blasting Effect & 15-Second Auto-Transition
  useEffect(() => {
    if (!confettiCanvasRef.current) return;

    // Create a dedicated confetti instance directly on our overlay canvas (z-index 100005)
    // Guarantees party papers render ON TOP of the bronze intro with 100% visibility!
    const partyConfetti = confetti.create(confettiCanvasRef.current, {
      resize: true,
      useWorker: true,
    });

    const partyColors = [
      '#4285F4', // Google Blue
      '#EA4335', // Google Red
      '#FBBC04', // Google Yellow
      '#34A853', // Google Green
      '#FFD700', // Gold Paper
      '#FF4081', // Neon Pink
      '#7C4DFF', // Vibrant Purple
      '#EEC39C', // Rose Bronze
      '#FFFFFF', // White Confetti
    ];

    // =========================================================================
    // PARTY PAPER BLASTING EFFECT — FIRES DIRECTLY ALONG WITH BRONZE OPENING
    // =========================================================================

    // 1. Initial Grand Center Stage Party Paper Explosion (0.1s)
    const blast1 = setTimeout(() => {
      partyConfetti({
        particleCount: 150,
        spread: 110,
        origin: { x: 0.5, y: 0.42 },
        colors: partyColors,
        shapes: ['square', 'circle'],
        scalar: 1.3,
        startVelocity: 42,
        gravity: 0.7,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 100);

    // 2. Left Event Cannon Blast (0.4s) — shoots up & across from bottom-left
    const blast2 = setTimeout(() => {
      partyConfetti({
        particleCount: 80,
        angle: 55,
        spread: 65,
        origin: { x: 0.02, y: 0.85 },
        colors: partyColors,
        shapes: ['square', 'circle'],
        scalar: 1.25,
        startVelocity: 55,
        gravity: 0.75,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 400);

    // 3. Right Event Cannon Blast (0.7s) — shoots up & across from bottom-right
    const blast3 = setTimeout(() => {
      partyConfetti({
        particleCount: 80,
        angle: 125,
        spread: 65,
        origin: { x: 0.98, y: 0.85 },
        colors: partyColors,
        shapes: ['square', 'circle'],
        scalar: 1.25,
        startVelocity: 55,
        gravity: 0.75,
        ticks: 280,
        disableForReducedMotion: true,
      });
    }, 700);

    // 4. Dual Cross-Cannon Blast as Bronze Locks Upright (1.8s)
    const blast4 = setTimeout(() => {
      partyConfetti({
        particleCount: 50,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.7 },
        colors: partyColors,
        scalar: 1.2,
        startVelocity: 44,
        gravity: 0.75,
        ticks: 240,
        disableForReducedMotion: true,
      });
      partyConfetti({
        particleCount: 50,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.7 },
        colors: partyColors,
        scalar: 1.2,
        startVelocity: 44,
        gravity: 0.75,
        ticks: 240,
        disableForReducedMotion: true,
      });
    }, 1800);

    // Preload Overview page DOM at 7.0 seconds (right before exit dissolve starts at 7.5s)
    const preloadTimer = setTimeout(() => {
      onPreload?.();
    }, 7000);

    // Smooth exit dissolve transition starts at 7.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 7500);

    // Exactly 9.0 seconds total intro duration: cleanly transition & reveal website from top
    const completeTimer = setTimeout(() => {
      partyConfetti.reset();
      onComplete();
    }, 9000);

    return () => {
      clearTimeout(blast1);
      clearTimeout(blast2);
      clearTimeout(blast3);
      clearTimeout(blast4);
      clearTimeout(preloadTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      partyConfetti.reset();
    };
  }, [onComplete, onPreload]);

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Official Bronze Milestone Achievement Introduction"
    >
      {/* Dedicated High-Z-Index Confetti Canvas: Guarantees party paper blasting renders in front of everything */}
      <canvas ref={confettiCanvasRef} className="bmi-confetti-canvas" aria-hidden="true" />

      {/* Standalone Bronze Milestone Achievement Component in Intro Mode */}
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
