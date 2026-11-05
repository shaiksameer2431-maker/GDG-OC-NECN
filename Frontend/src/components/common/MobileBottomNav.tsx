import React from 'react';
import { Sparkles, Trophy, Compass, Award, Info } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'achievements', label: 'Awards', icon: Award },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav 
      aria-label="Mobile Premium Navigation Dock"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[#F0F4F9]/92 backdrop-blur-2xl border-t border-white/90 shadow-[0_-10px_32px_rgba(20,43,112,0.08),inset_0_1px_2px_rgba(255,255,255,0.9)] px-2 py-1.5 select-none"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-300 active:scale-95 focus:outline-none"
            >
              {/* Tactile Neomorphic + Glassy Fluid Container */}
              <div
                className={`relative flex items-center justify-center w-11 h-9 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-blue-500/15 via-white to-blue-50/70 shadow-[inset_2px_2px_5px_#CAD7E8,inset_-2px_-2px_5px_#FFFFFF,0_4px_12px_rgba(26,115,232,0.2)] border border-blue-400/40 text-[#1A73E8]'
                    : 'text-slate-500 group-hover:text-slate-800 group-active:shadow-[inset_2px_2px_4px_#D0DCED,inset_-2px_-2px_4px_#FFFFFF]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isActive
                      ? 'stroke-[2.5] scale-110 drop-shadow-[0_2px_6px_rgba(26,115,232,0.35)]'
                      : 'stroke-[1.9] group-hover:scale-105'
                  }`}
                />

                {/* Liquid Fluid Glass Dot Indicator */}
                {isActive && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#1A73E8] shadow-[0_0_8px_#1A73E8]" />
                )}
              </div>

              {/* Tab Label */}
              <span
                className={`text-[9.5px] tracking-tight mt-1 transition-colors duration-200 leading-none ${
                  isActive
                    ? 'text-[#1A73E8] font-black'
                    : 'text-slate-500 font-semibold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
