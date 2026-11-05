import React, { useState } from 'react';
import type { Student, OfficialCourse } from '../types';
import { Avatar } from '../components/common/Avatar';
import { MilestonePill, RedemptionPill, CourseStatusPill } from '../components/common/BadgePill';
import { ProgressRing } from '../components/common/ProgressRing';
import { RankMedal } from '../components/common/RankMedal';
import { 
  ArrowLeft, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  Send,
  Compass,
  Check,
  ShieldCheck,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { adminAuth } from '../services/adminAuth';

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
  isAdmin = false
}) => {
  // Identity verification state
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (isAdmin || adminAuth.isAuthenticated()) return true;
    try {
      return sessionStorage.getItem(`necn_verified_student_${student.id}`) === 'true';
    } catch {
      return false;
    }
  });

  const [verifyEmailInput, setVerifyEmailInput] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Self-submission modal state
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedCourseForSubmit, setSelectedCourseForSubmit] = useState<OfficialCourse>(officialCourses[0]);
  const [proofUrl, setProofUrl] = useState(student.googleSkillsProfileUrl || '');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Status counts
  const completedCoursesCount = student.courseProgress.filter(c => c.status === 'Completed').length;
  const badgePercentage = Math.round((student.skillBadgeCount / 10) * 100);

  // Achievement level title based on points and badges
  const getAchievementTitle = (s: Student) => {
    if (s.skillBadgeCount >= 10 || s.milestone === 'Milestone 3') return 'Google Cloud Architect';
    if (s.skillBadgeCount >= 6 || s.milestone === 'Milestone 2') return 'Cloud Specialist';
    if (s.skillBadgeCount >= 2 || s.milestone === 'Milestone 1') return 'Cloud Practitioner';
    if (s.redemptionStatus === 'Redeemed') return 'Cloud Explorer';
    return 'Registered Learner';
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    const ok = storageService.verifyStudentEmail(student.id, verifyEmailInput);
    if (ok) {
      setVerifySuccess(true);
      try {
        sessionStorage.setItem(`necn_verified_student_${student.id}`, 'true');
      } catch (err) {
        console.warn('sessionStorage error', err);
      }

      setTimeout(() => {
        setIsVerified(true);
        setVerifySuccess(false);
      }, 600);
    } else {
      setVerifyError('Email address does not match this student\'s registration. Please enter the email you registered with GDG On Campus.');
    }
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

  // IF NOT VERIFIED: DISPLAY APPLE-GRADE IDENTITY VERIFICATION SCREEN
  if (!isVerified) {
    return (
      <div className="pt-24 pb-16 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#F0F4F9] rounded-3xl border border-white/95 shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          {/* Back button */}
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Leaderboard</span>
            </button>
          </div>

          {/* Student Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <Avatar name={student.fullName} rank={student.rank} size="xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Lock className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Protected Student Profile</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {student.fullName}
              </h2>
              <div className="flex items-center justify-center gap-2 pt-1">
                {student.rank <= 3 ? (
                  <RankMedal rank={student.rank as 1 | 2 | 3} size="sm" />
                ) : (
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    Rank #{student.rank}
                  </span>
                )}
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-mono">
                  {student.id}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 shadow-inner border border-slate-200/60 text-xs text-slate-600 leading-relaxed text-center">
            To protect student privacy and comply with security requirements, please verify identity by entering the <strong>registered email address</strong> for this profile.
          </div>

          {/* Verification Form */}
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                autoFocus
                placeholder="e.g. student@gmail.com"
                value={verifyEmailInput}
                onChange={(e) => {
                  setVerifyEmailInput(e.target.value);
                  setVerifyError('');
                }}
                className="w-full neo-inset px-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifySuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Identity verified! Loading profile...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifySuccess}
              className="w-full neo-btn-primary py-3 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all"
            >
              Verify & Unlock Profile
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            GDG On Campus • Narayana Engineering College, Nellore
          </p>
        </div>
      </div>
    );
  }

  // ONCE VERIFIED: FULL STUDENT PROFILE
  return (
    <div className="space-y-6 pt-20 sm:pt-24">
      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Identity Verified</span>
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
                  {student.googleSkillsProfileUrl && student.googleSkillsProfileUrl !== 'Not applicable' ? (
                    <a
                      href={student.googleSkillsProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                    >
                      <span>Google Skills Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-400">Skills Profile: Not linked</span>
                  )}

                  {student.googleDeveloperProfileUrl && student.googleDeveloperProfileUrl !== 'Not applicable' && (
                    <a
                      href={student.googleDeveloperProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium"
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

      {/* METRICS BENTO GRID (GLASS FLUID CARDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Skill Badges */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            Skill Badges
          </span>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {student.skillBadgeCount} <span className="text-sm font-normal text-slate-400">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {student.skillBadgeCount * 50} pts earned from labs
          </p>
        </div>

        {/* Metric 2: Milestone Status */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            Current Milestone
          </span>
          <div className="text-lg font-bold text-slate-900">
            {student.milestone}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {student.milestone === 'Milestone 3'
              ? 'Highest Tier (+300 pts)'
              : student.milestone === 'Milestone 2'
              ? 'Intermediate (+200 pts)'
              : student.milestone === 'Milestone 1'
              ? 'Foundational (+100 pts)'
              : 'Progression in progress'}
          </p>
        </div>

        {/* Metric 3: Redemption Status */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            Access Code
          </span>
          <div className="text-lg font-bold text-slate-900">
            {student.redemptionStatus}
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {student.redemptionStatus === 'Redeemed'
              ? 'Verified & Activated'
              : 'Pending Code Activation'}
          </p>
        </div>

        {/* Metric 4: GEAR Digital Badges */}
        <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/90 space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
            GEAR Digital Badges
          </span>
          <div className="text-xl font-black text-indigo-600 font-mono">
            {student.gearBadges && student.gearBadges !== 'Not applicable' ? student.gearBadges : '0'}
          </div>
          <p className="text-[11px] text-slate-500">
            Community Recognized
          </p>
        </div>
      </div>

      {/* COMPLETED SKILL BADGES GALLERY (GLASS FLUID CARD) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,43,112,0.06),6px_6px_18px_#D0DCED,-6px_-6px_18px_#FFFFFF] border border-white/95 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Verified Skill Badges Earned ({(student.skillBadges || []).length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Source: Official CSV Records
          </span>
        </div>

        {(student.skillBadges || []).length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-1">
            <p className="text-sm font-semibold">No skill badges earned yet.</p>
            <p className="text-xs text-slate-500">
              Complete labs on Google Cloud Skills Boost to earn badges and climb the cohort leaderboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(student.skillBadges || []).map((badgeName, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/70 border border-white shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  ★
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate" title={badgeName}>
                    {badgeName}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Verified +50 pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 10 OFFICIAL COURSES PROGRESS TRACKER (GLASS FLUID CARD) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,43,112,0.06),6px_6px_18px_#D0DCED,-6px_-6px_18px_#FFFFFF] border border-white/95 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                Official 10-Course Curriculum Tracking
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Individual lab progress is validated through administrator updates and student proof submissions.
            </p>
          </div>

          <button
            onClick={() => setSubmissionModalOpen(true)}
            className="neo-btn-primary px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 self-start sm:self-auto shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Course Proof</span>
          </button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {student.courseProgress.map((cp) => {
              const course = officialCourses.find(c => c.id === cp.courseId) || {
                id: cp.courseId,
                title: `Google Cloud Course ${cp.courseId}`,
                officialUrl: 'https://www.skills.google',
                courseTemplateId: 0
              };

              return (
                <div
                  key={cp.courseId}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between gap-3 hover:bg-slate-100/70 transition-all shadow-2xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                        Course #{cp.courseId}
                      </span>
                      <CourseStatusPill status={cp.status} />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <a
                      href={course.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      <span>Google Skills Course</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {cp.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">
                        {cp.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* STUDENT PROGRESS SUBMISSION MODAL */}
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
                className="text-slate-400 hover:text-slate-700 text-sm p-1 rounded-lg hover:bg-white"
              >
                ✕
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
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-sm"
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
