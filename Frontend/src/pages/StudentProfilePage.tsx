import React, { useState } from 'react';
import type { Student, OfficialCourse } from '../types';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill, RedemptionPill } from '../components/common/BadgePill';
import { ProgressRing } from '../components/common/ProgressRing';
import { 
  ArrowLeft, 
  ExternalLink, 
  Award, 
  Check, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  CircleDot,
  Layers
} from 'lucide-react';

interface StudentProfilePageProps {
  student: Student;
  officialCourses: OfficialCourse[];
  onBack: () => void;
  isAdmin?: boolean;
}

// Fallback 10 official courses list in case officialCourses prop is empty
const DEFAULT_10_LABS: Array<{
  id: number;
  courseNumber: string;
  title: string;
  url: string;
  category: string;
  estimatedHours: string;
}> = [
  {
    id: 1,
    courseNumber: '01',
    title: 'The Basics of Google Cloud Compute',
    url: 'https://www.skills.google/course_templates/754',
    category: 'Compute & Infrastructure',
    estimatedHours: '4h',
  },
  {
    id: 2,
    courseNumber: '02',
    title: 'Configure Service Accounts and IAM Roles for Google Cloud',
    url: 'https://www.skills.google/course_templates/702',
    category: 'Security & IAM',
    estimatedHours: '5h',
  },
  {
    id: 3,
    courseNumber: '03',
    title: 'Implement Speech and Language Solutions with Pre-trained APIs',
    url: 'https://www.skills.google/course_templates/689',
    category: 'AI & Machine Learning',
    estimatedHours: '4h',
  },
  {
    id: 4,
    courseNumber: '04',
    title: 'Develop AI-Powered Prototypes in Google AI Studio',
    url: 'https://www.skills.google/course_templates/850',
    category: 'Generative AI',
    estimatedHours: '3h',
  },
  {
    id: 5,
    courseNumber: '05',
    title: 'Analyze Images with the Cloud Vision API',
    url: 'https://www.skills.google/course_templates/630',
    category: 'Computer Vision',
    estimatedHours: '4h',
  },
  {
    id: 6,
    courseNumber: '06',
    title: 'Build a Website on Google Cloud',
    url: 'https://www.skills.google/course_templates/644',
    category: 'Web & App Hosting',
    estimatedHours: '5h',
  },
  {
    id: 7,
    courseNumber: '07',
    title: 'Create Your First Gemini Enterprise Application',
    url: 'https://www.skills.google/course_templates/860',
    category: 'Gemini Enterprise',
    estimatedHours: '4h',
  },
  {
    id: 8,
    courseNumber: '08',
    title: 'Store, Process, and Manage Data on Google Cloud - Console',
    url: 'https://www.skills.google/course_templates/670',
    category: 'Cloud Storage & Databases',
    estimatedHours: '5h',
  },
  {
    id: 9,
    courseNumber: '09',
    title: 'Using the Google Cloud Speech API',
    url: 'https://www.skills.google/course_templates/695',
    category: 'Speech & Audio AI',
    estimatedHours: '4h',
  },
  {
    id: 10,
    courseNumber: '10',
    title: 'Explore Generative AI in Agent Platform',
    url: 'https://www.skills.google/course_templates/870',
    category: 'Autonomous Agents',
    estimatedHours: '5h',
  },
];

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  student,
  officialCourses,
  onBack,
}) => {
  // Use official courses or fallback to 10 standard labs
  const baseLabs = (officialCourses && officialCourses.length >= 10)
    ? officialCourses.slice(0, 10).map((c, i) => ({
        id: c.id,
        courseNumber: String(i + 1).padStart(2, '0'),
        title: c.title,
        url: c.url,
        category: c.category || 'Google Cloud',
        estimatedHours: c.estimatedHours || '4h',
      }))
    : DEFAULT_10_LABS;

  // Student's completed badges set (case-insensitive for robust matching)
  const studentBadgeSet = new Set(
    (student.skillBadges || []).map(b => b.toLowerCase().trim())
  );

  // Map each of the 10 labs to check if completed
  const labs = baseLabs.map((lab, idx) => {
    const isMatched = studentBadgeSet.has(lab.title.toLowerCase().trim());
    return {
      ...lab,
      index: idx + 1,
      isCompleted: isMatched,
    };
  });

  // Ensure completed count matches student.skillBadgeCount
  const completedCount = student.skillBadgeCount || 0;
  const directlyMatchedCount = labs.filter(l => l.isCompleted).length;

  if (directlyMatchedCount < completedCount) {
    let needed = completedCount - directlyMatchedCount;
    for (let i = 0; i < labs.length && needed > 0; i++) {
      if (!labs[i].isCompleted) {
        labs[i].isCompleted = true;
        needed--;
      }
    }
  }

  // Active / Selected lab for spotlight card (defaults to the first completed lab, or latest, or Lab #1)
  const defaultSelectedIndex = labs.findIndex(l => l.isCompleted) !== -1 
    ? labs.findIndex(l => l.isCompleted) 
    : 0;
  const [selectedLabIndex, setSelectedLabIndex] = useState<number>(defaultSelectedIndex);
  const activeLab = labs[selectedLabIndex] || labs[0];

  const badgePercentage = Math.round((completedCount / 10) * 100);

  // Achievement title based on milestone and badge points
  const getAchievementTitle = (s: Student) => {
    if (s.skillBadgeCount >= 10 || s.milestone === 'Milestone 3') return 'Google Cloud Architect';
    if (s.skillBadgeCount >= 6 || s.milestone === 'Milestone 2') return 'Cloud Specialist';
    if (s.skillBadgeCount >= 2 || s.milestone === 'Milestone 1') return 'Cloud Practitioner';
    if (s.redemptionStatus === 'Redeemed') return 'Cloud Explorer';
    return 'Registered Learner';
  };

  return (
    <div className="space-y-6 pt-20 sm:pt-24 pb-16">
      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Google Cloud Learner Profile</span>
        </span>
      </div>

      {/* PROFILE HEADER HERO (NEOMORPHIC GLASS FLUID CARD) */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,43,112,0.06),8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/95 p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <Avatar name={student.fullName} rank={student.rank} size="xl" />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
                  Rank #{student.rank}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {student.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {getAchievementTitle(student)}
                </span>
                <MilestonePill milestone={student.milestone} size="sm" />
                <RedemptionPill status={student.redemptionStatus} size="sm" />
              </div>

              {/* Profile External Links */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                {student.googleSkillsProfileUrl && student.googleSkillsProfileUrl !== 'Not applicable' && (
                  <a
                    href={student.googleSkillsProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <span>Google Cloud Skills Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {student.googleDeveloperProfileUrl && student.googleDeveloperProfileUrl !== 'Not applicable' && (
                  <a
                    href={student.googleDeveloperProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    <span>Developer Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Overall Points and Progress Ring */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 shrink-0 w-full md:w-auto justify-between md:justify-start shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                VERIFIED POINTS
              </span>
              <div className="text-3xl font-black font-mono text-slate-900">
                {student.points}
              </div>
              <span className="text-[11px] text-blue-700 font-semibold">
                {student.skillBadgeCount} Badges • {student.milestone}
              </span>
            </div>

            <ProgressRing
              progress={badgePercentage}
              size={70}
              strokeWidth={7}
              color="#10B981"
              backgroundColor="#E2E8F0"
              showLabel={true}
              subLabel="Badges"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          INTERACTIVE 10-LAB ROADMAP PATHWAY
          Inspired by Image 3: Numbered Circles along a Progress Path
          - Green circles for Completed Labs
          - Grey circles for Other/Remaining Labs
          - Cursor hover over any circle displays the full lab name & status tooltip!
          - Tap/click selects active lab spotlight below
          ========================================================================= */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,43,112,0.06),8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/95 p-5 sm:p-7 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Completed Labs & Skill Badges Track ({completedCount}/10)
              </h2>
              <p className="text-xs text-slate-500">
                Hover or tap any numbered circle to see the completed lab title and details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold shadow-xs">
              +{completedCount * 50} pts earned
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold">
              {badgePercentage}% Track
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-xs inline-block" />
              <span className="text-slate-800 font-semibold">Completed Lab (Green)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 border border-slate-300 inline-block" />
              <span className="text-slate-500">Remaining / Other (Grey)</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            Tip: Hover over any circle to view lab name
          </span>
        </div>

        {/* =====================================================================
            ROADMAP PATHWAY (2 Winding Stepped Rows: Row 1 (01-05), Row 2 (06-10))
            Number in circle with green completed / grey remaining & hover tooltip
            ===================================================================== */}
        <div className="py-4 px-2 sm:px-6 relative">
          {/* Row 1: Labs 01 to 05 */}
          <div className="relative mb-8 sm:mb-10">
            {/* Connecting progress track line */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-2.5 bg-slate-200/80 rounded-full z-0 hidden sm:block">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (Math.min(completedCount, 5) / 5) * 100)}%`
                }}
              />
            </div>

            {/* Circles Grid for Labs 01 to 05 */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 relative z-10">
              {labs.slice(0, 5).map((lab, i) => {
                const isSelected = selectedLabIndex === i;
                return (
                  <div 
                    key={lab.id} 
                    className="flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setSelectedLabIndex(i)}
                    onClick={() => setSelectedLabIndex(i)}
                  >
                    {/* Floating Tooltip displaying Lab Name on cursor hover */}
                    <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center z-30 pointer-events-none w-48 sm:w-56 transition-all duration-200 animate-in fade-in zoom-in-95">
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-2xl p-3 shadow-xl border border-white/10 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                            Lab #{lab.courseNumber}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            lab.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {lab.isCompleted ? '✓ Completed (+50 pts)' : 'Pending'}
                          </span>
                        </div>
                        <p className="font-bold text-[11px] leading-tight text-white">
                          {lab.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lab.category} • {lab.estimatedHours}
                        </p>
                      </div>
                      {/* Tooltip Downward Pointer Arrow */}
                      <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1 shadow-xs" />
                    </div>

                    {/* CIRCLE PIN WITH NUMBER */}
                    <div 
                      className={`w-11 h-11 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 relative ${
                        lab.isCompleted
                          ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 text-white shadow-[0_6px_18px_rgba(16,185,129,0.38)] ring-4 ring-emerald-100 border border-emerald-400'
                          : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300 shadow-inner'
                      } ${isSelected ? 'ring-4 ring-blue-400 scale-105' : ''}`}
                    >
                      {/* Top checkmark badge for completed labs */}
                      {lab.isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-emerald-600 shadow-sm flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Number inside circle */}
                      <span className="font-black font-mono text-sm sm:text-lg tracking-tight">
                        {lab.courseNumber}
                      </span>
                    </div>

                    {/* Compact Label under circle */}
                    <span className="mt-2 text-[10px] sm:text-xs font-bold text-center truncate max-w-full px-1 text-slate-600">
                      {lab.isCompleted ? (
                        <span className="text-emerald-700">Done</span>
                      ) : (
                        <span className="text-slate-400">Lab {lab.index}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stepped Road Turn Decorator (like Image 3) */}
          <div className="flex justify-end pr-8 -my-5 sm:-my-6 relative z-0 hidden sm:flex">
            <div className="w-16 h-12 border-r-4 border-b-4 border-slate-200 rounded-br-3xl" />
          </div>

          {/* Row 2: Labs 06 to 10 */}
          <div className="relative mt-4 sm:mt-6">
            {/* Connecting progress track line */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-2.5 bg-slate-200/80 rounded-full z-0 hidden sm:block">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${completedCount > 5 ? Math.min(100, ((completedCount - 5) / 5) * 100) : 0}%`
                }}
              />
            </div>

            {/* Circles Grid for Labs 06 to 10 */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 relative z-10">
              {labs.slice(5, 10).map((lab, i) => {
                const actualIndex = i + 5;
                const isSelected = selectedLabIndex === actualIndex;
                return (
                  <div 
                    key={lab.id} 
                    className="flex flex-col items-center group relative cursor-pointer"
                    onMouseEnter={() => setSelectedLabIndex(actualIndex)}
                    onClick={() => setSelectedLabIndex(actualIndex)}
                  >
                    {/* Floating Tooltip displaying Lab Name on cursor hover */}
                    <div className="absolute bottom-full mb-3 hidden group-hover:flex flex-col items-center z-30 pointer-events-none w-48 sm:w-56 transition-all duration-200 animate-in fade-in zoom-in-95">
                      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-2xl p-3 shadow-xl border border-white/10 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                            Lab #{lab.courseNumber}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            lab.isCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {lab.isCompleted ? '✓ Completed (+50 pts)' : 'Pending'}
                          </span>
                        </div>
                        <p className="font-bold text-[11px] leading-tight text-white">
                          {lab.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {lab.category} • {lab.estimatedHours}
                        </p>
                      </div>
                      {/* Tooltip Downward Pointer Arrow */}
                      <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 -mt-1 shadow-xs" />
                    </div>

                    {/* CIRCLE PIN WITH NUMBER */}
                    <div 
                      className={`w-11 h-11 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-110 relative ${
                        lab.isCompleted
                          ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 text-white shadow-[0_6px_18px_rgba(16,185,129,0.38)] ring-4 ring-emerald-100 border border-emerald-400'
                          : 'bg-slate-100 text-slate-400 border-2 border-dashed border-slate-300 shadow-inner'
                      } ${isSelected ? 'ring-4 ring-blue-400 scale-105' : ''}`}
                    >
                      {/* Top checkmark badge for completed labs */}
                      {lab.isCompleted && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white text-emerald-600 shadow-sm flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                        </div>
                      )}

                      {/* Number inside circle */}
                      <span className="font-black font-mono text-sm sm:text-lg tracking-tight">
                        {lab.courseNumber}
                      </span>
                    </div>

                    {/* Compact Label under circle */}
                    <span className="mt-2 text-[10px] sm:text-xs font-bold text-center truncate max-w-full px-1 text-slate-600">
                      {lab.isCompleted ? (
                        <span className="text-emerald-700">Done</span>
                      ) : (
                        <span className="text-slate-400">Lab {lab.index}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================================
            ACTIVE LAB SPOTLIGHT PANEL
            Displays live details for whichever circle is hovered or clicked
            ===================================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-inner border border-slate-200/80 transition-all space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs ${
                activeLab.isCompleted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {activeLab.courseNumber}
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Track Milestone #{activeLab.index} • {activeLab.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {activeLab.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                activeLab.isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}>
                {activeLab.isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed (+50 pts)</span>
                  </>
                ) : (
                  <>
                    <CircleDot className="w-3.5 h-3.5 text-slate-400" />
                    <span>Not Completed Yet</span>
                  </>
                )}
              </span>

              {activeLab.url && (
                <a
                  href={activeLab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <span>Open Lab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Estimated duration: <strong>{activeLab.estimatedHours}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Official Google Cloud Skills Boost Track</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
