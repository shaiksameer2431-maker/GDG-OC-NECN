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
    const confettiColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#E08544', '#F7B882', '#FFD700'];

    // 1. Initial Grand Celebratory Center Blast
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.45 },
      colors: confettiColors,
      scalar: 1.25,
      disableForReducedMotion: true,
    });

    // 2. Continuous "Papers" Cascade Rain (Running for 8.5 seconds)
    const confettiEnd = Date.now() + 8500;
    const confettiInterval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(confettiInterval);
        return;
      }

      // Streamers & papers from left side
      confetti({
        particleCount: 16,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: confettiColors,
        ticks: 240,
        gravity: 0.8,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        disableForReducedMotion: true,
      });

      // Streamers & papers from right side
      confetti({
        particleCount: 16,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: confettiColors,
        ticks: 240,
        gravity: 0.8,
        shapes: ['square', 'circle'],
        scalar: 1.15,
        disableForReducedMotion: true,
      });
    }, 280);

    // 3. Smooth exit transition begins after 8.6 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 8600);

    // 4. Complete transition and reveal website after 9.4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 9400);

    return () => {
      clearInterval(confettiInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
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
