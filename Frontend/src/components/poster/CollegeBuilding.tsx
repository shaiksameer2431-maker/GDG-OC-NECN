import React from 'react';
import { motion } from 'framer-motion';

export const CollegeBuilding: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25 }}
      className="relative z-10 flex flex-col items-center justify-end w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px]"
    >
      {/* College Photograph Container with Cloud-Blend Base */}
      <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(20,43,112,0.08)] border border-white/80 bg-white/40 backdrop-blur-xs">
        <img
          src="/banner-assets/college-building.png"
          alt="Narayana Engineering College, Nellore - Campus Building"
          className="w-full h-auto object-cover max-h-[160px] sm:max-h-[190px] md:max-h-[220px]"
          loading="eager"
        />

        {/* Soft bottom cloud gradient overlay to blend into the sky/clouds */}
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
      </div>

      {/* College Identity Micro-Tag */}
      <div className="relative -mt-3.5 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-slate-200/80 shadow-md text-[10px] sm:text-xs font-bold text-[#142B70]">
        <span className="w-2 h-2 rounded-full bg-[#0F9D58] animate-pulse" />
        <span>Narayana Engineering College, Nellore</span>
      </div>
    </motion.div>
  );
};
