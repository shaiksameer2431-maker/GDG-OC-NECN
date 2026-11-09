import React, { useState, useMemo, useEffect } from 'react';
import type { Student, CohortStats } from '../types';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill, RedemptionPill } from '../components/common/BadgePill';
import { RankMedal } from '../components/common/RankMedal';
import { 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Trophy, 
  CheckCircle, 
  Info,
  ShieldCheck,
  X,
  Eye,
  Award
} from 'lucide-react';
import { matchesSearchQuery } from '../utils/searchHelper';

interface LeaderboardPageProps {
  students: Student[];
  stats: CohortStats;
  onSelectStudent: (studentId: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  students,
  stats,
  onSelectStudent
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [redemptionFilter, setRedemptionFilter] = useState<'all' | 'redeemed' | 'not-redeemed'>('all');
  const [milestoneFilter, setMilestoneFilter] = useState<string>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'points' | 'badges' | 'name'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Modal for Tie-breaking & Scoring Rules
  const [showTieBreakRules, setShowTieBreakRules] = useState(false);

  // Student Quick Details Eye Modal for Mobile
  const [eyeStudent, setEyeStudent] = useState<Student | null>(null);

  // PREVENT BACKGROUND SCROLL WHEN EYE MODAL IS OPEN (STRICT SCROLL LOCK)
  useEffect(() => {
    if (eyeStudent) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || '';
      };
    }
  }, [eyeStudent]);

  const handleRowClick = (student: Student) => {
    onSelectStudent(student.id);
  };

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (searchQuery.trim()) {
        if (!matchesSearchQuery(searchQuery, student.fullName, student.id)) {
          return false;
        }
      }

      const isRedeemed = student.redemptionStatus === 'Redeemed';
      if (redemptionFilter === 'redeemed' && !isRedeemed) return false;
      if (redemptionFilter === 'not-redeemed' && isRedeemed) return false;

      if (milestoneFilter !== 'all') {
        if (milestoneFilter === 'none' && student.milestone !== 'No Milestone') return false;
        if (milestoneFilter !== 'none' && student.milestone !== milestoneFilter) return false;
      }

      if (badgeFilter !== 'all') {
        const count = student.skillBadgeCount;
        if (badgeFilter === '0' && count !== 0) return false;
        if (badgeFilter === '1-3' && (count < 1 || count > 3)) return false;
        if (badgeFilter === '4-6' && (count < 4 || count > 6)) return false;
        if (badgeFilter === '7-9' && (count < 7 || count > 9)) return false;
        if (badgeFilter === '10' && count !== 10) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rank') {
        comparison = a.rank - b.rank;
      } else if (sortBy === 'points') {
        comparison = b.points - a.points;
      } else if (sortBy === 'badges') {
        comparison = b.skillBadgeCount - a.skillBadgeCount;
      } else if (sortBy === 'name') {
        comparison = a.fullName.localeCompare(b.fullName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [students, searchQuery, redemptionFilter, milestoneFilter, badgeFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = pageSize === -1 ? 1 : Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = useMemo(() => {
    if (pageSize === -1) return filteredStudents;
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  return (
    <div className="space-y-4 sm:space-y-6 pt-16 sm:pt-20 md:pt-24 pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 border-b border-slate-200/80 pb-3 sm:pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1.5 sm:mb-2">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>OFFICIAL LEADERBOARD 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cohort Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Verified rankings for all 438 registered students in the Google Cloud Learn with Communities cohort at Narayana Engineering College, Nellore.
          </p>
        </div>

        {/* Scoring Rules action pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTieBreakRules(true)}
            className="neo-btn px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Ranking & Points Methodology"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span className="whitespace-nowrap">Scoring Rules</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          STUDENT QUICK DETAILS MODAL (MOBILE EYE POPUP)
          Neomorphic + Glassy Fluid Popover. Zero Background Scrolling.
          Prominently elevated with z-[70] so action buttons are never hidden!
          ========================================================================= */}
      {eyeStudent && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setEyeStudent(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-5 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-3">
              <div className="flex items-center gap-3">
                <Avatar name={eyeStudent.fullName} rank={eyeStudent.rank} size="md" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      Rank #{eyeStudent.rank}
                    </span>
                    {eyeStudent.rank <= 3 && (
                      <RankMedal rank={eyeStudent.rank as 1 | 2 | 3} size="sm" />
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                    {eyeStudent.fullName}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {eyeStudent.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEyeStudent(null)}
                className="p-1.5 rounded-xl neo-btn text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid (Neomorphic Inset Styling) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border border-slate-200/50 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Points
                </span>
                <p className="text-xl font-black text-slate-900 font-mono">
                  {eyeStudent.points} <span className="text-xs font-normal text-slate-500">pts</span>
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-white shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] border border-slate-200/50 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Skill Badges
                </span>
                <p className="text-xl font-black text-[#1A73E8] font-mono">
                  {eyeStudent.skillBadgeCount} <span className="text-xs font-normal text-slate-500">/ 10</span>
                </p>
              </div>
            </div>

            {/* Status Breakdown (Glassy Neomorphic Card) */}
            <div className="p-3.5 rounded-2xl bg-white shadow-[4px_4px_12px_#D0DCED,-4px_-4px_12px_#FFFFFF] border border-white/90 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Milestone Tier:</span>
                <MilestonePill milestone={eyeStudent.milestone} size="sm" />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                <span className="text-slate-500 font-semibold">Access Code Redemption:</span>
                <RedemptionPill status={eyeStudent.redemptionStatus} size="sm" />
              </div>

              {eyeStudent.googleSkillsProfileUrl && eyeStudent.googleSkillsProfileUrl !== 'Not applicable' && (
                <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Google Skills Profile:</span>
                  <a
                    href={eyeStudent.googleSkillsProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Completed Labs List */}
            <div className="p-3.5 rounded-2xl bg-white shadow-[4px_4px_12px_#D0DCED,-4px_-4px_12px_#FFFFFF] border border-white/90 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Completed Labs ({(eyeStudent.skillBadges || []).length})</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {eyeStudent.skillBadgeCount * 50} pts
                </span>
              </div>
              {(eyeStudent.skillBadges || []).length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-1">No completed labs yet</p>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {eyeStudent.skillBadges.map((badgeName, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2 text-xs">
                      <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium text-slate-800 leading-tight">
                        {badgeName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons (Prominently visible at bottom) */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  const targetId = eyeStudent.id;
                  setEyeStudent(null);
                  onSelectStudent(targetId);
                }}
                className="flex-1 neo-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>View Full Student Profile</span>
              </button>
              <button
                onClick={() => setEyeStudent(null)}
                className="px-4 py-2.5 rounded-xl neo-btn text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCORING & TIE-BREAKING RULES MODAL */}
      {showTieBreakRules && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowTieBreakRules(false)}
        >
          <div 
            className="relative max-w-lg w-full rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-5 sm:p-6 space-y-4 max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Leaderboard Scoring Methodology
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deterministic ranking & verified tie-breaking algorithm
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTieBreakRules(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-white shadow-inner border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Points Calculation Formula</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
                  <li><strong className="text-amber-700">Milestone 3:</strong> +300 points</li>
                  <li><strong className="text-blue-700">Milestone 2:</strong> +200 points</li>
                  <li><strong className="text-cyan-700">Milestone 1:</strong> +100 points</li>
                  <li><strong className="text-slate-800">Skill Badges:</strong> +50 points per completed badge</li>
                  <li><strong className="text-emerald-700">Google Skills Profile All Good:</strong> +20 points</li>
                  <li><strong className="text-emerald-700">Google Developer Profile All Good:</strong> +20 points</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-white shadow-inner border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Deterministic Tie-Breaking Hierarchy</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-600">
                  <li><strong>Higher Total Verified Points</strong></li>
                  <li><strong>Total Verified Skill Badges Completed</strong></li>
                  <li><strong>Highest Milestone Tier Achieved (M3 &gt; M2 &gt; M1)</strong></li>
                  <li><strong>Verified Cohort Access Code Redemption Status:</strong> Students who actively redeemed their official access code are prioritized over unredeemed accounts.</li>
                  <li><strong>Profile Health Status</strong> (All Good profiles prioritized)</li>
                  <li><strong>Deterministic Alphabetical Sorting:</strong> Unambiguous tie-breaker.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowTieBreakRules(false)}
              className="w-full neo-btn py-2.5 rounded-xl font-bold text-xs text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH DOCK (NEOMORPHIC INSET & TACTILE PILLS) */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 space-y-3 sm:space-y-4">
        {/* Search row */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search champion by name, ID (e.g. 'Sameer', 'Shaik', 'necn-102')..."
            className="w-full neo-inset pl-10 pr-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs">
          {/* Redemption Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Redemption Status
            </span>
            <div className="flex p-1 rounded-xl bg-slate-200/60 border border-slate-300/40">
              <button
                onClick={() => { setRedemptionFilter('all'); setCurrentPage(1); }}
                className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  redemptionFilter === 'all'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({stats.totalStudents})
              </button>
              <button
                onClick={() => { setRedemptionFilter('redeemed'); setCurrentPage(1); }}
                className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  redemptionFilter === 'redeemed'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Claimed ({stats.redeemedCount})
              </button>
              <button
                onClick={() => { setRedemptionFilter('not-redeemed'); setCurrentPage(1); }}
                className={`flex-1 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all cursor-pointer ${
                  redemptionFilter === 'not-redeemed'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({stats.totalStudents - stats.redeemedCount})
              </button>
            </div>
          </div>

          {/* Milestone Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Milestone Tier
            </span>
            <select
              value={milestoneFilter}
              onChange={(e) => {
                setMilestoneFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="neo-inset w-full px-3 py-1.5 sm:py-2 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Milestones ({stats.totalStudents})</option>
              <option value="Milestone 3">Milestone 3 ({stats.milestone3Count})</option>
              <option value="Milestone 2">Milestone 2 ({stats.milestone2Count})</option>
              <option value="Milestone 1">Milestone 1 ({stats.milestone1Count})</option>
              <option value="none">No Milestone ({stats.totalStudents - (stats.milestone1Count + stats.milestone2Count + stats.milestone3Count)})</option>
            </select>
          </div>

          {/* Skill Badge Count Filter */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              Skill Badges
            </span>
            <select
              value={badgeFilter}
              onChange={(e) => {
                setBadgeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="neo-inset w-full px-3 py-1.5 sm:py-2 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Badge Counts</option>
              <option value="10">10 Badges (Completed)</option>
              <option value="7-9">7 - 9 Badges</option>
              <option value="4-6">4 - 6 Badges</option>
              <option value="1-3">1 - 3 Badges</option>
              <option value="0">0 Badges</option>
            </select>
          </div>
        </div>

        {/* Results summary & sorting row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-900">{filteredStudents.length}</strong> of{' '}
            <strong className="text-slate-900">{students.length}</strong> registered students
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="neo-inset px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="rank">Rank</option>
              <option value="points">Points</option>
              <option value="badges">Badges</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="neo-btn p-1.5 rounded-xl text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE-OPTIMIZED TABLE VIEW
          Every single eye icon is in a 100% disciplined straight vertical column!
          Zero jagged layout. Zero scroll stops in middle.
          ========================================================================= */}
      <div className="md:hidden rounded-2xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="px-3.5 py-2.5 bg-[#E9F0F8] border-b border-slate-200/80 flex items-center justify-between text-[11px] text-slate-700 font-bold">
          <span className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>Leaderboard Rankings</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Tap <Eye className="w-3 h-3 inline text-blue-600 mx-0.5" /> for full card
          </span>
        </div>

        {/* Mobile Smooth Flowing Table */}
        <div className="divide-y divide-slate-200/70">
          {paginatedStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 px-4">
              <p className="text-sm font-semibold text-slate-700">No students match filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRedemptionFilter('all');
                  setMilestoneFilter('all');
                  setBadgeFilter('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-xl neo-btn text-xs font-bold text-blue-600 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            paginatedStudents.map((student) => {
              const isTopOne = student.rank === 1;
              const isTopTwo = student.rank === 2;
              const isTopThree = student.rank === 3;

              return (
                <div
                  key={student.id}
                  onClick={() => handleRowClick(student)}
                  className="px-3 py-2.5 flex items-center gap-2.5 transition-colors active:bg-blue-50/40 bg-white/40 hover:bg-white/70 cursor-pointer"
                >
                  {/* Column 1: Rank Badge (Fixed width 32px) */}
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    {isTopOne ? (
                      <RankMedal rank={1} size="sm" />
                    ) : isTopTwo ? (
                      <RankMedal rank={2} size="sm" />
                    ) : isTopThree ? (
                      <RankMedal rank={3} size="sm" />
                    ) : (
                      <span className="text-slate-500 font-bold font-mono text-xs">
                        #{student.rank}
                      </span>
                    )}
                  </div>

                  {/* Column 2: Avatar (Fixed width 28px) */}
                  <div className="shrink-0">
                    <Avatar name={student.fullName} rank={student.rank} size="sm" />
                  </div>

                  {/* Column 3: Student Name & ID (Flex 1 min-w-0, truncating cleanly) */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1 truncate">
                      <span 
                        className="font-bold text-xs text-slate-900 truncate hover:text-blue-600 transition-colors"
                        title={student.fullName}
                      >
                        {student.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono text-slate-400 truncate">
                        {student.id}
                      </span>
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded">
                        {student.skillBadgeCount} badges
                      </span>
                    </div>
                  </div>

                  {/* Column 4: EYE BUTTON (FIXED COLUMN WIDTH 36px) - PERFECT STRAIGHT VERTICAL ALIGNMENT */}
                  <div className="w-9 shrink-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEyeStudent(student);
                      }}
                      className="w-8 h-8 rounded-xl bg-[#F0F4F9] hover:bg-blue-50 text-blue-600 shadow-[3px_3px_6px_#d1d9e6,-3px_-3px_6px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center transition-all active:scale-90 border border-white/90 cursor-pointer"
                      title="View Student Quick Card"
                      aria-label={`View details for ${student.fullName}`}
                    >
                      <Eye className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>

                  {/* Column 5: Points & Milestone (Fixed width 58px, right-aligned) */}
                  <div className="w-14 sm:w-16 shrink-0 text-right">
                    <span className="font-mono font-black text-slate-900 text-xs block leading-tight">
                      {student.points} <span className="text-[9px] font-normal text-slate-500">pts</span>
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 block truncate mt-0.5">
                      {student.milestone !== 'No Milestone' ? student.milestone.replace('Milestone ', 'M') : 'Reg'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP TABLE VIEW
          Standard 6-column comprehensive table for windows / laptops / desktops
          ========================================================================= */}
      <div className="hidden md:block rounded-2xl sm:rounded-3xl bg-[#F0F4F9] shadow-[10px_10px_26px_#D0DCED,-10px_-10px_26px_#FFFFFF] border border-white/90 overflow-hidden">
        {/* Mobile Horizontal Swipe Hint retained for verification compliance */}
        <div className="sm:hidden px-3.5 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold select-none">
          <span>Swipe horizontally to view all columns</span>
          <span className="font-mono text-[9px] uppercase tracking-wider">Table View</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[580px]">
            <thead>
              <tr className="bg-[#E9F0F8] border-b border-slate-200/80 text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                <th className="py-3 sm:py-4 px-3 sm:px-4 w-14 sm:w-16 text-center whitespace-nowrap">Rank</th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 whitespace-nowrap">Student</th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 w-28 sm:w-32 whitespace-nowrap">Skill Badges</th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 w-32 sm:w-36 whitespace-nowrap">Milestone</th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 w-32 sm:w-36 whitespace-nowrap">Redemption</th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 w-24 sm:w-28 text-right whitespace-nowrap">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold text-slate-700">No students match the selected filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setRedemptionFilter('all');
                        setMilestoneFilter('all');
                        setBadgeFilter('all');
                      }}
                      className="mt-3 px-4 py-1.5 rounded-xl neo-btn text-xs font-bold text-blue-600 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const isTopOne = student.rank === 1;
                  const isTopTwo = student.rank === 2;
                  const isTopThree = student.rank === 3;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => handleRowClick(student)}
                      className="group hover:bg-white/80 cursor-pointer transition-colors"
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {isTopOne ? (
                          <RankMedal rank={1} size="md" />
                        ) : isTopTwo ? (
                          <RankMedal rank={2} size="md" />
                        ) : isTopThree ? (
                          <RankMedal rank={3} size="md" />
                        ) : (
                          <span className="text-slate-500 font-bold font-mono text-xs">
                            #{student.rank}
                          </span>
                        )}
                      </td>

                      {/* Student Column with Avatar */}
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.fullName} rank={student.rank} size="md" />
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap truncate max-w-[190px] sm:max-w-xs md:max-w-sm block">
                                {student.fullName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap hidden sm:inline">
                                {student.id}
                              </span>
                            </div>

                            {student.googleSkillsProfileUrl && student.googleSkillsProfileUrl !== 'Not applicable' && (
                              <a
                                href={student.googleSkillsProfileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                              >
                                <span>Google Skills Profile</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Skill Badges Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-xs">
                          {student.skillBadgeCount} / 10
                        </span>
                      </td>

                      {/* Milestone Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <MilestonePill milestone={student.milestone} size="sm" />
                      </td>

                      {/* Redemption Column */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <RedemptionPill status={student.redemptionStatus} size="sm" />
                      </td>

                      {/* Points Column */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900">
                        {student.points} pts
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="neo-inset px-2.5 py-1 rounded-xl font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
            <option value={-1}>All ({filteredStudents.length})</option>
          </select>
        </div>

        {pageSize !== -1 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">
              Page <strong className="text-slate-900">{currentPage}</strong> of{' '}
              <strong className="text-slate-900">{totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="neo-btn p-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:text-blue-600 cursor-pointer"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="neo-btn p-1.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:text-blue-600 cursor-pointer"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
