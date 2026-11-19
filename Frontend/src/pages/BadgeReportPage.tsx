import React, { useState } from 'react';
import type { Student, OfficialCourse, CohortStats } from '../types';
import { BadgeAnalyticsReport } from '../components/analytics/BadgeAnalyticsReport';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill } from '../components/common/BadgePill';
import { RankMedal } from '../components/common/RankMedal';
import { 
  BarChart3, 
  Trophy, 
  Users, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

interface BadgeReportPageProps {
  students: Student[];
  officialCourses: OfficialCourse[];
  stats: CohortStats;
  onSelectStudent: (studentId: string) => void;
  onNavigateToLeaderboard?: () => void;
}

export const BadgeReportPage: React.FC<BadgeReportPageProps> = ({
  students,
  officialCourses,
  stats,
  onSelectStudent,
  onNavigateToLeaderboard
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);

  // Filter students if user clicked a tier on this page
  const tierStudents = selectedTier !== null
    ? students.filter(s => s.skillBadgeCount === selectedTier)
    : selectedCourseName !== null
      ? students.filter(s => Array.isArray(s.skillBadges) && s.skillBadges.some(b => b.toLowerCase().includes(selectedCourseName.toLowerCase())))
      : [];

  return (
    <div className="space-y-6 sm:space-y-8 pt-16 sm:pt-20 md:pt-24 pb-16">
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-4 sm:pb-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>STANDALONE FEATURE • COHORT INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Badge Completion Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Detailed 1-to-10 badge distribution funnel and syllabus laboratory completions across the Google Cloud Learn with Communities cohort at Narayana Engineering College, Nellore.
          </p>
        </div>

        {onNavigateToLeaderboard && (
          <button
            onClick={onNavigateToLeaderboard}
            className="neo-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-2 self-start md:self-end shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>View Full Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* =========================================================================
          THE FULL BADGE ANALYTICS REPORT COMPONENT
          ========================================================================= */}
      <BadgeAnalyticsReport
        students={students}
        officialCourses={officialCourses}
        onSelectBadgeCount={(count) => {
          setSelectedCourseName(null);
          setSelectedTier(count);
          // scroll down to students table smoothly
          setTimeout(() => {
            const el = document.getElementById('tier-students-view');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onSelectCourseBadge={(courseName) => {
          setSelectedTier(null);
          setSelectedCourseName(courseName);
          setTimeout(() => {
            const el = document.getElementById('tier-students-view');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* =========================================================================
          INTERACTIVE DRILL-DOWN: STUDENTS IN SELECTED TIER OR COURSE
          ========================================================================= */}
      {(selectedTier !== null || selectedCourseName !== null) && (
        <section
          id="tier-students-view"
          className="p-5 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-white shadow-[0_12px_32px_rgba(20,43,112,0.06),6px_6px_20px_#D0DCED,-6px_-6px_20px_#FFFFFF] space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedTier !== null
                    ? `Students with Exactly ${selectedTier} ${selectedTier === 1 ? 'Badge' : 'Badges'} (${tierStudents.length})`
                    : `Students Who Completed "${selectedCourseName}" (${tierStudents.length})`}
                </h3>
                <p className="text-xs text-slate-500">
                  Click any student to view their verified profile and credentials.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTier(null);
                setSelectedCourseName(null);
              }}
              className="p-1.5 rounded-xl neo-btn text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Close filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {tierStudents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center">
              No students found for this selection.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {tierStudents.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStudent(s.id)}
                  className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/70 hover:border-blue-300 shadow-2xs hover:shadow-sm transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={s.fullName} rank={s.rank} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {s.fullName}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Rank #{s.rank} • {s.points} pts
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-blue-700 font-mono block">
                      {s.skillBadgeCount}/10
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">
                      Badges
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};
export default BadgeReportPage;
