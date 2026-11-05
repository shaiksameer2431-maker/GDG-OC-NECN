import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const HeroCenter: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none py-1 sm:py-2">
      {/* ================= HEADING AREA ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Decorative Sunburst Rays flanking NECN */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-5">
          {/* Left Rays */}
          <div className="hidden sm:flex items-center gap-1 opacity-70">
            <span className="w-4 h-0.5 bg-gradient-to-r from-transparent to-[#4285F4] transform -rotate-45 rounded-full" />
            <span className="w-5 h-0.5 bg-[#FBBC04] rounded-full" />
            <span className="w-4 h-0.5 bg-gradient-to-r from-[#EA4335] to-transparent transform rotate-45 rounded-full" />
          </div>

          {/* NECN Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#142B70] uppercase leading-none drop-shadow-xs">
            NECN
          </h1>

          {/* Right Rays */}
          <div className="hidden sm:flex items-center gap-1 opacity-70">
            <span className="w-4 h-0.5 bg-gradient-to-r from-transparent to-[#34A853] transform rotate-45 rounded-full" />
            <span className="w-5 h-0.5 bg-[#4285F4] rounded-full" />
            <span className="w-4 h-0.5 bg-gradient-to-r from-[#FBBC04] to-transparent transform -rotate-45 rounded-full" />
          </div>
        </div>

        {/* Cloud Champions */}
        <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1A73E8] tracking-tight drop-shadow-xs">
            Cloud
          </span>
          <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0F9D58] tracking-tight drop-shadow-xs">
            Champions
          </span>
        </div>
      </motion.div>

      {/* ================= SUBTITLE PILL ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 rounded-full bg-[#E8F2FE] border border-[#BFDBFE] shadow-[0_2px_10px_rgba(26,115,232,0.12)]"
      >
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FBBC04] shrink-0 fill-[#FBBC04]" />
        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#142B70] tracking-tight whitespace-nowrap">
          Google Cloud Learn with <span className="text-[#1A73E8]">Communities 2026</span>
        </span>
      </motion.div>

      {/* ================= TAGLINE WITH 4 GOOGLE UNDERLINE BARS ================= */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="mt-2.5 sm:mt-3.5 flex flex-col items-center"
      >
        <p className="text-xs sm:text-sm md:text-base font-extrabold text-[#142B70] tracking-wide">
          Learn. Build. Earn. Achieve.
        </p>

        {/* 4 Colored Underline Bars: Blue, Red, Yellow, Green */}
        <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
          <span className="w-5 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#4285F4]" />
          <span className="w-5 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#EA4335]" />
          <span className="w-5 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#FBBC04]" />
          <span className="w-5 sm:w-7 h-1 sm:h-1.5 rounded-full bg-[#34A853]" />
        </div>
      </motion.div>
    </div>
  );
};

