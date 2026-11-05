import React from 'react';
import { motion } from 'framer-motion';

export const HeaderBranding: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-20 w-full flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3.5 bg-white/85 backdrop-blur-md rounded-2xl border border-white/90 shadow-[0_4px_20px_rgba(20,43,112,0.04)]"
    >
      {/* ================= LEFT: GDG ON CAMPUS ================= */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center p-1 rounded-xl bg-white shadow-[0_2px_8px_rgba(66,133,244,0.12)] border border-slate-100">
          <img
            src="/gdg-brackets-logo.png"
            alt="Google Developer Groups On Campus"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>
        <div className="flex flex-col text-left leading-tight truncate">
          <span className="font-extrabold text-[11px] sm:text-xs md:text-sm text-slate-900 tracking-tight whitespace-nowrap">
            Google Developer Groups
          </span>
          <span className="font-medium text-[9px] sm:text-[11px] text-[#4285F4] tracking-wide">
            On Campus
          </span>
        </div>
      </div>

      {/* Vertical Divider 1 */}
      <div className="h-7 sm:h-9 w-px bg-slate-200/90 mx-2 sm:mx-4 shrink-0" />

      {/* ================= CENTER: NARAYANA ENGINEERING COLLEGE ================= */}
      <div className="flex items-center justify-center flex-1 max-w-[260px] sm:max-w-xs md:max-w-sm px-1 sm:px-2">
        <img
          src="/narayana-college-logo.jpg"
          alt="Narayana Engineering College, Nellore, AP (Autonomous)"
          className="h-6 sm:h-8 md:h-10 w-auto object-contain max-w-full drop-shadow-xs"
          loading="eager"
        />
      </div>

      {/* Vertical Divider 2 */}
      <div className="h-7 sm:h-9 w-px bg-slate-200/90 mx-2 sm:mx-4 shrink-0" />

      {/* ================= RIGHT: GOOGLE CLOUD ================= */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-1 min-w-0">
        {/* Official Google Cloud 4-color Vector Cloud */}
        <div className="relative w-7 h-5 sm:w-8 sm:h-6 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 192 120" className="w-full h-full" fill="none">
            {/* Google Cloud SVG Official Geometry */}
            <path
              d="M152 48c-3.1 0-6.1.4-9 1.1C137.4 20.9 112.1 0 82 0 54.4 0 30.9 17.5 22.8 42.4 9.9 45.4 0 57.1 0 71c0 16.6 13.4 30 30 30h122c22.1 0 40-17.9 40-40 0-21.5-17-39-38.3-40-.6-7.3-6.6-13-13.7-13z"
              fill="#E8EAED"
              opacity="0"
            />
            {/* Blue segment */}
            <path
              d="M82 0C54.4 0 30.9 17.5 22.8 42.4 9.9 45.4 0 57.1 0 71c0 16.6 13.4 30 30 30h52V0z"
              fill="#4285F4"
            />
            {/* Green segment */}
            <path
              d="M82 0v101h70c22.1 0 40-17.9 40-40 0-21.5-17-39-38.3-40-.6-7.3-6.6-13-13.7-13-3.1 0-6.1.4-9 1.1C125.4 9.9 105.1 0 82 0z"
              fill="#34A853"
            />
            {/* Yellow segment */}
            <path
              d="M50 42c-2.4 0-4.7.4-6.8 1.1-7 2.4-12.2 8.7-13.2 16.4-1.2 9.5 4.8 18.5 14.2 20.5 1.9.4 3.8.6 5.8.6h32V42H50z"
              fill="#FBBC04"
            />
            {/* Red segment */}
            <path
              d="M82 42v38.6h28c10.7 0 19.4-8.6 19.4-19.3 0-10.4-8.2-18.9-18.5-19.3-.3-3.5-3.2-6.3-6.7-6.3-1.5 0-2.9.5-4 1.3C97.1 43.6 90.1 42 82 42z"
              fill="#EA4335"
            />
          </svg>
        </div>
        <div className="flex flex-col text-right leading-tight">
          <span className="font-extrabold text-[12px] sm:text-xs md:text-sm text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-0.5">
            <span className="text-[#5F6368]">Google</span>
            <span className="text-[#4285F4] ml-0.5">Cloud</span>
          </span>
        </div>
      </div>
    </motion.header>
  );
};
