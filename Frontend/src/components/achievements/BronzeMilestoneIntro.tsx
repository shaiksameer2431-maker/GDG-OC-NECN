import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BronzeMilestoneExperience } from './BronzeMilestoneExperience';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
}

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Celebratory Falling Paper Confetti Streamers & Auto-Transition
  useEffect(() => {
    const confettiColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#EEC39C', '#CC9873', '#B17656'];

    // 1. Initial Grand Celebratory Center Blast
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.45 },
      colors: confettiColors,
      scalar: 1.2,
      disableForReducedMotion: true,
    });

    // 2. Paper Confetti Streamers (Cascades only during first 3.8s so papers settle before intro ends)
    const confettiEnd = Date.now() + 3800;
    const confettiInterval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(confettiInterval);
        return;
      }

      // Streamers & papers from left side
      confetti({
        particleCount: 14,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: confettiColors,
        ticks: 180,
        gravity: 0.9,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });

      // Streamers & papers from right side
      confetti({
        particleCount: 14,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: confettiColors,
        ticks: 180,
        gravity: 0.9,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });
    }, 300);

    // 3. Smooth exit transition begins after 6.8 seconds
    // All papers have settled; instantly clear any stray particles before transition
    const exitTimer = setTimeout(() => {
      confetti.reset();
      setIsExiting(true);
    }, 6800);

    // 4. Complete transition and reveal website after 7.6 seconds
    const completeTimer = setTimeout(() => {
      confetti.reset();
      onComplete();
    }, 7600);

    return () => {
      clearInterval(confettiInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
      confetti.reset();
    };
  }, [onComplete]);

  return (
    <div
      className={`bmi-overlay ${isExiting ? 'bmi-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Official Bronze Milestone Achievement Introduction"
    >
      {/* 9.4-Second Auto-Transition Top Progress Bar */}
      <div className="bmi-progress-track" aria-hidden="true">
        <div className="bmi-progress-bar" />
      </div>

      {/* The EXACT SAME Bronze Milestone Achievement Component */}
      <div className="bmi-experience-stage w-full">
        <BronzeMilestoneExperience id="intro-bronze-milestone" className="bmi-experience-clean" />
      </div>
    </div>
  );
};

export default BronzeMilestoneIntro;
