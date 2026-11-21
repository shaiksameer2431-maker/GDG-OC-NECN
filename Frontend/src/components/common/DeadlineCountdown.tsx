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
  // 2. FOCUSED FLUID GLASS TIMER WITH NEON COLOR-CHANGING BORDERS
  // Pure floating fluid glass pods with animated neon color-shifting borders.
  // Zero outer background card for a clean, seamless, transparent presentation.
  // =========================================================================
  return (
    <div 
      className={`w-full max-w-md relative select-none ${className}`}
      title="Official Campaign Deadline: 23 November 2026, 4:59 PM IST"
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 relative z-10">
        
        {/* POD 1: DAYS (Fluid Glass + Animated Neon Border) */}
        <div className="fluid-neon-border-box neon-delay-1 p-2 sm:p-3 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Neon Pip */}
          <div className="w-5 min-[380px]:w-6 sm:w-7 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] mb-1 sm:mb-1.5" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#008AA8] fluid-neon-cyan leading-none tracking-tight">
            {pad(timeLeft.days)}
          </span>

          {/* Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
            DAYS
          </span>
        </div>

        {/* POD 2: HOURS (Fluid Glass + Animated Neon Border) */}
        <div className="fluid-neon-border-box neon-delay-2 p-2 sm:p-3 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Neon Pip */}
          <div className="w-5 min-[380px]:w-6 sm:w-7 h-1 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6] mb-1 sm:mb-1.5" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#1D4ED8] fluid-neon-blue leading-none tracking-tight">
            {pad(timeLeft.hours)}
          </span>

          {/* Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
            HOURS
          </span>
        </div>

        {/* POD 3: MINUTES (Fluid Glass + Animated Neon Border) */}
        <div className="fluid-neon-border-box neon-delay-3 p-2 sm:p-3 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Neon Pip */}
          <div className="w-5 min-[380px]:w-6 sm:w-7 h-1 rounded-full bg-[#A855F7] shadow-[0_0_8px_#A855F7] mb-1 sm:mb-1.5" />
          
          {/* Number */}
          <span className="font-mono font-black text-2xl min-[380px]:text-3xl sm:text-4xl text-[#9333EA] fluid-neon-amber leading-none tracking-tight">
            {pad(timeLeft.minutes)}
          </span>

          {/* Subtitle */}
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mt-1 sm:mt-1.5">
            MINS
          </span>
        </div>

        {/* POD 4: SECONDS (Fluid Glass + Animated Neon Border) */}
        <div className="fluid-neon-border-box neon-delay-4 p-2 sm:p-3 flex flex-col items-center justify-center relative overflow-hidden group/pod">
          {/* Top Neon Pip */}
          <div className="w-5 min-[380px]:w-6 sm:w-7 h-1 rounded-full bg-[#FF2E74] shadow-[0_0_8px_#FF2E74] mb-1 sm:mb-1.5" />
          
          {/* Number */}
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
  );
};
