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
// REALISTIC ICONS (Authentic mechanical & cloud vectors - Zero AI cartoon slop)
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

/** Realistic Google Cloud Verified Node Icon */
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
      stroke="#00F0FF" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

interface DeadlineCountdownProps {
  variant?: 'card' | 'compact' | 'banner';
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
  // 1. COMPACT VARIANT (For Navbar / Header Badges - Sleek Neon Glass Pill)
  // =========================================================================
  if (variant === 'compact') {
    if (timeLeft.isExpired) {
      return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#090D1A] text-red-400 border border-red-500/50 shadow-[0_0_12px_rgba(255,46,116,0.3)] select-none ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>PORTAL CLOSED</span>
        </div>
      );
    }

    return (
      <div 
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#090D1A]/95 text-cyan-300 border border-cyan-500/40 shadow-[0_0_18px_rgba(0,240,255,0.25),inset_0_0_10px_rgba(0,240,255,0.08)] select-none hover:border-cyan-400 transition-all ${className}`}
        title="Official Submission Deadline: 23 November 2026, 4:59 PM IST"
      >
        <span className="relative flex h-2 w-2">
          <span className="neon-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#FF2E74] opacity-80" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2E74]" />
        </span>
        <RealisticStopwatchIcon size={14} className="text-cyan-400" />
        <span className="tracking-tight text-white font-extrabold whitespace-nowrap">
          <span className="text-[#00F0FF]">{pad(timeLeft.days)}d</span> :
          <span className="text-[#38BDF8] ml-1">{pad(timeLeft.hours)}h</span> :
          <span className="text-[#FBBF24] ml-1">{pad(timeLeft.minutes)}m</span> :
          <span className="text-[#FF2E74] ml-1 font-black">{pad(timeLeft.seconds)}s</span>
        </span>
        <span className="hidden lg:inline text-[9px] text-slate-400 font-sans font-semibold border-l border-cyan-500/30 pl-2">
          23 Nov 4:59 PM
        </span>
      </div>
    );
  }

  // =========================================================================
  // 2. FULL FLUID GLASSMORPHISM NEON HERO TIMER (With Transparency & Neon Bloom)
  // Designed for zero mobile breaking (supports 320px up to 4K displays!)
  // =========================================================================
  return (
    <div className={`w-full max-w-xl rounded-2xl sm:rounded-3xl fluid-glass-neon-chassis p-3.5 sm:p-5 space-y-3.5 relative overflow-hidden select-none transition-all ${className}`}>
      
      {/* Dynamic Flowing Neon Border Laser Tube (Top Edge Glow) */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 neon-border-glow-tube shadow-[0_0_12px_rgba(0,240,255,0.7)]" 
        aria-hidden="true" 
      />

      {/* Atmospheric Translucent Glass Refraction Blooms */}
      <div 
        className="absolute -top-12 -left-12 w-36 h-36 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-12 -right-12 w-36 h-36 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      {/* =========================================================================
          HEADER: Realistic Stopwatch + Pulsing Neon Radar Pill + Hard Cutoff Badge
          ========================================================================= */}
      <div className="flex items-center justify-between gap-2 flex-wrap relative z-10 pt-0.5">
        <div className="flex items-center gap-2">
          {/* Neon Pulsing Radar Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="neon-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#FF2E74] opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2E74] shadow-[0_0_8px_#FF2E74]" />
          </span>

          {/* Translucent Glass Mission Badge with Realistic Chronometer Icon */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-cyan-50/85 backdrop-blur-md text-cyan-800 border border-cyan-300/80 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <RealisticStopwatchIcon size={14} className="text-[#008AA8]" />
            <span>FINAL COUNTDOWN</span>
          </div>
        </div>

        {/* Realistic Calendar Timestamp Readout on Fluid Glass */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] min-[380px]:text-[11px] sm:text-xs font-mono font-bold bg-white/85 backdrop-blur-md text-slate-700 border border-slate-200/90 shadow-2xs">
          <RealisticCalendarIcon size={13} className="text-amber-600" />
          <span className="text-amber-700 font-extrabold whitespace-nowrap">23 NOV 2026</span>
          <span className="text-slate-400">//</span>
          <span className="text-blue-700 font-extrabold whitespace-nowrap">16:59:00 IST</span>
        </div>
      </div>

      {/* =========================================================================
          THE 4 TRANSLUCENT FLUID GLASS PODS (DAYS · HOURS · MINS · SECS)
          Each chamber pod features fluid glassmorphism, glowing neon diodes,
          and vibrant phosphor luminescence.
          ========================================================================= */}
      <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2 sm:gap-3 relative z-10">
        
        {/* POD 1: DAYS (Fluid Glass + Neon Cyan) */}
        <div className="fluid-glass-neon-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Diode */}
          <div className="w-5 h-0.5 rounded-full bg-[#00D2FF] shadow-[0_0_8px_#00D2FF] mb-1 sm:mb-1.5 opacity-90" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-cyan leading-none tracking-tight">
            {pad(timeLeft.days)}
          </span>
          
          {/* High-Tech Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            DAYS
          </span>
        </div>

        {/* POD 2: HOURS (Fluid Glass + Neon Electric Blue) */}
        <div className="fluid-glass-neon-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Diode */}
          <div className="w-5 h-0.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] mb-1 sm:mb-1.5 opacity-90" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-blue leading-none tracking-tight">
            {pad(timeLeft.hours)}
          </span>
          
          {/* High-Tech Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            HOURS
          </span>
        </div>

        {/* POD 3: MINUTES (Fluid Glass + Neon Radiant Amber) */}
        <div className="fluid-glass-neon-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Diode */}
          <div className="w-5 h-0.5 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24] mb-1 sm:mb-1.5 opacity-90" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-amber leading-none tracking-tight">
            {pad(timeLeft.minutes)}
          </span>
          
          {/* High-Tech Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-extrabold tracking-[0.2em] text-slate-500 uppercase mt-1.5">
            MINS
          </span>
        </div>

        {/* POD 4: SECONDS (Fluid Glass + Neon Laser Ruby with Active Pulse) */}
        <div className="fluid-glass-neon-pod rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden border-rose-200/80">
          {/* Top Diode */}
          <div className="w-5 h-0.5 rounded-full bg-[#FF2E74] shadow-[0_0_8px_#FF2E74] mb-1 sm:mb-1.5" />
          
          {/* Number with Live Pulse Glow */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl fluid-neon-rose leading-none tracking-tight">
            {pad(timeLeft.seconds)}
          </span>
          
          {/* High-Tech Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-extrabold tracking-[0.2em] text-rose-600 uppercase mt-1.5">
            SECS
          </span>
        </div>
      </div>

      {/* =========================================================================
          DYNAMIC NEON LASER URGENCY TRACK (Continuous Animated Light Beam)
          ========================================================================= */}
      <div className="relative w-full h-1 bg-slate-200/80 rounded-full overflow-hidden border border-slate-300/60 shadow-inner">
        <div className="absolute inset-y-0 left-0 right-0 neon-laser-sweep" />
      </div>

      {/* =========================================================================
          FOOTER: Realistic Cloud Shield + Verified Instruction Notice
          ========================================================================= */}
      <div className="flex items-center justify-between gap-2 pt-0.5 relative z-10 text-[10.5px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 leading-tight">
          <RealisticCloudShieldIcon size={16} className="text-[#008AA8] shrink-0" />
          <span>
            Google Skills Boost portal closes at <strong className="text-amber-700 font-mono font-bold">4:59 PM</strong>. Complete all 10 labs for swags & certificates.
          </span>
        </div>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="text-[11px] font-mono font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer underline underline-offset-2 flex items-center gap-1"
          >
            <span>Labs</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Portal Closed Overlay if deadline reached */}
      {timeLeft.isExpired && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center text-slate-900 rounded-2xl sm:rounded-3xl z-20 space-y-2 border border-red-500/50 shadow-[0_0_30px_rgba(255,46,116,0.2)]">
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
