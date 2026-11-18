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
  const hasFiredRef = useRef<boolean>(false);

  // Keep callback references stable to prevent re-triggering lifecycle
  const onCompleteRef = useRef(onComplete);
  const onPreloadRef = useRef(onPreload);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPreloadRef.current = onPreload;
  });

  // Dedicated Party Paper Blasting Effect & 7-Second Auto-Transition (Single Execution Guaranteed)
  useEffect(() => {
    if (!confettiCanvasRef.current) return;
    if (hasFiredRef.current) return;
    hasFiredRef.current = true;

    // Create a dedicated confetti instance directly on our overlay canvas (z-index 100005)
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
    // EXACTLY ONE-TIME SINGLE CELEBRATION BURST (Strictly no repetition)
    // =========================================================================
    const blastTimer = setTimeout(() => {
      partyConfetti({
        particleCount: 85,
        spread: 85,
        origin: { x: 0.5, y: 0.42 },
        colors: partyColors,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        startVelocity: 36,
        gravity: 0.9,
        ticks: 150,
        disableForReducedMotion: true,
      });
    }, 150);

    // Preload Overview page DOM at 5.0 seconds (right before exit dissolve starts at 5.5s)
    const preloadTimer = setTimeout(() => {
      onPreloadRef.current?.();
    }, 5000);

    // Smooth exit dissolve transition starts at 5.5 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 5500);

    // Exactly 7.0 seconds total intro duration: cleanly transition & reveal website
    const completeTimer = setTimeout(() => {
      partyConfetti.reset();
      onCompleteRef.current?.();
    }, 7000);

    return () => {
      clearTimeout(blastTimer);
      clearTimeout(preloadTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      partyConfetti.reset();
    };
  }, []);

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
