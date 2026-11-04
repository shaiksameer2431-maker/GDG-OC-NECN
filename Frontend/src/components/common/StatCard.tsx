import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  glowColor?: 'blue' | 'emerald' | 'amber' | 'gold' | 'rose' | 'default';
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  glowColor = 'default',
  trend,
  className = ''
}) => {
  return (
    <div
      className={`relative group p-3 sm:p-4 lg:p-5 rounded-2xl bg-[#F0F4F9] shadow-[6px_6px_16px_#D0DCED,-6px_-6px_16px_#FFFFFF] border border-white/85 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_20px_#CAD7E8,-8px_-8px_20px_#FFFFFF] min-w-0 ${className}`}
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
        <div className="space-y-0.5 sm:space-y-1 min-w-0">
          <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block truncate">
            {title}
          </span>
          <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-mono truncate">
            {value}
          </div>
        </div>
        
        {/* Tactile Neomorphic Inset Well for Icon */}
        <div className={`p-1.5 sm:p-2 lg:p-2.5 rounded-xl bg-[#EEF3F8] shadow-[inset_2px_2px_5px_#CAD7E8,inset_-2px_-2px_5px_#FFFFFF] border border-slate-200/50 ${iconColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-1">
          <span className="truncate pr-1 text-[10px] sm:text-xs">{subtitle}</span>
          {trend && (
            <span className="font-extrabold text-blue-600 font-mono shrink-0 text-[10px] sm:text-xs">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
