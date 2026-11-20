import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

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
    // Initial sync
    setTimeLeft(calculateTimeRemaining());

    // Tick every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0');

  // =========================================================================
  // 1. COMPACT VARIANT (For Navbar / Header Badges)
  // =========================================================================
  if (variant === 'compact') {
    if (timeLeft.isExpired) {
      return (
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs select-none ${className}`}>
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span>Deadline Passed</span>
        </div>
      );
    }

    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-50/95 text-amber-900 border border-amber-300 shadow-2xs select-none hover:bg-amber-100/90 transition-all ${className}`}
        title="Google Cloud Learn with Communities Submission Deadline: 23 Nov, 4:59 PM IST"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
        </span>
        <Clock className="w-3 h-3 text-amber-600 shrink-0" />
        <span className="font-mono tracking-tight font-extrabold whitespace-nowrap">
          {pad(timeLeft.days)}d {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>
        <span className="hidden lg:inline text-[9px] text-amber-700 font-semibold border-l border-amber-300/80 pl-1.5 ml-0.5">
          23 Nov 4:59 PM
        </span>
      </div>
    );
  }

  // =========================================================================
  // 2. BANNER VARIANT (Full-width sticky top notice)
  // =========================================================================
  if (variant === 'banner') {
    return (
      <div className={`w-full bg-gradient-to-r from-amber-500/10 via-red-500/10 to-blue-500/10 border-y border-amber-300/60 py-2 px-4 backdrop-blur-md ${className}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
            <span className="font-extrabold text-slate-900">
              Official Campaign Cutoff:
            </span>
            <span className="text-slate-700 font-medium">
              November 23, 2026 at 4:59 PM IST
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono font-bold text-amber-900 bg-white/90 px-3 py-1 rounded-full border border-amber-300 shadow-2xs">
            <span>{pad(timeLeft.days)}d</span>:
            <span>{pad(timeLeft.hours)}h</span>:
            <span>{pad(timeLeft.minutes)}m</span>:
            <span>{pad(timeLeft.seconds)}s</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. FULL LUXURY HERO CARD VARIANT (For Overview Page & Mobile Hero)
  // Crafted to fit cleanly on 320px+ mobile screens with zero clipping!
  // =========================================================================
  return (
    <div className={`w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-xl border border-amber-300/70 shadow-[0_12px_36px_rgba(184,146,45,0.14),4px_4px_16px_#EADECA,-4px_-4px_16px_#FFFFFF] p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 transition-all relative overflow-hidden group ${className}`}>
      
      {/* Top Google Quad-Color Accent Strip */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853]" 
        aria-hidden="true" 
      />

      {/* Header with live pulsating urgency badge */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>

          <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 shadow-2xs">
            <Flame className="w-3 h-3 text-red-600 shrink-0" />
            <span>Campaign Deadline</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-700 bg-amber-50/80 px-2.5 py-0.5 rounded-lg border border-amber-200/80">
          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="whitespace-nowrap">23 Nov 2026 • 4:59 PM IST</span>
        </div>
      </div>

      {/* Main 4-Box Countdown Timer Grid (Mobile Responsive) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
        {/* DAYS */}
        <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 shadow-2xs group-hover:border-amber-300 transition-colors">
          <span className="font-mono font-black text-xl min-[380px]:text-2xl sm:text-3xl text-slate-900 leading-none tracking-tight">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 mt-1">
            Days
          </span>
        </div>

        {/* HOURS */}
        <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 shadow-2xs group-hover:border-amber-300 transition-colors">
          <span className="font-mono font-black text-xl min-[380px]:text-2xl sm:text-3xl text-slate-900 leading-none tracking-tight">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 mt-1">
            Hours
          </span>
        </div>

        {/* MINUTES */}
        <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 shadow-2xs group-hover:border-amber-300 transition-colors">
          <span className="font-mono font-black text-xl min-[380px]:text-2xl sm:text-3xl text-slate-900 leading-none tracking-tight">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 mt-1">
            Mins
          </span>
        </div>

        {/* SECONDS */}
        <div className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-50/80 to-amber-100/60 border border-amber-300/80 shadow-2xs">
          <span className="font-mono font-black text-xl min-[380px]:text-2xl sm:text-3xl text-amber-700 leading-none tracking-tight animate-pulse">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-700 mt-1">
            Secs
          </span>
        </div>
      </div>

      {/* Motivational Microcopy & Instructions */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[10.5px] sm:text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 leading-tight">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Complete all 10 labs on Google Skills Boost before the portal closes.</span>
        </div>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap underline shrink-0 cursor-pointer"
          >
            View Journey →
          </button>
        )}
      </div>

      {timeLeft.isExpired && (
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white rounded-2xl sm:rounded-3xl z-10 space-y-1">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          <h4 className="font-black text-base sm:text-lg">Campaign Period Concluded</h4>
          <p className="text-xs text-slate-300">The 23 Nov 4:59 PM deadline has passed. Thank you for participating!</p>
        </div>
      )}
    </div>
  );
};
