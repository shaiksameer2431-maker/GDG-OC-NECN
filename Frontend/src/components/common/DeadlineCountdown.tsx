import React from 'react';
import { Trophy, Award, Sparkles, Star, Users, CheckCircle2 } from 'lucide-react';

// =============================================================================
// CAMPAIGN STATUS CONFIGURATION
// Official Google Cloud Learn with Communities 2026 campaign is concluded.
// =============================================================================
export const DEADLINE_DATE = new Date('2026-11-23T16:59:00+05:30');

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Retained for backward-compatibility with any external callers
export function calculateTimeRemaining(): TimeRemaining {
  return {
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  };
}

export interface DeadlineCountdownProps {
  variant?: 'card' | 'compact';
  className?: string;
  onExploreClick?: () => void;
}

/**
 * Campaign Closure Announcement Component
 * 
 * Replaces the previous countdown timer with an official, celebratory announcement
 * honoring community achievements in Google Cloud Learn with Communities 2026.
 * Features official Google quad-colors (Blue #4285F4, Red #EA4335, Yellow #FBBC04, Green #34A853),
 * GDG On Campus branding, subtle floating celebration particles, and verified milestones.
 */
export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  variant = 'card',
  className = '',
  onExploreClick,
}) => {
  // ===========================================================================
  // 1. COMPACT VARIANT (For Sub-headers, Navigation Pills, Status Bars)
  // ===========================================================================
  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/90 shadow-xs select-none transition-all ${className}`}
        title="The Google Cloud Learn with Communities 2026 campaign has officially come to an end."
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34A853] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34A853]" />
        </span>
        <span className="flex items-center gap-1 font-sans font-black tracking-wider text-slate-800 uppercase">
          <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />
          <span>CAMPAIGN HAS ENDED!</span>
        </span>
      </div>
    );
  }

  // ===========================================================================
  // 2. CARD VARIANT (Hero Campaign Closure & Community Celebration Showcase)
  // ===========================================================================
  return (
    <div
      className={`w-full max-w-lg relative select-none rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-white/95 via-white/90 to-[#F8FAFC]/95 backdrop-blur-xl border border-white/95 shadow-[0_16px_40px_rgba(66,133,244,0.08),0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_48px_rgba(66,133,244,0.12),0_6px_20px_rgba(15,23,42,0.06)] ${className}`}
      role="region"
      aria-label="Google Cloud Learn with Communities Campaign Closure Announcement"
    >
      {/* Top Google Brand Quad-Color Accent Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]"
        aria-hidden="true"
      />

      {/* Ambient Soft Glow Background Spots (Google Quad-Colors at subtle opacity) */}
      <div
        className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#4285F4]/10 blur-2xl pointer-events-none anim-celebration-glow"
        aria-hidden="true"
      />
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#EA4335]/08 blur-2xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#34A853]/10 blur-2xl pointer-events-none anim-celebration-glow"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2 left-1/3 w-28 h-28 rounded-full bg-[#FBBC04]/08 blur-xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Celebratory Stars & Confetti Particles (Subtle & Non-distracting) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Particle 1: Golden Star (Top Right) */}
        <div className="absolute top-4 right-5 text-[#FBBC04] opacity-80 anim-celebration-sparkle">
          <Star className="w-3.5 h-3.5 fill-[#FBBC04]/50 stroke-[#FBBC04]" />
        </div>
        {/* Particle 2: Blue Star (Bottom Left) */}
        <div className="absolute bottom-14 left-4 text-[#4285F4] opacity-70 anim-celebration-float-slow">
          <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
        </div>
        {/* Particle 3: Subtle Red Confetti Pill (Top Center) */}
        <div className="absolute top-3 left-1/2 -translate-x-6 w-2 h-1 rounded-full bg-[#EA4335]/40 rotate-45 anim-celebration-float-fast" />
        {/* Particle 4: Subtle Green Confetti Diamond (Bottom Right) */}
        <div className="absolute bottom-12 right-6 w-1.5 h-1.5 rounded-xs bg-[#34A853]/50 rotate-12 anim-celebration-float-slow" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 space-y-4">
        {/* TOP STATUS PILL: Official Chapter Concluded Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-blue-50/90 via-amber-50/80 to-emerald-50/90 text-slate-700 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1" aria-hidden="true">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            </div>
            <span>OFFICIAL CHAPTER UPDATE • 2026 CAMPAIGN CONCLUDED</span>
            <Sparkles className="w-3 h-3 text-[#FBBC04]" aria-hidden="true" />
          </div>

          {/* Locked Status Badge */}
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            <span>FINALIZED</span>
          </div>
        </div>

        {/* HEADLINE & LOGO SHOWCASE ROW */}
        <div className="flex items-start justify-between gap-3 pt-0.5">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Prominent Announcement Headline */}
            <h3 className="text-xl sm:text-2xl md:text-[25px] font-black tracking-tight text-slate-900 leading-tight">
              CAMPAIGN HAS ENDED!
            </h3>

            {/* Google Brand Quad-Color Horizon Accent Dash */}
            <div className="flex items-center gap-1 pt-0.5" aria-hidden="true">
              <span className="h-1 w-7 rounded-full bg-[#4285F4]" />
              <span className="h-1 w-3.5 rounded-full bg-[#EA4335]" />
              <span className="h-1 w-3.5 rounded-full bg-[#FBBC04]" />
              <span className="h-1 w-7 rounded-full bg-[#34A853]" />
            </div>
          </div>

          {/* Official Google Cloud & GDG Dual Emblem Visual */}
          <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/90 border border-slate-200/70 shadow-xs shrink-0">
            {/* GDG Brackets Logo */}
            <img
              src="/gdg-brackets-logo.png"
              alt="GDG On Campus NECN"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              title="GDG On Campus Narayana Engineering College, Nellore"
            />
            {/* Divider */}
            <div className="w-px h-6 bg-slate-200" aria-hidden="true" />
            {/* Google Cloud Logo */}
            <img
              src="/assets/logos/google-cloud-logo.png"
              alt="Google Cloud"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
              title="Google Cloud Learn with Communities"
            />
          </div>
        </div>

        {/* SUPPORTING MESSAGE */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-medium">
          The Google Cloud Learn with Communities 2026 campaign has officially come to an end. Thank you to all the students who participated, completed labs, and earned Skill Badges!
        </p>

        {/* CELEBRATORY CHAPTER MILESTONES SHOWCASE (3 Verified Metric Chips) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Chip 1: Total Badges (Google Blue Accent) */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-1 text-[#1D4ED8] mb-0.5">
              <Award className="w-3.5 h-3.5 text-[#4285F4]" />
              <span className="text-[12px] sm:text-sm font-black font-mono">2,340</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              Badges Earned
            </span>
          </div>

          {/* Chip 2: M3 Champions (Google Amber/Gold Accent) */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-1 text-[#B45309] mb-0.5">
              <Trophy className="w-3.5 h-3.5 text-[#FBBC04]" />
              <span className="text-[12px] sm:text-sm font-black font-mono">207</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              M3 Champions
            </span>
          </div>

          {/* Chip 3: Registered Students (Google Green Accent) */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col items-center text-center transition-transform hover:-translate-y-0.5">
            <div className="flex items-center gap-1 text-[#15803D] mb-0.5">
              <Users className="w-3.5 h-3.5 text-[#34A853]" />
              <span className="text-[12px] sm:text-sm font-black font-mono">438</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 uppercase tracking-tight">
              Champions
            </span>
          </div>
        </div>

        {/* BOTTOM FOOTER STATUS STRIP */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
            <span>All lab submissions & Skill Badges verified</span>
          </span>
          {onExploreClick ? (
            <button
              onClick={onExploreClick}
              className="text-[#4285F4] hover:text-[#1D4ED8] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Standings</span>
              <span>→</span>
            </button>
          ) : (
            <a
              href="#leaderboard"
              className="text-[#4285F4] hover:text-[#1D4ED8] font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View Standings</span>
              <span>→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlineCountdown;
