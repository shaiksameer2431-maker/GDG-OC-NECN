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
      className={`relative group p-4 sm:p-5 rounded-2xl bg-[#F0F4F9] shadow-[6px_6px_16px_#D0DCED,-6px_-6px_16px_#FFFFFF] border border-white/85 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_20px_#CAD7E8,-8px_-8px_20px_#FFFFFF] ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
            {value}
          </div>
        </div>
        
        {/* Tactile Neomorphic Inset Well for Icon */}
        <div className={`p-2.5 rounded-xl bg-[#EEF3F8] shadow-[inset_2px_2px_5px_#CAD7E8,inset_-2px_-2px_5px_#FFFFFF] border border-slate-200/50 ${iconColor} transition-transform duration-300 group-hover:scale-105 shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate pr-1">{subtitle}</span>
          {trend && (
            <span className="font-extrabold text-blue-600 font-mono shrink-0">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
