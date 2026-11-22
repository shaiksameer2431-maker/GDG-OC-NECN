import React, { useState, useMemo } from 'react';
import type { Student, OfficialCourse } from '../../types';
import { 
  Award, 
  Trophy, 
  Crown, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  BarChart3, 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  BookOpen,
  Calendar
} from 'lucide-react';

interface BadgeAnalyticsReportProps {
  students: Student[];
  officialCourses: OfficialCourse[];
  onSelectBadgeCount?: (badgeCount: number) => void;
  onSelectCourseBadge?: (badgeName: string) => void;
  className?: string;
}

export const BadgeAnalyticsReport: React.FC<BadgeAnalyticsReportProps> = ({
  students,
  officialCourses,
  onSelectBadgeCount,
  onSelectCourseBadge,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'funnel' | 'courses'>('funnel');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // =========================================================================
  // DYNAMIC COMPUTATION FROM LIVE STUDENTS & OFFICIAL COURSES
  // Automatically recalculates whenever students array updates!
  // =========================================================================
  const analytics = useMemo(() => {
    const totalStudents = students.length || 438;
    
    // 1. Badge count exact distribution (0 to 10)
    const exactCounts: Record<number, number> = {};
    for (let i = 0; i <= 10; i++) exactCounts[i] = 0;

    let totalBadgesSum = 0;

    students.forEach(s => {
      const count = Math.min(Math.max(s.skillBadgeCount || 0, 0), 10);
      exactCounts[count] = (exactCounts[count] || 0) + 1;
      totalBadgesSum += (s.skillBadgeCount || 0);
    });

    // 2. Cumulative counts (>= N badges)
    const cumulativeCounts: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      cumulativeCounts[i] = students.filter(s => (s.skillBadgeCount || 0) >= i).length;
    }

    const activeLearners = cumulativeCounts[1] || 0; // >= 1 badge
    const milestone3Count = exactCounts[10] || 0; // 10 badges
    const milestone2Count = cumulativeCounts[5] || 0; // >= 5 badges
    const milestone1Count = cumulativeCounts[3] || 0; // >= 3 badges

    // 3. Course badge-by-badge completion counts (Courses 01 to 10)
    const courseBreakdown = officialCourses.map(course => {
      const completers = students.filter(s => 
        Array.isArray(s.skillBadges) && s.skillBadges.some(b => 
          b.toLowerCase().trim() === course.badgeName.toLowerCase().trim()
        )
      ).length;

      const rateActive = activeLearners > 0 ? (completers / activeLearners) * 100 : 0;
      const rateCohort = totalStudents > 0 ? (completers / totalStudents) * 100 : 0;

      return {
        ...course,
        completers,
        rateActive: Math.round(rateActive * 10) / 10,
        rateCohort: Math.round(rateCohort * 10) / 10
      };
    });

    return {
      totalStudents,
      totalBadgesSum,
      activeLearners,
      milestone3Count,
      milestone2Count,
      milestone1Count,
      exactCounts,
      cumulativeCounts,
      courseBreakdown
    };
  }, [students, officialCourses]);

  // Milestone tier helper badge details
  const getTierMeta = (count: number) => {
    if (count === 10) {
      return {
        label: 'Milestone 3 (Elite)',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        badgeBg: 'bg-emerald-600',
        barGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        icon: Crown,
        perk: 'Developer Kit + T-Shirt'
      };
    }
    if (count >= 5) {
      return {
        label: count === 5 ? 'Milestone 2 (Unlocked)' : 'Advanced (6-9)',
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        badgeBg: 'bg-amber-600',
        barGradient: 'from-amber-500 via-orange-500 to-yellow-500',
        icon: Trophy,
        perk: 'Google Water Bottle'
      };
    }
    if (count >= 3) {
      return {
        label: count === 3 ? 'Milestone 1 (Unlocked)' : 'Intermediate (4)',
        bg: 'bg-blue-50 text-blue-800 border-blue-300',
        badgeBg: 'bg-blue-600',
        barGradient: 'from-blue-500 via-indigo-500 to-sky-500',
        icon: Award,
        perk: 'Certificate of Cloud Excellence'
      };
    }
    return {
      label: 'Early Achiever (1-2)',
      bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      badgeBg: 'bg-indigo-600',
      barGradient: 'from-indigo-400 to-blue-400',
      icon: Sparkles,
      perk: 'Digital Credential Badges'
    };
  };

  return (
    <div className={`p-5 sm:p-7 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/95 shadow-[0_12px_36px_rgba(20,43,112,0.06),6px_6px_20px_#D0DCED,-6px_-6px_20px_#FFFFFF] space-y-6 transition-all duration-300 ${className}`}>
      
      {/* =========================================================================
          TOP HEADER WITH LIVE SYNC PILL & TOGGLE
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>LIVE COHORT ANALYTICS</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Auto-Synced with Data</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs">
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>Updated on: 22 Nov 2026</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Badge Completion Report</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              1 to 10 Scale
            </span>
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Real-time breakdown of students by badges earned (1 to 10) and specific course laboratory completions across the <strong>{analytics.totalStudents}</strong> cohort students.
          </p>
        </div>

        {/* View switcher & collapse trigger */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {/* Segmented Control Pill */}
          <div className="flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
            <button
              onClick={() => { setActiveTab('funnel'); setIsExpanded(true); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'funnel'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1-10 Funnel</span>
            </button>
            <button
              onClick={() => { setActiveTab('courses'); setIsExpanded(true); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses 01-10</span>
            </button>
          </div>

          {/* Expand/Collapse Header Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl neo-btn text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
            title={isExpanded ? 'Collapse report' : 'Expand report'}
            aria-label="Toggle report"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          KEY EXECUTIVE METRIC CARDS (Always visible at top)
          ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Badges */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-[inset_1px_1px_3px_#FFFFFF,3px_3px_10px_#D0DCED] space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              Total Badges
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {analytics.totalBadgesSum}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            Earned across entire cohort
          </p>
        </div>

        {/* Metric 2: Active Earners */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-[inset_1px_1px_3px_#FFFFFF,3px_3px_10px_#D0DCED] space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              Active Earners
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
            {analytics.activeLearners}{' '}
            <span className="text-xs font-semibold text-slate-500">
              / {analytics.totalStudents}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {Math.round((analytics.activeLearners / analytics.totalStudents) * 1000) / 10}% of students earned $\ge$ 1 badge
          </p>
        </div>

        {/* Metric 3: Milestone 3 (10 Badges) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-[inset_1px_1px_3px_#FFFFFF,3px_3px_10px_#D0DCED] space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              10-Badge Masters
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
            {analytics.milestone3Count}{' '}
            <span className="text-xs font-semibold text-slate-500">
              ({Math.round((analytics.milestone3Count / analytics.totalStudents) * 1000) / 10}%)
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium truncate">
            Completed all 10 official badges
          </p>
        </div>

        {/* Metric 4: Milestone 2 Tier (>= 5 Badges) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-slate-200/60 shadow-[inset_1px_1px_3px_#FFFFFF,3px_3px_10px_#D0DCED] space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              5+ Badges (M2+)
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono">
            {analytics.milestone2Count}{' '}
            <span className="text-xs font-semibold text-slate-500">
              ({Math.round((analytics.milestone2Count / analytics.totalStudents) * 1000) / 10}%)
            </span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium truncate">
            Bronze Milestone Chapter Target Met!
          </p>
        </div>
      </div>

      {/* =========================================================================
          EXPANDABLE BODY: TAB CONTENT
          ========================================================================= */}
      {isExpanded && (
        <div className="pt-2 space-y-6 animate-in fade-in duration-300">
          
          {/* -------------------------------------------------------------------
              TAB 1: 1 TO 10 BADGE COUNT PROGRESSION FUNNEL
              ------------------------------------------------------------------- */}
          {activeTab === 'funnel' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>Badge Milestone Tier (1 to 10)</span>
                <span>Students Completed (Exact & Cumulative)</span>
              </div>

              {/* Rows 10 down to 1 */}
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((badgeCount) => {
                const exact = analytics.exactCounts[badgeCount] || 0;
                const cumulative = analytics.cumulativeCounts[badgeCount] || 0;
                const pctCohort = Math.round((cumulative / analytics.totalStudents) * 1000) / 10;
                const pctActive = analytics.activeLearners > 0 
                  ? Math.round((cumulative / analytics.activeLearners) * 1000) / 10 
                  : 0;
                const meta = getTierMeta(badgeCount);
                const IconComponent = meta.icon;

                return (
                  <div
                    key={badgeCount}
                    onClick={() => onSelectBadgeCount?.(badgeCount)}
                    className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      {/* Left: Badge level + Tag */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl ${meta.badgeBg} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs font-mono`}>
                          {badgeCount}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {badgeCount} {badgeCount === 1 ? 'Skill Badge' : 'Skill Badges'}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.bg}`}>
                              <IconComponent className="w-3 h-3" />
                              <span>{meta.label}</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block truncate">
                            Perk unlock: {meta.perk}
                          </span>
                        </div>
                      </div>

                      {/* Right: Numbers */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-mono text-right">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block font-sans text-[10px] uppercase font-bold">
                            Exact Students
                          </span>
                          <span className="text-sm font-extrabold text-slate-800">
                            {exact} {exact === 1 ? 'student' : 'students'}
                          </span>
                        </div>

                        <div className="text-right pl-3 sm:pl-4 border-l border-slate-200">
                          <span className="text-xs text-slate-400 block font-sans text-[10px] uppercase font-bold">
                            $\ge$ {badgeCount} Badges
                          </span>
                          <span className="text-sm font-black text-blue-700">
                            {cumulative} students
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Fill Meter */}
                    <div className="mt-3 space-y-1">
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${meta.barGradient} transition-all duration-700 ease-out`}
                          style={{ width: `${Math.min(Math.max((cumulative / analytics.totalStudents) * 100, 2), 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{pctCohort}% of full cohort ({cumulative}/{analytics.totalStudents})</span>
                        <span>{pctActive}% of active earners</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Zero Badges row */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-[11px]">
                    0
                  </span>
                  <span><strong>{analytics.exactCounts[0] || 0} students</strong> have 0 badges registered (Pending lab redemption or completion sync)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {Math.round(((analytics.exactCounts[0] || 0) / analytics.totalStudents) * 1000) / 10}%
                </span>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------------------
              TAB 2: COURSES 01 TO 10 SYLLABUS COMPLETION BREAKDOWN
              ------------------------------------------------------------------- */}
          {activeTab === 'courses' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                <span>Google Cloud Course Badge (01 to 10)</span>
                <span>Students Completed</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analytics.courseBreakdown.map((course, idx) => (
                  <div
                    key={course.id || idx}
                    onClick={() => onSelectCourseBadge?.(course.badgeName)}
                    className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between space-y-3 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-black text-xs font-mono flex items-center justify-center shrink-0 border border-blue-200/70 mt-0.5">
                          {course.courseNumber}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {course.badgeName}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                            {course.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base sm:text-lg font-black text-blue-700 font-mono block">
                          {course.completers}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Students
                        </span>
                      </div>
                    </div>

                    {/* Progress meter */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                          style={{ width: `${Math.min(Math.max((course.completers / analytics.activeLearners) * 100, 2), 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{course.rateActive}% of active earners</span>
                        {course.url && (
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline font-sans font-bold"
                          >
                            <span>Official Lab</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          FOOTER NOTE FOR REAL-TIME UPDATE GUARANTEE
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
          <span>Real-time reactive engine: updates instantaneously whenever new CSV data is ingested.</span>
        </span>
        <span className="font-mono text-slate-500">
          Cohort Ground Truth: {analytics.totalStudents} Registered • {analytics.activeLearners} Active
        </span>
      </div>

    </div>
  );
};
