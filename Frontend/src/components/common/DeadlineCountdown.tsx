import React, { useState, useEffect } from 'react';

// Official Hard Cutoff Deadline: November 23, 2026 at 4:59 PM IST
export const DEADLINE_DATE = new Date('2026-11-23T16:59:00+05:30');

export interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function calculateTimeRemaining(target: Date = DEADLINE_DATE): TimeRemaining {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return {
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true
    };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return {
    total: diff,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false
  };
}

// =========================================================================
// REALISTIC ICONS (Authentic precision vectors - Zero cartoon/AI slop)
// =========================================================================

/** Realistic Precision Mechanical Chronometer / Stopwatch */
export const RealisticStopwatchIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 20 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Top Crown & Pushers */}
    <path d="M12 2V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 2H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18.5 4.5L16.8 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5.5 4.5L7.2 6.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Outer Stainless Steel Bezel */}
    <circle cx="12" cy="14" r="8" stroke="currentColor" strokeWidth="1.8" />
    
    {/* Inner Dial Precision Tick Marks */}
    <circle cx="12" cy="14" r="6.2" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 2.5" opacity="0.6" />
    
    {/* Dial Cardinal Ticks */}
    <line x1="12" y1="7.2" x2="12" y2="8.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="19.6" x2="12" y2="20.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5.2" y1="14" x2="6.4" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="17.6" y1="14" x2="18.8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Precision Hands */}
    <line x1="12" y1="14" x2="12" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
  </svg>
);

/** Realistic Calendar Date Blueprint Icon */
export const RealisticCalendarIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 18 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Calendar Outer Board */}
    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
    {/* Top Header Strip */}
    <path d="M3 9.5H21" stroke="currentColor" strokeWidth="1.5" />
    {/* Binder Metal Rings */}
    <path d="M7 2.5V5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17 2.5V5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Calendar Cells */}
    <circle cx="7.5" cy="13.5" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="13.5" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="16.5" cy="13.5" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="7.5" cy="17" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="17" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="16.5" cy="17" r="1" fill="currentColor" opacity="0.8" />
  </svg>
);

/** Realistic Google Cloud Verified Shield Icon */
export const RealisticCloudShieldIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 18 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
  >
    {/* Cloud Silhouette */}
    <path 
      d="M6.5 18C4.01 18 2 15.99 2 13.5C2 11.2 3.73 9.3 6 9.04C6.54 5.6 9.5 3 13 3C16.87 3 20 6.13 20 10C21.18 10.63 22 11.89 22 13.33C22 15.36 20.36 17 18.33 17H16" 
      stroke="currentColor" 
      strokeWidth="1.6" 
      strokeLinecap="round" 
    />
    {/* Central Check Mark */}
    <path 
      d="M9 13.5L11.5 16L16.5 10.5" 
      stroke="#0284C7" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

interface DeadlineCountdownProps {
  variant?: 'card' | 'compact';
  className?: string;
  onExploreClick?: () => void;
}

