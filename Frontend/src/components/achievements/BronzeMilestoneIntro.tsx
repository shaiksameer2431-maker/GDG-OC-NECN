import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BronzeMilestoneExperience } from './BronzeMilestoneExperience';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
}

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Celebratory Falling Paper Confetti Streamers & 20-Second Auto-Transition
  useEffect(() => {
    const confettiColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#EEC39C', '#CC9873', '#B17656', '#FFFFFF'];

    // 1. Initial Grand Celebratory Center Blast
    confetti({
      particleCount: 110,
      spread: 90,
      origin: { y: 0.42 },
      colors: confettiColors,
      scalar: 1.25,
      disableForReducedMotion: true,
    });

    // 2. Secondary side fanfare bursts
    const blastTimer1 = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.6 },
        colors: confettiColors,
        scalar: 1.15,
        disableForReducedMotion: true,
      });
    }, 1500);

    const blastTimer2 = setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.6 },
        colors: confettiColors,
        scalar: 1.15,
        disableForReducedMotion: true,
      });
    }, 3000);

    // 3. Continuous "Papers" Cascade Rain (Streaming smoothly until 17.5 seconds)
    const confettiEnd = Date.now() + 17500;
    const confettiInterval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(confettiInterval);
        return;
      }

      // Streamers & papers from left side
      confetti({
        particleCount: 12,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.55 },
        colors: confettiColors,
        ticks: 240,
        gravity: 0.65,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });

      // Streamers & papers from right side
      confetti({
        particleCount: 12,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.55 },
        colors: confettiColors,
        ticks: 240,
        gravity: 0.65,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });
    }, 350);

    // 4. Milestone Achieved Fanfare (at 5.0s, 10.0s, and 14.5s)
    const fanfareTimer1 = setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.5 },
        colors: confettiColors,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 5000);

    const fanfareTimer2 = setTimeout(() => {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.45 },
        colors: confettiColors,
        scalar: 1.15,
        disableForReducedMotion: true,
      });
    }, 10000);

    const fanfareTimer3 = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.48 },
        colors: confettiColors,
        scalar: 1.15,
        disableForReducedMotion: true,
      });
    }, 14500);

    // 5. Smooth exit transition begins at 18.2 seconds (giving 1.8s for silky dissolve)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 18200);

    // 6. Complete transition at exactly 20.0 seconds, clearing all confetti before website shows
    const completeTimer = setTimeout(() => {
      confetti.reset();
      onComplete();
    }, 20000);

    return () => {
      clearInterval(confettiInterval);
      clearTimeout(blastTimer1);
      clearTimeout(blastTimer2);
      clearTimeout(fanfareTimer1);
      clearTimeout(fanfareTimer2);
      clearTimeout(fanfareTimer3);
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
      {/* 20-Second Auto-Transition Top Progress Bar */}
      <div className="bmi-progress-track" aria-hidden="true">
        <div className="bmi-progress-bar" />
      </div>

      {/* The EXACT SAME Bronze Milestone Achievement Component in Intro Mode */}
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
