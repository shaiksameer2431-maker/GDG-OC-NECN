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
    // SINGLE ONE-TIME OPENING CELEBRATION BURST (Clean & Refined)
    // =========================================================================

    // Single Grand Center Stage Party Paper Explosion (0.15s)
    const blastTimer = setTimeout(() => {
      partyConfetti({
        particleCount: 130,
        spread: 100,
        origin: { x: 0.5, y: 0.42 },
        colors: partyColors,
        shapes: ['square', 'circle'],
        scalar: 1.2,
        startVelocity: 40,
        gravity: 0.75,
        ticks: 240,
        disableForReducedMotion: true,
      });
    }, 150);

    // Preload Overview page DOM at 5.0 seconds (right before exit dissolve starts at 5.5s)
    const preloadTimer = setTimeout(() => {
      onPreload?.();
    }, 5000);

    // Smooth exit dissolve transition starts at 5.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5500);

    // Exactly 7.0 seconds total intro duration: cleanly transition & reveal website from top
    const completeTimer = setTimeout(() => {
      partyConfetti.reset();
      onComplete();
    }, 7000);

    return () => {
      clearTimeout(blastTimer);
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
