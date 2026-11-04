import React, { useState, useMemo } from 'react';
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
  Lock, 
  Unlock, 
  CheckCircle, 
  AlertCircle,
  Info,
  ShieldCheck,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { adminAuth } from '../services/adminAuth';

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

  // Student Email Verification Gate
  const [authTargetStudent, setAuthTargetStudent] = useState<Student | null>(null);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifiedStudentIds, setVerifiedStudentIds] = useState<string[]>(() => {
    try {
      return JSON.parse(sessionStorage.getItem('necn_verified_students') || '[]');
    } catch {
      return [];
    }
  });

  const isStudentVerified = (studentId: string) => {
    if (adminAuth.isAuthenticated()) return true;
    return verifiedStudentIds.includes(studentId);
  };

  const handleRowClick = (student: Student) => {
    if (isStudentVerified(student.id)) {
      onSelectStudent(student.id);
    } else {
      setAuthTargetStudent(student);
      setVerificationEmail('');
      setAuthError('');
    }
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authTargetStudent) return;

    const isValid = storageService.verifyStudentEmail(authTargetStudent.id, verificationEmail);
    if (isValid) {
      const updated = [...verifiedStudentIds, authTargetStudent.id];
      setVerifiedStudentIds(updated);
      try {
        sessionStorage.setItem('necn_verified_students', JSON.stringify(updated));
      } catch {}
      const targetId = authTargetStudent.id;
      setAuthTargetStudent(null);
      onSelectStudent(targetId);
    } else {
      setAuthError('The entered email does not match this student\'s registration record.');
    }
  };

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = student.fullName.toLowerCase().includes(query);
        const idMatch = student.id.toLowerCase().includes(query);
        if (!nameMatch && !idMatch) return false;
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
    <div className="space-y-6 pt-20 sm:pt-24">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
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
            className="neo-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="Ranking & Points Methodology"
          >
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span className="whitespace-nowrap">Scoring Rules</span>
          </button>
        </div>
      </div>

      {/* STUDENT EMAIL AUTHENTICATION MODAL */}
      {authTargetStudent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setAuthTargetStudent(null)}
        >
          <div 
            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-slate-900">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Student Profile Verification
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Confirm identity to view achievement details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAuthTargetStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-white shadow-inner border border-slate-200/80 flex items-center gap-3">
              <Avatar name={authTargetStudent.fullName} rank={authTargetStudent.rank} size="md" />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {authTargetStudent.fullName}
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Rank #{authTargetStudent.rank} • {authTargetStudent.skillBadgeCount} Badges
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address:
                </label>
                <input
                  type="email"
                  value={verificationEmail}
                  onChange={(e) => {
                    setVerificationEmail(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="e.g. name@example.com"
                  className="w-full neo-inset px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  required
                />
              </div>

              {authError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 neo-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Verify & Unlock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthTargetStudent(null)}
                  className="px-4 py-2.5 rounded-xl neo-btn text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </form>
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
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
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
              className="w-full neo-btn py-2.5 rounded-xl font-bold text-xs text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH DOCK (NEOMORPHIC INSET & TACTILE PILLS) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F4F9] shadow-[8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/90 space-y-4">
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
            placeholder="Search students by full name or ID..."
            className="w-full neo-inset pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Redemption Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Redemption:
            </span>
            {(['all', 'redeemed', 'not-redeemed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setRedemptionFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  redemptionFilter === status
                    ? 'neo-pressed text-blue-700 font-bold'
                    : 'neo-pill text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'all' ? 'All (438)' : status === 'redeemed' ? `Redeemed (${stats.redeemedCount})` : `Pending (${stats.notRedeemedCount})`}
              </button>
            ))}
          </div>

          {/* Milestone Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
              Milestone:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'Milestone 3', label: `M3 (${stats.milestone3Count})` },
              { id: 'Milestone 2', label: `M2 (${stats.milestone2Count})` },
              { id: 'Milestone 1', label: `M1 (${stats.milestone1Count})` },
              { id: 'none', label: 'None' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setMilestoneFilter(m.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  milestoneFilter === m.id
                    ? 'neo-pressed text-blue-700 font-bold'
                    : 'neo-pill text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="neo-inset px-3 py-1.5 rounded-xl text-xs text-slate-700 focus:outline-none"
            >
              <option value="rank">Rank</option>
              <option value="points">Points</option>
              <option value="badges">Badges</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              className="neo-btn p-1.5 rounded-xl text-slate-600 hover:text-slate-900"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LEADERBOARD TABLE (PERFECTLY FITTABLE ACROSS LAPTOPS, TABLETS, DESKTOPS, MOBILES)
          ========================================================================= */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#F0F4F9] shadow-[10px_10px_26px_#D0DCED,-10px_-10px_26px_#FFFFFF] border border-white/90 overflow-hidden">
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden px-3.5 py-1.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-[10px] text-blue-700 font-semibold select-none">
          <span>↔ Swipe horizontally to view all columns</span>
          <span className="font-mono text-[9px] uppercase tracking-wider">Table View</span>
        </div>

        <div className="overflow-x-auto touch-pan-x">
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
                      className="mt-3 px-4 py-1.5 rounded-xl neo-btn text-xs font-bold text-blue-600"
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
                  const isAuth = isStudentVerified(student.id);

                  return (
                    <tr
                      key={student.id}
                      onClick={() => handleRowClick(student)}
                      className="group hover:bg-white/80 cursor-pointer transition-colors"
                    >
                      {/* Rank Column - Numbers in Medals Itself */}
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
                              {!isAuth && (
                                <Lock className="w-3 h-3 text-slate-400 shrink-0" title="Email verification required to view profile" />
                              )}
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
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {student.points} <span className="text-[10px] font-medium text-slate-500">pts</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="p-3.5 rounded-2xl bg-[#F0F4F9] shadow-[6px_6px_16px_#D0DCED,-6px_-6px_16px_#FFFFFF] border border-white/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Page <strong className="text-slate-900 font-bold">{currentPage}</strong> of <strong className="text-slate-900 font-bold">{totalPages}</strong> ({filteredStudents.length} results)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl neo-btn text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl neo-btn text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