export const DeadlineCountdown: React.FC<DeadlineCountdownProps> = ({
  variant = 'card',
  className = '',
  onExploreClick
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    setTimeLeft(calculateTimeRemaining());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  // =========================================================================
  // 1. COMPACT VARIANT (For Sub-headers / Badges)
  // =========================================================================
  if (variant === 'compact') {
    if (timeLeft.isExpired) {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#090D1A] text-red-400 border border-red-500/50 shadow-sm select-none ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>PORTAL CLOSED</span>
        </div>
      );
    }

    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-white/70 backdrop-blur-md text-slate-800 border border-white/80 shadow-sm select-none transition-all ${className}`}
        title="Official Submission Deadline: 23 November 2026, 4:59 PM IST"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <RealisticStopwatchIcon size={13} className="text-[#0284C7]" />
        <span className="tracking-tight font-extrabold whitespace-nowrap">
          <span className="text-[#0284C7]">{pad(timeLeft.days)}d</span> :
          <span className="text-[#2563EB] ml-1">{pad(timeLeft.hours)}h</span> :
          <span className="text-[#D97706] ml-1">{pad(timeLeft.minutes)}m</span> :
          <span className="text-[#E11D48] ml-1">{pad(timeLeft.seconds)}s</span>
        </span>
        <span className="hidden lg:inline text-[9px] text-slate-500 font-sans font-semibold border-l border-slate-300 pl-2">
          23 Nov 4:59 PM
        </span>
      </div>
    );
  }

  // =========================================================================
  // 2. SEAMLESS FLUID GLASS HERO TIMER (Smooth Luxury Finishing)
  // Truly translucent fluid glassmorphism with ambient neon bloom.
  // Blends organically with the warm cream background; never looks "pasted".
  // =========================================================================
  return (
    <div className={`w-full max-w-lg rounded-2xl sm:rounded-3xl smooth-glass-timer p-3 min-[380px]:p-4 sm:p-5 space-y-3 relative overflow-hidden select-none transition-all ${className}`}>
      
      {/* Delicate Optical Specular Sheen (Natural glass highlight, NOT a harsh rainbow bar) */}
      <div 
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" 
        aria-hidden="true" 
      />

      {/* =========================================================================
          HEADER: Unified Seamless Row (Pulsing Live Dot + Clean Timestamp)
          ========================================================================= */}
      <div className="flex items-center justify-between gap-2 flex-wrap relative z-10 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Subtle Pulsing Live Radar Dot */}
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_6px_#E11D48]" />
          </span>

          <span className="text-[10.5px] min-[380px]:text-[11px] sm:text-xs font-mono font-extrabold tracking-wider uppercase text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
            <RealisticStopwatchIcon size={13} className="text-[#0284C7]" />
            <span>Campaign Cutoff</span>
          </span>
        </div>

        {/* Realistic Calendar Timestamp Readout */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] min-[380px]:text-[11px] sm:text-xs font-mono font-bold bg-white/50 backdrop-blur-sm text-slate-700 border border-white/70 shadow-2xs">
          <RealisticCalendarIcon size={12} className="text-amber-600" />
          <span className="text-amber-800 font-extrabold whitespace-nowrap">23 Nov 2026</span>
          <span className="text-slate-400">·</span>
          <span className="text-blue-700 font-extrabold whitespace-nowrap">4:59 PM IST</span>
        </div>
      </div>

      {/* =========================================================================
          THE 4 SEAMLESS FLUID GLASS PODS (DAYS · HOURS · MINS · SECS)
          Frosted crystal bays with soft ambient neon bloom.
          ========================================================================= */}
      <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2 sm:gap-2.5 relative z-10">
        
        {/* POD 1: DAYS (Fluid Glass + Neon Cyan) */}
        <div className="smooth-glass-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-cyan leading-none tracking-tight">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[10.5px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            DAYS
          </span>
        </div>

        {/* POD 2: HOURS (Fluid Glass + Neon Electric Blue) */}
        <div className="smooth-glass-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-blue leading-none tracking-tight">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[10.5px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            HOURS
          </span>
        </div>

        {/* POD 3: MINUTES (Fluid Glass + Neon Warm Amber) */}
        <div className="smooth-glass-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-amber leading-none tracking-tight">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[10.5px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            MINS
          </span>
        </div>

        {/* POD 4: SECONDS (Fluid Glass + Neon Vivid Ruby) */}
        <div className="smooth-glass-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-rose leading-none tracking-tight">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[10.5px] font-mono font-extrabold tracking-[0.2em] text-rose-600 uppercase mt-1.5">
            SECS
          </span>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC AMBIENT URGENCY RAIL (Delicate Glass Inset Track)
          ========================================================================= */}
      <div className="relative w-full h-1 bg-slate-200/40 rounded-full overflow-hidden border border-white/50 shadow-inner">
        <div className="absolute inset-y-0 left-0 right-0 neon-laser-sweep opacity-60" />
      </div>

      {/* =========================================================================
          FOOTER: Realistic Cloud Emblem + Seamless Integrated Instruction
          ========================================================================= */}
      <div className="flex items-center justify-between gap-2 pt-0.5 relative z-10 text-[10px] min-[380px]:text-[10.5px] sm:text-xs text-slate-600">
        <div className="flex items-center gap-1.5 leading-tight">
          <RealisticCloudShieldIcon size={14} className="text-[#0284C7] shrink-0" />
          <span>
            Google Skills Boost closes at <strong className="text-slate-800 font-mono font-bold">4:59 PM</strong>. Complete 10 labs for swags.
          </span>
        </div>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="text-[11px] font-mono font-bold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer underline underline-offset-2 flex items-center gap-1"
          >
            <span>Labs</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Portal Closed Overlay if deadline reached */}
      {timeLeft.isExpired && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-slate-900 rounded-2xl sm:rounded-3xl z-20 space-y-2 border border-red-500/40 shadow-sm">
          <RealisticStopwatchIcon size={32} className="text-red-500" />
          <h4 className="font-mono font-black text-lg sm:text-xl text-red-600 tracking-wider">
            DEADLINE REACHED • PORTAL CLOSED
          </h4>
          <p className="text-xs text-slate-600 max-w-sm">
            The November 23, 2026 4:59 PM cutoff has concluded. Results and certificate disbursements are now in verification.
          </p>
        </div>
      )}
    </div>
  );
};
