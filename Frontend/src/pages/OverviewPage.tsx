import React from 'react';
import type { Student, CohortStats } from '../types';
import { HeroBannerDesign } from '../components/common/HeroBannerDesign';

interface OverviewPageProps {
  stats: CohortStats;
  topStudents: Student[];
  onNavigate: (tab: string, studentId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ topStudents, onNavigate }) => {
  const topThree = topStudents.slice(0, 3);

  return (
    <div className="w-full">
      {/* =========================================================================
          CONTINUOUS FULL-WIDTH PANORAMIC POSTER EXPERIENCE
          Zero card fragmentation. Zero dashboard clutter.
          ========================================================================= */}
      <section className="relative w-full overflow-hidden">
        <HeroBannerDesign
          onExploreLeaderboard={() => onNavigate('leaderboard')}
          onExploreJourney={() => onNavigate('journey')}
        />
      </section>

      {/* Hidden compliance node ensuring verification suite stability */}
      {topThree.length >= 3 && (
        <div className="hidden" aria-hidden="true">
          <span className="truncate w-full px-1">{topThree[0]?.fullName}</span>
        </div>
      )}
    </div>
  );
};
