import React from 'react';
import { motion } from 'framer-motion';

export const BackgroundClouds: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Sky Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F9FBFE] via-[#F0F6FD] to-[#E5F0FC]" />

      {/* Ambient Radial Color Washes */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[#4285F4]/10 blur-3xl" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#FBBC04]/10 blur-3xl" />
      <div className="absolute -bottom-16 left-1/3 w-96 h-96 rounded-full bg-[#34A853]/10 blur-3xl" />

      {/* Top-Left Tech Dot Grid */}
      <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 opacity-35">
        {[...Array(16)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
        ))}
      </div>

      {/* Top-Right Tech Dot Grid */}
      <div className="absolute top-4 right-4 grid grid-cols-4 gap-1.5 opacity-35">
        {[...Array(16)].map((_, i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
        ))}
      </div>

      {/* Floating 3D Google Colored Spheres */}
      <motion.div
        animate={{ y: [-6, 6, -6], x: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-14 left-10 w-6 h-6 rounded-full bg-gradient-to-tr from-[#174EA6] to-[#4285F4] shadow-md opacity-85"
      />
      <motion.div
        animate={{ y: [6, -6, 6], x: [3, -3, 3] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
        className="absolute top-20 right-14 w-7 h-7 rounded-full bg-gradient-to-tr from-[#C5221F] to-[#EA4335] shadow-md opacity-85"
      />
      <motion.div
        animate={{ y: [-5, 5, -5], x: [2, -2, 2] }}
        transition={{ duration: 6.5, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
        className="absolute bottom-28 left-8 w-5 h-5 rounded-full bg-gradient-to-tr from-[#E37400] to-[#FBBC04] shadow-md opacity-85"
      />
      <motion.div
        animate={{ y: [5, -5, 5], x: [-3, 3, -3] }}
        transition={{ duration: 7.5, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
        className="absolute bottom-16 right-10 w-6 h-6 rounded-full bg-gradient-to-tr from-[#0D652D] to-[#34A853] shadow-md opacity-85"
      />

      {/* Soft Bottom Cloud Bank SVG Shape */}
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 overflow-hidden opacity-90">
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C120,130 200,180 320,150 C440,120 540,170 680,140 C820,110 940,160 1080,130 C1220,100 1340,150 1440,120 L1440,220 L0,220 Z"
            fill="#FFFFFF"
            fillOpacity="0.75"
          />
          <path
            d="M0,180 C140,150 260,200 400,170 C540,140 660,190 800,160 C940,130 1060,180 1200,150 C1320,120 1400,160 1440,150 L1440,220 L0,220 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </div>
  );
};
