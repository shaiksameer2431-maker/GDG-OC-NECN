import React from 'react';
import type { MilestoneType, RedemptionStatus, CourseStatus } from '../../types';
import { Award, CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';

interface MilestonePillProps {
  milestone: MilestoneType | string;
  size?: 'sm' | 'md';
}

export const MilestonePill: React.FC<MilestonePillProps> = ({ milestone, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClass = isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1 text-sm';

  switch (milestone) {
    case 'Milestone 3':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-300 shadow-sm ${sizeClass}`}
        >
          <Award className={isSm ? 'w-3 h-3 text-amber-600' : 'w-4 h-4 text-amber-600'} />
          Milestone 3
        </span>
      );
    case 'Milestone 2':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200 shadow-sm ${sizeClass}`}
        >
          <Award className={isSm ? 'w-3 h-3 text-blue-600' : 'w-4 h-4 text-blue-600'} />
          Milestone 2
        </span>
      );
    case 'Milestone 1':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-sm ${sizeClass}`}
        >
          <Award className={isSm ? 'w-3 h-3 text-cyan-600' : 'w-4 h-4 text-cyan-600'} />
          Milestone 1
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 text-slate-500 bg-slate-100 rounded-full border border-slate-200 font-normal ${sizeClass}`}>
          None
        </span>
      );
  }
};

interface RedemptionPillProps {
  status: RedemptionStatus;
  size?: 'sm' | 'md';
}

export const RedemptionPill: React.FC<RedemptionPillProps> = ({ status, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClass = isSm ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  if (status === 'Redeemed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm ${sizeClass}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Redeemed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-800 border border-amber-300/80 shadow-sm ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Not Redeemed
    </span>
  );
};

interface CourseStatusPillProps {
  status: CourseStatus;
}

export const CourseStatusPill: React.FC<CourseStatusPillProps> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
          In Progress
        </span>
      );
    case 'Not Started':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-500" />
          Not Started
        </span>
      );
    case 'Not Tracked':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Not Tracked
        </span>
      );
  }
};
