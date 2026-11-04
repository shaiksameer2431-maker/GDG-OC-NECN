import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Compass, 
  CheckCircle2, 
  Cloud,
  Award,
  X,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroBannerDesignProps {
  onExploreLeaderboard: () => void;
  onExploreJourney: () => void;
}

export const HeroBannerDesign: React.FC<HeroBannerDesignProps> = ({
  onExploreLeaderboard,
  onExploreJourney
}) => {
  const [showSwagModal, setShowSwagModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCelebrateSwags = () => {
    setShowSwagModal(true);
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
      });
    } catch {}
  };

  return (
    <div className="relative w-full space-y-5">
      {/* =========================================================================
          MASTER NEOMORPHIC HIGH-DEFINITION BANNER SHOWCASE
          ========================================================================= */}
      <div 
        className="relative w-full p-2.5 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] bg-[#F0F4F9] shadow-[12px_12px_30px_#CFDCEE,-12px_-12px_30px_#FFFFFF] border border-white/95 overflow-hidden transition-all duration-500 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft Ambient Radial Corner Accents */}
        <div className="absolute top-0 left-0 w-56 h-56 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />

        {/* ================= HIGH FIDELITY BANNER WRAPPER ================= */}
        <div className="relative w-full rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.04)] border border-slate-200/70">
          
          {/* Pristine Full-Resolution Banner Graphic - Zero Cropping, Zero Quality Loss */}
          <img
            src="/official-banner-hq.jpg"
            alt="NECN Cloud Champions - Google Cloud Learn with Communities 2026 - Narayana Engineering College, Nellore"
            className="w-full h-auto object-contain block select-none transform transition-transform duration-700 group-hover:scale-[1.008]"
            style={{
              imageRendering: 'auto',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
            loading="eager"
            fetchPriority="high"
          />

          {/* Light Sweep Shimmer Effect on Subtle Hover */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] anim-shimmer" />
          </div>

          {/* Interactive Hotspot 1: Swags Trigger Area (Right Side) */}
          <div
            onClick={handleCelebrateSwags}
            className="hidden md:block absolute top-[15%] right-[12%] w-[22%] h-[68%] cursor-pointer group/swag z-20"
            title="Click to view official Google Cloud Swag kit!"
          >
            <div className="w-full h-full rounded-2xl transition-all duration-300 border-2 border-transparent group-hover/swag:border-blue-400/50 group-hover/swag:bg-blue-500/5 group-hover/swag:shadow-lg flex items-start justify-end p-2">
              <span className="opacity-0 group-hover/swag:opacity-100 transition-opacity bg-blue-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Gift className="w-3 h-3 text-amber-300" />
                <span>View Rewards</span>
              </span>
            </div>
          </div>

          {/* Interactive Hotspot 2: 5 Badges Pulse Indicator */}
          <div className="hidden lg:block absolute top-[14%] right-[7%] pointer-events-none z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-xs" />
            </span>
          </div>

          {/* Interactive Hotspot 3: 10 Badges Pulse Indicator */}
          <div className="hidden lg:block absolute top-[44%] right-[6%] pointer-events-none z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-xs" />
            </span>
          </div>

          {/* Interactive Hotspot 4: Win Exciting Swags Button Highlight */}
          <div 
            onClick={handleCelebrateSwags}
            className="hidden md:block absolute bottom-[18%] right-[4%] w-[12%] h-[12%] cursor-pointer select-none z-30"
            title="Click to celebrate rewards!"
          >
            <div className="w-full h-full rounded-full bg-transparent hover:bg-white/30 transition-all border border-transparent hover:border-white/60 active:scale-95" />
          </div>

        </div>

        {/* Ambient Floating 3D Google Primary Color Spheres */}
        <div className="hidden sm:block absolute -top-1 left-8 w-4 h-4 rounded-full bg-gradient-to-tr from-[#EAA000] to-[#FBBC04] shadow-md opacity-85 anim-float-1 pointer-events-none" title="Google Yellow" />
        <div className="hidden sm:block absolute top-12 -left-2 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#1557B0] to-[#1A73E8] shadow-md opacity-85 anim-float-2 pointer-events-none" title="Google Blue" />
        <div className="hidden sm:block absolute top-6 right-8 w-4 h-4 rounded-full bg-gradient-to-tr from-[#C5221F] to-[#EA4335] shadow-md opacity-85 anim-float-3 pointer-events-none" title="Google Red" />
        <div className="hidden sm:block absolute bottom-6 right-6 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#137333] to-[#34A853] shadow-md opacity-85 anim-float-1 pointer-events-none" title="Google Green" />
      </div>

      {/* =========================================================================
          NEOMORPHIC INTERACTIVE CONTROL DOCK (TACTILE CONTROLS & ACTIONS)
          ========================================================================= */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Information Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="neo-pill px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
            <span>Google Cloud Learn with Communities 2026</span>
          </div>

          <div className="neo-pill px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-600 font-semibold hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-900 font-extrabold">Learn. Build. Earn. Achieve.</span>
          </div>

          <div className="neo-pill px-2.5 py-1.5 rounded-xl text-slate-500 font-mono text-[11px] hidden lg:block">
            438 Registered Champions
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={onExploreLeaderboard}
            className="neo-btn-primary px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Explore Cohort Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
          </button>

          <button
            onClick={onExploreJourney}
            className="neo-btn px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>10-Course Curriculum</span>
          </button>

          <button
            onClick={handleCelebrateSwags}
            className="neo-btn px-3.5 py-2.5 rounded-xl font-bold text-xs text-blue-700 hover:text-blue-900 flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto"
            title="View Swags & Rewards"
          >
            <Gift className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Swag Rewards</span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          INTERACTIVE SWAG CELEBRATION MODAL (APPLE GLASS + NEOMORPHISM FINISH)
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
                className="p-2 rounded-xl neo-btn text-slate-500 hover:text-slate-800 transition-colors"
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
              <button
                onClick={() => {
                  setShowSwagModal(false);
                  onExploreJourney();
                }}
                className="flex-1 neo-btn-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Start Learning Path</span>
              </button>
              <button
                onClick={() => setShowSwagModal(false)}
                className="px-5 py-2.5 rounded-xl neo-btn font-bold text-xs text-slate-700"
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
