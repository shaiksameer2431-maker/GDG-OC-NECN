import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { BackgroundClouds } from './BackgroundClouds';
import { HeaderBranding } from './HeaderBranding';
import { HeroCenter } from './HeroCenter';
import { CloudIllustrations } from './CloudIllustrations';
import { BenefitsPanel } from './BenefitsPanel';
import { CollegeBuilding } from './CollegeBuilding';
import { MerchandiseShowcase } from './MerchandiseShowcase';
import { LearningPathCard } from './LearningPathCard';

interface PosterStageProps {
  onCelebrateSwags: () => void;
}

export const PosterStage: React.FC<PosterStageProps> = ({ onCelebrateSwags }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Mouse Parallax Coordinates (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Springs for Parallax Physics
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Layer 1: Background Subtle Shift
  const bgX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-8, 8]);
  const bgY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-8, 8]);

  // Layer 2: Middle-ground Elements
  const midX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-16, 16]);
  const midY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-16, 16]);

  // Layer 3: Foreground (Swags, Badges, Airplanes)
  const foreX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-24, 24]);
  const foreY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-24, 24]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06),0_8px_32px_rgba(20,43,112,0.08)] border border-slate-200/80 p-3 sm:p-5 md:p-6 lg:p-7 select-none transition-all duration-300"
    >
      {/* ================= LAYER 1: BACKGROUND CLOUDS & SKY ================= */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0">
        <BackgroundClouds />
      </motion.div>

      {/* ================= TOP BRANDING ================= */}
      <div className="relative z-30 mb-4 sm:mb-6">
        <HeaderBranding />
      </div>

      {/* ================= DESKTOP & TABLET LANDSCAPE COMPOSITION ================= */}
      <div className="hidden lg:grid grid-cols-12 gap-4 items-center relative z-20 min-h-[460px] xl:min-h-[500px]">
        {/* Left Column: Cloud Tech + Benefits Panel */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="col-span-3 flex flex-col items-center justify-between h-full space-y-4"
        >
          <div className="flex-1 flex items-center justify-center">
            <CloudIllustrations />
          </div>
          <div className="w-full">
            <BenefitsPanel />
          </div>
        </motion.div>

        {/* Center Column: NECN Cloud Champions Title + College Campus */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="col-span-6 flex flex-col items-center justify-between h-full space-y-3 text-center"
        >
          <div className="flex-1 flex flex-col items-center justify-center pt-2">
            <HeroCenter />
          </div>
          <div className="w-full flex items-center justify-center">
            <CollegeBuilding />
          </div>
        </motion.div>

        {/* Right Column: Merchandise Showcase + Learning Path Notebook */}
        <motion.div
          style={{ x: foreX, y: foreY }}
          className="col-span-3 flex flex-col items-center justify-between h-full space-y-4"
        >
          <div className="flex-1 flex items-center justify-center w-full">
            <MerchandiseShowcase onCelebrateSwags={onCelebrateSwags} />
          </div>
          <div className="w-full flex items-center justify-center">
            <LearningPathCard />
          </div>
        </motion.div>
      </div>

      {/* ================= MOBILE & SMALL TABLET ADAPTIVE VERTICAL LAYOUT ================= */}
      <div className="lg:hidden flex flex-col items-center space-y-6 relative z-20">
        {/* Center Hero Heading */}
        <div className="w-full flex justify-center">
          <HeroCenter />
        </div>

        {/* Cloud Tech Cluster & College Building side-by-side or stacked */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex justify-center">
            <CloudIllustrations />
          </div>
          <div className="flex justify-center">
            <CollegeBuilding />
          </div>
        </div>

        {/* Merchandise Showcase Pack */}
        <div className="w-full flex justify-center">
          <MerchandiseShowcase onCelebrateSwags={onCelebrateSwags} />
        </div>

        {/* Benefits Panel & Learning Path */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <div className="flex justify-center">
            <BenefitsPanel />
          </div>
          <div className="flex justify-center">
            <LearningPathCard />
          </div>
        </div>
      </div>

      {/* Subtle Shimmer Sweep on Hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-25deg] anim-shimmer" />
      </div>
    </div>
  );
};

