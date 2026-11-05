import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative mt-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-2xl pt-8 pb-8 text-center shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100/80">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('overview')}
              className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 p-1.5 flex items-center justify-center shadow-xs transition-transform hover:scale-105 shrink-0"
              title="NECN Cloud Champions"
            >
              <img
                src="/gdg-brackets-logo.png"
                alt="GDG On Campus"
                className="w-full h-full object-contain"
              />
            </button>
            <div className="text-left min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight truncate">
                NECN CLOUD CHAMPIONS
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[210px] sm:max-w-none">
                GDG On Campus • Narayana Engineering College, Nellore
              </p>
            </div>
          </div>

          {/* Program Motto Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 border border-slate-200/80 text-slate-500 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="whitespace-nowrap font-medium">
              Learn. Build. Earn. Achieve.
            </span>
          </div>
        </div>

        {/* User-specified Footer Notice (Watermark Style in Soft Grey) */}
        <div className="pt-6 flex flex-col items-center justify-center gap-1.5 select-none opacity-60">
          <p className="text-[11px] font-normal text-slate-400 text-center tracking-normal sm:text-xs">
            Crafted with ❤️ by SHAIK SAMEER. All Rights reserved by GDG OC NECN Learn with Communities.
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Google Cloud Learn with Communities 2026 • Narayana Engineering College, Nellore
          </p>
        </div>
      </div>
    </footer>
  );
};
