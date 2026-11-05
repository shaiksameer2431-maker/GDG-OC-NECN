import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Compass, 
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
    <div className="relative w-full space-y-4">
      {/* =========================================================================
          PRISTINE HIGH-DEFINITION OFFICIAL POSTER
          Zero cropping, zero quality loss, single continuous panoramic presentation
          Responsive media standard: w-full h-auto object-contain
          ========================================================================= */}
      <div 
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-[0_12px_40px_rgba(20,43,112,0.1)] border border-slate-200/90 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* The Exact Official High-Res Poster Image */}
        <img
          src="/official-banner-hq.jpg"
          alt="NECN Cloud Champions - Google Cloud Learn with Communities 2026 - Narayana Engineering College, Nellore"
          className="w-full h-auto object-contain block select-none transform transition-transform duration-700 group-hover:scale-[1.006]"
          style={{
            imageRendering: 'auto',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
          loading="eager"
          fetchPriority="high"
        />

        {/* Shimmer Light Sweep on Subtle Hover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] anim-shimmer" />
        </div>

        {/* Interactive Hotspot 1: Swags Trigger Area (Right Side) */}
        <div
          onClick={handleCelebrateSwags}
          className="hidden md:block absolute top-[15%] right-[11%] w-[24%] h-[72%] cursor-pointer group/swag z-20"
          title="Click to view official Google Cloud Swag kit!"
        >
          <div className="w-full h-full rounded-2xl transition-all duration-300 border-2 border-transparent group-hover/swag:border-blue-400/40 group-hover/swag:bg-blue-500/5 flex items-start justify-end p-2">
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

      {/* =========================================================================
          SLEEK INTERACTIVE CONTROL DOCK (TACTILE ACTIONS)
          ========================================================================= */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Information Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center gap-2 text-slate-800 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-pulse" />
            <span>Google Cloud Learn with Communities 2026</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 items-center gap-1.5 text-slate-700 font-semibold hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-900 font-extrabold">Learn. Build. Earn. Achieve.</span>
          </div>

          <div className="px-2.5 py-1.5 rounded-xl text-slate-500 font-mono text-[11px] hidden lg:block">
            438 Registered Champions
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={onExploreLeaderboard}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Explore Cohort Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
          </button>

          <button
            onClick={onExploreJourney}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>10-Course Curriculum</span>
          </button>

          <button
            onClick={handleCelebrateSwags}
            className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 w-full sm:w-auto border border-amber-200/60"
            title="View Swags & Rewards"
          >
            <Gift className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Swag Rewards</span>
          </button>
        </div>

      </div>

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
