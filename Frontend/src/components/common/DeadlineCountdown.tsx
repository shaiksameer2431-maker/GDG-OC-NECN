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
  // 1. COMPACT VARIANT (For Sub-headers / Pills)
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
        <span className="tracking-tight font-extrabold whitespace-nowrap">
          <span className="text-[#008AA8]">{pad(timeLeft.days)}d</span> :
          <span className="text-[#1D4ED8] ml-1">{pad(timeLeft.hours)}h</span> :
          <span className="text-[#B45309] ml-1">{pad(timeLeft.minutes)}m</span> :
          <span className="text-[#E11D48] ml-1">{pad(timeLeft.seconds)}s</span>
        </span>
      </div>
    );
  }

  // =========================================================================
  // 2. FOCUSED FLUID GLASS TIMER WITH NEON LIGHTING BORDER
  // Contains ONLY the 4 pods in fluid glassmorphism with vivid neon border lightings.
  // =========================================================================
  return (
    <div 
      className={`w-full max-w-lg relative select-none ${className}`}
      title="Official Campaign Deadline: 23 November 2026, 4:59 PM IST"
    >
      {/* Ambient Neon Backlight Bloom (Soft diffuse aura) */}
      <div 
        className="absolute -inset-1.5 bg-gradient-to-r from-[#00F0FF]/35 via-[#3B82F6]/25 to-[#FF2E74]/35 rounded-[1.75rem] blur-xl opacity-75 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Outer Neon Lighting Border Frame */}
      <div className="relative rounded-2xl sm:rounded-3xl p-[1.5px] neon-lighting-chassis overflow-hidden">
        
        {/* Inner Fluid Glass Plate */}
        <div className="neon-lighting-inner p-2 min-[380px]:p-2.5 sm:p-3 relative overflow-hidden">
          
          {/* Specular Top Glass Reflection */}
          <div 
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" 
            aria-hidden="true" 
          />

          {/* =========================================================================
              THE 4 FLUID GLASS PODS (DAYS · HOURS · MINS · SECS)
              ========================================================================= */}
          <div className="grid grid-cols-4 gap-1.5 min-[380px]:gap-2 sm:gap-2.5 relative z-10">
            
            {/* POD 1: DAYS (Fluid Glass + Neon Cyan Accent) */}
            <div className="smooth-glass-pod pod-cyan rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
              {/* Neon Top Pip */}
              <div className="w-5 min-[380px]:w-6 sm:w-8 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF,0_0_14px_rgba(0,240,255,0.7)] mb-1 sm:mb-1.5" />
              
              {/* Neon Number */}
              <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#008AA8] fluid-neon-cyan leading-none tracking-tight">
                {pad(timeLeft.days)}
              </span>

              {/* Subtitle */}
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
                DAYS
              </span>
            </div>

            {/* POD 2: HOURS (Fluid Glass + Neon Electric Blue Accent) */}
            <div className="smooth-glass-pod pod-blue rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
              {/* Neon Top Pip */}
              <div className="w-5 min-[380px]:w-6 sm:w-8 h-1 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6,0_0_14px_rgba(59,130,246,0.7)] mb-1 sm:mb-1.5" />
              
              {/* Neon Number */}
              <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#1D4ED8] fluid-neon-blue leading-none tracking-tight">
                {pad(timeLeft.hours)}
              </span>

              {/* Subtitle */}
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
                HOURS
              </span>
            </div>

            {/* POD 3: MINUTES (Fluid Glass + Neon Warm Amber Accent) */}
            <div className="smooth-glass-pod pod-amber rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
              {/* Neon Top Pip */}
              <div className="w-5 min-[380px]:w-6 sm:w-8 h-1 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24,0_0_14px_rgba(251,191,36,0.7)] mb-1 sm:mb-1.5" />
              
              {/* Neon Number */}
              <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#B45309] fluid-neon-amber leading-none tracking-tight">
                {pad(timeLeft.minutes)}
              </span>

              {/* Subtitle */}
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
                MINS
              </span>
            </div>

            {/* POD 4: SECONDS (Fluid Glass + Neon Vivid Ruby Accent) */}
            <div className="smooth-glass-pod pod-rose rounded-xl sm:rounded-2xl p-2 min-[380px]:p-2.5 sm:p-3.5 flex flex-col items-center justify-center relative overflow-hidden group/pod">
              {/* Neon Top Pip */}
              <div className="w-5 min-[380px]:w-6 sm:w-8 h-1 rounded-full bg-[#FF2E74] shadow-[0_0_8px_#FF2E74,0_0_16px_rgba(255,46,116,0.8)] mb-1 sm:mb-1.5" />
              
              {/* Neon Number */}
              <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#E11D48] fluid-neon-rose leading-none tracking-tight">
                {pad(timeLeft.seconds)}
              </span>

              {/* Subtitle */}
              <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-[#E11D48] uppercase mt-1 sm:mt-1.5">
                SECS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
