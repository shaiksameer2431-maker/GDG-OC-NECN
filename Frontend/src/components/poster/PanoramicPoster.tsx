import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { 
  Cloud, 
  Award, 
  TrendingUp, 
  Gift, 
  Sparkles, 
  Check, 
  Send,
  X,
  Trophy,
  ArrowRight,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PanoramicPosterProps {
  onExploreLeaderboard?: () => void;
  onExploreJourney?: () => void;
}

export const PanoramicPoster: React.FC<PanoramicPosterProps> = ({
  onExploreLeaderboard,
  onExploreJourney
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [showSwagModal, setShowSwagModal] = useState(false);

  // Mouse Parallax Physics for 2.5D depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Layer transforms
  const bgX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-6, 6]);
  const bgY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-6, 6]);

  const midX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);
  const midY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-12, 12]);

  const foreX = useTransform(smoothX, [-1, 1], prefersReducedMotion ? [0, 0] : [-18, 18]);
  const foreY = useTransform(smoothY, [-1, 1], prefersReducedMotion ? [0, 0] : [-18, 18]);

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

  const handleCelebrateSwags = () => {
    setShowSwagModal(true);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
      });
    } catch {}
  };

  const checklistItems = [
    'Complete Labs',
    'Earn Badges',
    'Win Swags',
    'Build Your Future',
    'Be Future Ready!'
  ];

  return (
    <div className="relative w-full overflow-hidden select-none bg-[#F4F8FD]">
      {/* =========================================================================
          MASTER PANORAMIC POSTER CANVAS (EXACT 3:1 COMPOSITION ON DESKTOP)
          A single continuous scene. No card fragmentation. No separated backgrounds.
          ========================================================================= */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-[1920px] mx-auto md:aspect-[1024/341] min-h-[620px] md:min-h-0 bg-white overflow-hidden shadow-[0_12px_40px_rgba(20,43,112,0.08)] border border-slate-200/80"
      >
        {/* =====================================================================
            1. CONTINUOUS BACKGROUND: SKY, DRIFTING CLOUDS & COLOR ACCENTS
            ===================================================================== */}
        <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 pointer-events-none">
          {/* Base Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#F4F8FD] to-[#E5F0FC]" />

          {/* Left Decorative Yellow/Cyan Swirl & Cloud Formations */}
          <div className="absolute -top-[10%] -left-[5%] w-[28%] h-[60%] rounded-full bg-gradient-to-br from-[#FBBC04]/25 via-[#4285F4]/15 to-transparent blur-2xl" />
          
          {/* Right Decorative Red/Yellow Swirl & Cloud Formations */}
          <div className="absolute -top-[12%] -right-[6%] w-[32%] h-[65%] rounded-full bg-gradient-to-bl from-[#EA4335]/20 via-[#FBBC04]/20 to-transparent blur-2xl" />

          {/* Top-Left Big Yellow Orb */}
          <div className="absolute top-[2%] left-[3%] w-[7%] aspect-square rounded-full bg-[#FBBC04] shadow-md opacity-90" />

          {/* Top-Left Tech Dot Grid */}
          <div className="absolute top-[8%] left-[4%] grid grid-cols-4 gap-1 opacity-40">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-[#4285F4]" />
            ))}
          </div>

          {/* Top-Right Big Red 3D Sphere with Glow */}
          <div className="absolute top-[14%] right-[2%] w-[8%] aspect-square rounded-full bg-gradient-to-tr from-[#C5221F] via-[#EA4335] to-[#FF8A80] shadow-[0_8px_24px_rgba(234,67,53,0.35)] opacity-95" />

          {/* Top-Right Tech Dot Grid */}
          <div className="absolute top-[6%] right-[2%] grid grid-cols-4 gap-1 opacity-40">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-[#EA4335]" />
            ))}
          </div>

          {/* Far-Left Google Blue 3D Sphere */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[48%] left-[2%] w-[4.5%] aspect-square rounded-full bg-gradient-to-tr from-[#174EA6] via-[#1A73E8] to-[#8AB4F8] shadow-[0_6px_18px_rgba(26,115,232,0.3)]"
          />

          {/* Bottom Floating Google Accent Bubbles */}
          <motion.div
            animate={{ y: [3, -3, 3] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            className="absolute bottom-[24%] left-[26%] w-[3%] aspect-square rounded-full bg-[#FBBC04] shadow-md opacity-85"
          />
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
            className="absolute bottom-[16%] right-[32%] w-[3.5%] aspect-square rounded-full bg-[#34A853] shadow-md opacity-85"
          />

          {/* Bottom Continuous Sea of Clouds (Seamless Full-Width Rolling Clouds) */}
          <div className="absolute inset-x-0 bottom-0 h-[38%] overflow-hidden">
            <svg
              viewBox="0 0 1440 280"
              fill="none"
              className="w-full h-full preserve-3d"
              preserveAspectRatio="none"
            >
              {/* Back Cloud Layer */}
              <path
                d="M-40,180 C80,120 180,160 300,130 C420,100 540,150 680,120 C820,90 960,140 1100,110 C1240,80 1360,130 1480,100 L1480,280 L-40,280 Z"
                fill="#E8F1FC"
                fillOpacity="0.85"
              />
              {/* Mid Cloud Layer */}
              <path
                d="M-20,190 C100,140 220,190 360,160 C500,130 620,180 760,150 C900,120 1020,170 1160,140 C1300,110 1380,160 1460,140 L1460,280 L-20,280 Z"
                fill="#F3F7FE"
                fillOpacity="0.9"
              />
              {/* Front Crisp White Cloud Layer */}
              <path
                d="M0,210 C120,170 240,220 380,185 C520,150 640,200 780,170 C920,140 1040,190 1180,160 C1320,130 1400,180 1440,170 L1440,280 L0,280 Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>
        </motion.div>

        {/* =====================================================================
            2. TOP BRANDING ROW (GDG ON CAMPUS | NARAYANA | GOOGLE CLOUD)
            ===================================================================== */}
        <div className="relative md:absolute top-0 md:top-[2.5%] inset-x-0 md:left-[3%] md:right-[3%] z-30 flex items-center justify-between px-3 md:px-0 py-2.5 md:py-0">
          
          {/* Left: Google Developer Groups On Campus */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
            <img
              src="/gdg-brackets-logo.png"
              alt="GDG Brackets Logo"
              className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain shrink-0 drop-shadow-xs"
            />
            <div className="flex flex-col text-left leading-tight truncate">
              <span className="font-black text-[11px] sm:text-xs md:text-[13px] text-slate-900 tracking-tight whitespace-nowrap">
                Google Developer Groups
              </span>
              <span className="font-semibold text-[9px] sm:text-[10px] md:text-[11px] text-[#4285F4]">
                On Campus
              </span>
            </div>
          </div>

          {/* Vertical Separator 1 */}
          <div className="h-6 sm:h-8 md:h-9 w-px bg-slate-300 mx-2 sm:mx-4 shrink-0" />

          {/* Center: Narayana Engineering College Logo */}
          <div className="flex items-center justify-center flex-1 max-w-[220px] sm:max-w-xs md:max-w-sm px-1">
            <img
              src="/narayana-college-logo.jpg"
              alt="Narayana Engineering College, Nellore, AP (Autonomous)"
              className="h-6 sm:h-8 md:h-9 lg:h-10 w-auto object-contain max-w-full drop-shadow-xs"
            />
          </div>

          {/* Vertical Separator 2 */}
          <div className="h-6 sm:h-8 md:h-9 w-px bg-slate-300 mx-2 sm:mx-4 shrink-0" />

          {/* Right: Google Cloud Official Logo */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-1 min-w-0">
            {/* Google Cloud 4-color Vector Cloud */}
            <div className="w-6 h-4 sm:w-7 sm:h-5 md:w-8 md:h-6 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 192 120" className="w-full h-full" fill="none">
                <path d="M82 0C54.4 0 30.9 17.5 22.8 42.4 9.9 45.4 0 57.1 0 71c0 16.6 13.4 30 30 30h52V0z" fill="#4285F4" />
                <path d="M82 0v101h70c22.1 0 40-17.9 40-40 0-21.5-17-39-38.3-40-.6-7.3-6.6-13-13.7-13-3.1 0-6.1.4-9 1.1C125.4 9.9 105.1 0 82 0z" fill="#34A853" />
                <path d="M50 42c-2.4 0-4.7.4-6.8 1.1-7 2.4-12.2 8.7-13.2 16.4-1.2 9.5 4.8 18.5 14.2 20.5 1.9.4 3.8.6 5.8.6h32V42H50z" fill="#FBBC04" />
                <path d="M82 42v38.6h28c10.7 0 19.4-8.6 19.4-19.3 0-10.4-8.2-18.9-18.5-19.3-.3-3.5-3.2-6.3-6.7-6.3-1.5 0-2.9.5-4 1.3C97.1 43.6 90.1 42 82 42z" fill="#EA4335" />
              </svg>
            </div>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-black text-[12px] sm:text-xs md:text-sm text-slate-800 tracking-tight whitespace-nowrap">
                <span className="text-[#5F6368]">Google</span> <span className="text-[#4285F4]">Cloud</span>
              </span>
            </div>
          </div>

        </div>

        {/* =====================================================================
            3. LEFT-SIDE CLOUD TECH ILLUSTRATIONS (3D CLOUD & CUBES)
            ===================================================================== */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="relative md:absolute md:top-[16%] md:left-[3%] md:w-[26%] flex flex-col items-center justify-center z-20 my-4 md:my-0"
        >
          <motion.div
            animate={{ y: [-4, 5, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex items-center justify-center"
          >
            <img
              src="/banner-assets/cloud-3d-cubes.png"
              alt="Google Cloud 3D Tech Architecture"
              className="w-[85%] sm:w-[75%] md:w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(26,115,232,0.18)]"
            />
          </motion.div>
        </motion.div>

        {/* =====================================================================
            4. BOTTOM-LEFT BENEFITS PANEL (LEARN | EARN | BUILD)
            ===================================================================== */}
        <motion.div
          style={{ x: foreX, y: foreY }}
          className="relative md:absolute md:bottom-[4.5%] md:left-[2.5%] md:w-[24%] z-25 px-3 md:px-0 mb-4 md:mb-0"
        >
          <div className="w-full rounded-2xl bg-white/85 backdrop-blur-md p-2 sm:p-2.5 md:p-3 shadow-[0_6px_24px_rgba(20,43,112,0.06)] border border-white/95">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              {/* Learn */}
              <div className="flex flex-col items-center text-center px-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center mb-1 shadow-2xs">
                  <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h5 className="font-black text-[11px] sm:text-xs text-[#142B70] leading-tight">Learn</h5>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium leading-tight mt-0.5">
                  in-demand cloud skills
                </p>
              </div>

              {/* Earn */}
              <div className="flex flex-col items-center text-center px-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#FEF7E0] text-[#F9AB00] flex items-center justify-center mb-1 shadow-2xs">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h5 className="font-black text-[11px] sm:text-xs text-[#142B70] leading-tight">Earn</h5>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium leading-tight mt-0.5">
                  official Google badges
                </p>
              </div>

              {/* Build */}
              <div className="flex flex-col items-center text-center px-1">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-[#E6F4EA] text-[#1E8E3E] flex items-center justify-center mb-1 shadow-2xs">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                </div>
                <h5 className="font-black text-[11px] sm:text-xs text-[#142B70] leading-tight">Build</h5>
                <p className="text-[8px] sm:text-[9px] text-slate-500 font-medium leading-tight mt-0.5">
                  your profile for future opportunities
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================================================
            5. CENTER MAIN HERO (NECN CLOUD CHAMPIONS, PILL & TAGLINE)
            ===================================================================== */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="relative md:absolute md:top-[17%] md:left-[27%] md:right-[27%] flex flex-col items-center text-center z-25 my-4 md:my-0 px-2"
        >
          {/* Decorative Rays & NECN */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Left Sunburst Rays */}
            <div className="flex items-center gap-1 opacity-75">
              <span className="w-3 sm:w-4 h-0.5 bg-[#4285F4] transform -rotate-45 rounded-full" />
              <span className="w-4 sm:w-5 h-0.5 bg-[#FBBC04] rounded-full" />
              <span className="w-3 sm:w-4 h-0.5 bg-[#EA4335] transform rotate-45 rounded-full" />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-[#11295D] uppercase tracking-tight leading-none drop-shadow-xs">
              NECN
            </h1>

            {/* Right Sunburst Rays */}
            <div className="flex items-center gap-1 opacity-75">
              <span className="w-3 sm:w-4 h-0.5 bg-[#34A853] transform rotate-45 rounded-full" />
              <span className="w-4 sm:w-5 h-0.5 bg-[#4285F4] rounded-full" />
              <span className="w-3 sm:w-4 h-0.5 bg-[#FBBC04] transform -rotate-45 rounded-full" />
            </div>
          </div>

          {/* Cloud Champions */}
          <div className="mt-0.5 sm:mt-1 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0D70E6] tracking-tight drop-shadow-xs">
              Cloud
            </span>
            <span className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-[#0F9D58] tracking-tight drop-shadow-xs">
              Champions
            </span>
          </div>

          {/* Subtitle Pill */}
          <div className="mt-2 sm:mt-3 md:mt-3.5 inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#E8F2FE] border border-[#BFDBFE] shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FBBC04] fill-[#FBBC04] shrink-0" />
            <span className="text-[10px] sm:text-xs md:text-[13px] font-bold text-[#11295D] tracking-tight whitespace-nowrap">
              Google Cloud Learn with <span className="text-[#0D70E6]">Communities 2026</span>
            </span>
          </div>

          {/* Tagline */}
          <div className="mt-1.5 sm:mt-2.5 flex flex-col items-center">
            <p className="text-[11px] sm:text-xs md:text-sm font-extrabold text-[#11295D] tracking-wide">
              Learn. Build. Earn. Achieve.
            </p>
            {/* 4 Google Colored Underline Bars */}
            <div className="flex items-center gap-1 mt-1">
              <span className="w-4 sm:w-6 h-1 rounded-full bg-[#4285F4]" />
              <span className="w-4 sm:w-6 h-1 rounded-full bg-[#EA4335]" />
              <span className="w-4 sm:w-6 h-1 rounded-full bg-[#FBBC04]" />
              <span className="w-4 sm:w-6 h-1 rounded-full bg-[#34A853]" />
            </div>
          </div>
        </motion.div>

        {/* =====================================================================
            6. CENTER-BOTTOM COLLEGE BUILDING (EMBEDDED IN CLOUDS)
            ===================================================================== */}
        <motion.div
          style={{ x: midX, y: midY }}
          className="relative md:absolute md:bottom-0 md:left-[33%] md:right-[33%] md:w-[34%] flex flex-col items-center justify-end z-20 mt-4 md:mt-0"
        >
          <div className="relative w-full max-w-[420px] mx-auto flex items-end justify-center">
            <img
              src="/banner-assets/college-building.png"
              alt="Narayana Engineering College Building"
              className="w-full h-auto object-contain max-h-[140px] sm:max-h-[170px] md:max-h-[185px] lg:max-h-[200px]"
            />
            {/* Cloud mask across the building base for seamless natural blending */}
            <div className="absolute inset-x-0 bottom-0 h-8 sm:h-10 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* =====================================================================
            7. RIGHT-SIDE MERCHANDISE PACK, BADGE CARDS & WIN SWAGS
            ===================================================================== */}
        <motion.div
          style={{ x: foreX, y: foreY }}
          className="relative md:absolute md:top-[15%] md:right-[3%] md:w-[28%] flex flex-col items-center z-25 my-4 md:my-0 px-2"
        >
          {/* Handwritten Headline */}
          <div className="self-start md:ml-4 mb-1">
            <span className="text-[11px] sm:text-xs md:text-sm font-black text-[#0D70E6] tracking-tight">
              Same Labs. Bigger Opportunities! 🚀
            </span>
          </div>

          {/* Merchandise Pack Image */}
          <div className="relative w-full flex items-center justify-center">
            <motion.div
              animate={{ y: [-3, 4, -3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleCelebrateSwags}
              className="cursor-pointer group/swag w-full flex items-center justify-center"
              title="Click to view Google Cloud Swags!"
            >
              <img
                src="/banner-assets/swags-showcase.png"
                alt="Google Cloud Swags Pack"
                className="w-[85%] sm:w-[75%] md:w-full h-auto object-contain max-h-[140px] sm:max-h-[170px] md:max-h-[190px] transition-transform duration-300 group-hover/swag:scale-[1.03]"
              />
            </motion.div>

            {/* 5 Badges Yellow Card */}
            <div className="absolute -top-2 right-1 sm:right-2 px-2 py-1 rounded-xl bg-gradient-to-br from-[#FEF7E0] to-[#FDE293] border border-[#F9AB00]/60 shadow-md flex flex-col items-center">
              <span className="text-xs sm:text-sm font-black text-[#202124] leading-none">5</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#754A00] uppercase tracking-wider">
                Badges
              </span>
            </div>

            {/* 10 Badges Green Card */}
            <div className="absolute top-[42%] -right-1 sm:right-0 px-2 py-1 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#CEEAD6] border border-[#34A853]/60 shadow-md flex flex-col items-center">
              <span className="text-xs sm:text-sm font-black text-[#202124] leading-none">10</span>
              <span className="text-[8px] sm:text-[9px] font-extrabold text-[#137333] uppercase tracking-wider">
                Badges
              </span>
            </div>
          </div>

          {/* Win Exciting Swags! Blue Promotional Button */}
          <button
            onClick={handleCelebrateSwags}
            className="mt-1.5 md:mt-2 px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#1A73E8] to-[#174EA6] hover:from-[#174EA6] hover:to-[#185ABC] text-white font-black text-[11px] sm:text-xs shadow-[0_4px_14px_rgba(26,115,232,0.35)] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-[#FBBC04]" />
            <span>Win Exciting Swags! 🏆</span>
          </button>
        </motion.div>

        {/* =====================================================================
            8. BOTTOM-RIGHT LEARNING PATH NOTEBOOK
            ===================================================================== */}
        <motion.div
          style={{ x: foreX, y: foreY }}
          className="relative md:absolute md:bottom-[4.5%] md:right-[3%] md:w-[22%] z-25 px-3 md:px-0 mb-6 md:mb-0"
        >
          <div className="relative w-full rounded-2xl bg-[#FCFDFD] p-2.5 sm:p-3 shadow-[0_6px_20px_rgba(20,43,112,0.07)] border border-slate-200/90">
            {/* Spiral Binding Rings */}
            <div className="absolute -top-1.5 inset-x-0 flex justify-around px-3 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2.5 rounded-full bg-slate-300 border border-slate-400/50 shadow-inner"
                />
              ))}
            </div>

            {/* Title */}
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-dashed border-slate-200">
              <h5 className="font-black text-[10px] sm:text-[11px] text-[#11295D] uppercase tracking-tight">
                Your Learning Path
              </h5>
              <span className="text-[8px] font-bold text-[#34A853] bg-[#E6F4EA] px-1.5 py-0.5 rounded-full">
                5 Steps
              </span>
            </div>

            {/* Checklist */}
            <div className="space-y-1 text-left">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-[4px] bg-[#34A853] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 tracking-tight leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Flying Paper Airplane */}
            <div className="absolute -bottom-2 -left-2 pointer-events-none flex items-center justify-center">
              <motion.div
                animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-[#1A73E8] transform -rotate-12 drop-shadow-xs"
              >
                <Send className="w-3.5 h-3.5 fill-[#1A73E8]" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Ambient Shimmer Sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] anim-shimmer" />
        </div>
      </div>

      {/* =========================================================================
          DISCREET EXPLORATION DOCK (MINIMAL, ELEGANT, NON-INTRUSIVE)
          Provides one-click navigation to Leaderboard and Curriculum without dashboard clutter
          ========================================================================= */}
      {onExploreLeaderboard && (
        <div className="max-w-[1920px] mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-white/70 border-t border-slate-200/60">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
            <span>Google Cloud Learn with Communities 2026 • Narayana Engineering College</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onExploreLeaderboard}
              className="px-4 py-2 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore Cohort Leaderboard</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>

            {onExploreJourney && (
              <button
                onClick={onExploreJourney}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>10-Course Curriculum</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE SWAG CELEBRATION MODAL
          ========================================================================= */}
      {showSwagModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSwagModal(false)}
        >
          <div 
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-4 sm:p-6 sm:p-7 space-y-4 sm:space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Official Program Swag Rewards</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Google Cloud Swag Tier Rewards
                </h3>
              </div>
              <button
                onClick={() => setShowSwagModal(false)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Showcase Image */}
            <div className="p-3 rounded-2xl bg-white shadow-inner border border-slate-200/80 flex items-center justify-center">
              <img
                src="/banner-assets/swags-showcase.png"
                alt="Google Cloud Swags: Bottle, T-Shirt, Crossbody Bag, Stickers"
                className="max-h-44 object-contain"
              />
            </div>

            {/* Swags Tier Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
                  TIER 1
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">Complete 5 Skill Badges (Milestone 2)</h4>
                  <p className="text-slate-600 text-[11px]">
                    Eligible for Google Cloud Water Bottle & GDG Sticker Pack!
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  TIER 2
                </span>
                <div>
                  <h4 className="font-bold text-slate-900">Complete 10 Skill Badges (Milestone 3)</h4>
                  <p className="text-slate-600 text-[11px]">
                    Eligible for the full Swag Kit: Bottle, T-Shirt, Crossbody Bag & Certificate!
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {onExploreJourney && (
                <button
                  onClick={() => {
                    setShowSwagModal(false);
                    onExploreJourney();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#1A73E8] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Learning Path</span>
                </button>
              )}
              <button
                onClick={() => setShowSwagModal(false)}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

