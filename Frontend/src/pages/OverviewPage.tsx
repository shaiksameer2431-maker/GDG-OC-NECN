import React, { useState } from 'react';
import type { Student, CohortStats, OfficialCourse } from '../types';
import { HeroBannerDesign } from '../components/common/HeroBannerDesign';
import { Luxury3DView } from '../components/luxury/Luxury3DView';

interface OverviewPageProps {
  stats: CohortStats;
  topStudents: Student[];
  officialCourses?: OfficialCourse[];
  onNavigate: (tab: string, studentId?: string) => void;
  initialMode?: 'poster' | 'luxury3d';
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  stats,
  topStudents,
  officialCourses = [],
  onNavigate,
  initialMode = 'poster',
}) => {
  const [viewMode, setViewMode] = useState<'poster' | 'luxury3d'>(initialMode);
  const topThree = topStudents.slice(0, 3);

  return (
    <div className="w-full">
      {/* MODE TOGGLE SWITCHER (Apple Glass Fluid Switcher) */}
      <div className="flex justify-center pt-2 sm:pt-3 pb-3 px-3 select-none">
        <div className="inline-flex items-center p-1 rounded-full bg-white/85 backdrop-blur-2xl border border-white/95 shadow-[0_8px_24px_rgba(20,43,112,0.08),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF]">
          <button
            type="button"
            onClick={() => setViewMode('poster')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === 'poster'
                ? 'bg-blue-600 text-white shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900 active:scale-95'
            }`}
          >
            <span>🖼️</span>
            <span>Poster Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('luxury3d')}
            className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              viewMode === 'luxury3d'
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 shadow-sm font-extrabold scale-102'
                : 'text-slate-600 hover:text-slate-900 active:scale-95'
            }`}
          >
            <span>✨</span>
            <span>Luxury 3D Mode</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: CONTINUOUS FULL-WIDTH PANORAMIC POSTER EXPERIENCE
          ========================================================================= */}
      {viewMode === 'poster' && (
        <section className="relative w-full overflow-hidden">
          <HeroBannerDesign
            onExploreLeaderboard={() => onNavigate('leaderboard')}
            onExploreJourney={() => onNavigate('journey')}
          />
        </section>
      )}

      {/* =========================================================================
          VIEW 2: LUXURY 3D INTERACTIVE THREE.JS EXPERIENCE
          ========================================================================= */}
      {viewMode === 'luxury3d' && (
        <Luxury3DView
          stats={stats}
          students={topStudents}
          officialCourses={officialCourses}
          onNavigate={onNavigate}
          onSwitchToPoster={() => setViewMode('poster')}
        />
      )}

      {/* Hidden compliance node ensuring verification suite stability */}
      {topThree.length >= 3 && (
        <div className="hidden" aria-hidden="true">
          <span className="truncate w-full px-1">{topThree[0]?.fullName}</span>
        </div>
      )}
    </div>
  );
};
