import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { BronzeMilestoneExperience } from './BronzeMilestoneExperience';
import './BronzeMilestoneIntro.css';

interface BronzeMilestoneIntroProps {
  onComplete: () => void;
}

export const BronzeMilestoneIntro: React.FC<BronzeMilestoneIntroProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Paper Blasts & Continuous Streamers ALONG WITH Bronze Opening
  useEffect(() => {
    const confettiColors = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#EEC39C', '#CC9873', '#B17656', '#FFFFFF'];

    // 1. Instant Grand Celebratory Paper Blast RIGHT WITH BRONZE OPENING (0.0s)
    confetti({
      particleCount: 120,
      spread: 95,
      origin: { y: 0.42 },
      colors: confettiColors,
      scalar: 1.25,
      disableForReducedMotion: true,
    });

    // 2. Synchronized Left & Right Streamer Cannons as Bronze Scales Up (0.4s & 0.8s)
    const blastTimer1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.58 },
        colors: confettiColors,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 400);

    const blastTimer2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.58 },
        colors: confettiColors,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 800);

    // 3. Dual Fanfare Blast as Bronze Locks Facing Forward (1.8s)
    const blastTimer3 = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.48 },
        colors: confettiColors,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 1800);

    // 4. Continuous Cascade of Falling Paper Streamers while Bronze is Displayed (Runs until 14.5s)
    const confettiEnd = Date.now() + 14500;
    const confettiInterval = setInterval(() => {
      if (Date.now() > confettiEnd) {
        clearInterval(confettiInterval);
        return;
      }

      // Streamers from left
      confetti({
        particleCount: 10,
        angle: 60,
        spread: 50,
        origin: { x: 0, y: 0.55 },
        colors: confettiColors,
        ticks: 220,
        gravity: 0.65,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });

      // Streamers from right
      confetti({
        particleCount: 10,
        angle: 120,
        spread: 50,
        origin: { x: 1, y: 0.55 },
        colors: confettiColors,
        ticks: 220,
        gravity: 0.65,
        shapes: ['square', 'circle'],
        scalar: 1.1,
        disableForReducedMotion: true,
      });
    }, 360);

    // 5. All paper generation is completely stopped by 14.5s so papers settle down naturally
    // 6. Smooth exit transition begins at 18.2 seconds
    const exitTimer = setTimeout(() => {
      confetti.reset();
      setIsExiting(true);
    }, 18200);

    // 7. Complete transition at 20.0s — guarantees ZERO confetti after bronze closes
    const completeTimer = setTimeout(() => {
      confetti.reset();
      onComplete();
    }, 20000);

    return () => {
      clearInterval(confettiInterval);
      clearTimeout(blastTimer1);
      clearTimeout(blastTimer2);
      clearTimeout(blastTimer3);
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
