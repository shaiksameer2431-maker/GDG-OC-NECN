import React, { useState } from 'react';
import type { Student, OfficialCourse } from '../types';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill, RedemptionPill, CourseStatusPill } from '../components/common/BadgePill';
import { ProgressRing } from '../components/common/ProgressRing';
import { 
  ArrowLeft, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  Send,
  Compass,
  Check,
  Sparkles,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface StudentProfilePageProps {
  student: Student;
  officialCourses: OfficialCourse[];
  onBack: () => void;
  isAdmin?: boolean;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({
  student,
  officialCourses,
  onBack,
}) => {
  // Self-submission modal state
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedCourseForSubmit, setSelectedCourseForSubmit] = useState<OfficialCourse>(officialCourses[0]);
  const [proofUrl, setProofUrl] = useState(student.googleSkillsProfileUrl || '');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Status counts
  const badgePercentage = Math.round((student.skillBadgeCount / 10) * 100);

  // Achievement level title based on points and badges
  const getAchievementTitle = (s: Student) => {
    if (s.skillBadgeCount >= 10 || s.milestone === 'Milestone 3') return 'Google Cloud Architect';
    if (s.skillBadgeCount >= 6 || s.milestone === 'Milestone 2') return 'Cloud Specialist';
    if (s.skillBadgeCount >= 2 || s.milestone === 'Milestone 1') return 'Cloud Practitioner';
    if (s.redemptionStatus === 'Redeemed') return 'Cloud Explorer';
    return 'Registered Learner';
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) return;

    storageService.submitStudentCourseVerification(
      student.id,
      selectedCourseForSubmit.id,
      proofUrl,
      submissionNotes
    );

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setSubmissionModalOpen(false);
    }, 1500);
  };

  const completedBadges = student.skillBadges || [];

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

      {/* PROFILE HEADER HERO (GLASS FLUID CARD) */}
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

              {/* Profile Links */}
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

          {/* Overall points and progress ring */}
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
              color="#0071E3"
              backgroundColor="#E2E8F0"
              showLabel={true}
              subLabel="Badges"
            />
          </div>
        </div>
      </div>

      {/* COMPLETED LABS & SKILL BADGES GALLERY */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,43,112,0.06),8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/95 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Completed Labs & Skill Badges ({completedBadges.length})
              </h2>
              <p className="text-xs text-slate-500">
                Official Google Cloud Skills Boost lab completions verified from records
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold self-start sm:self-auto">
            +{completedBadges.length * 50} pts earned
          </span>
        </div>

        {completedBadges.length === 0 ? (
          <div className="py-10 text-center text-slate-400 space-y-1 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-600">No skill badges or labs completed yet.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Complete labs on Google Cloud Skills Boost to earn badges and climb the cohort leaderboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {completedBadges.map((badgeName, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">
                      Lab #{idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                      <span>+50 pts</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words">
                    {badgeName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CURRICULUM SYLLABUS & MILESTONE TRACKING */}
      <div className="rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_10px_32px_rgba(20,43,112,0.06),8px_8px_20px_#D0DCED,-8px_-8px_20px_#FFFFFF] border border-white/95 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Official Google Cloud Pathway ({officialCourses.length} Courses)
              </h2>
              <p className="text-xs text-slate-500">
                Foundational cloud modules and skill tracks prescribed for the cohort
              </p>
            </div>
          </div>

          <button
            onClick={() => setSubmissionModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Verification Proof</span>
          </button>
        </div>

        {/* Grid of Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {officialCourses.map((course) => {
            const progress = student.courseProgress.find(p => p.courseId === course.id);
            const status = progress ? progress.status : 'Not Started';

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 hover:border-blue-300 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                      Course #{course.id} • {course.estimatedHours} hrs
                    </span>
                    <CourseStatusPill status={status} size="sm" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-mono text-[10px]">
                    Badge Points: +50 pts
                  </span>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-xs"
                  >
                    <span>Open in Skills Boost</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VERIFICATION SUBMISSION MODAL */}
      {submissionModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSubmissionModalOpen(false)}
        >
          <div 
            className="max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Submit Course Completion Proof
                </h3>
              </div>
              <button
                onClick={() => setSubmissionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-lg hover:bg-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Proof Submitted Successfully!</h4>
                <p className="text-xs text-slate-500">
                  The GDG On Campus NECN admin team will review and verify your submission shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Course</label>
                  <select
                    value={selectedCourseForSubmit.id}
                    onChange={(e) => {
                      const found = officialCourses.find(c => c.id === Number(e.target.value));
                      if (found) setSelectedCourseForSubmit(found);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    {officialCourses.map(c => (
                      <option key={c.id} value={c.id}>
                        Course #{c.id}: {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Proof URL (Skills Profile or Badge Link) *
                  </label>
                  <input
                    type="url"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://www.skills.google/public_profiles/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Notes or Verification Comments (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="e.g. Completed on Nov 4th lab session..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSubmissionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm cursor-pointer"
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
