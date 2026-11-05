import React, { useState } from 'react';
import type { OfficialCourse, Student } from '../types';
import { CourseStatusPill } from '../components/common/BadgePill';
import { 
  Compass, 
  ExternalLink, 
  Search, 
  User, 
  CheckCircle2, 
  Send, 
  Award,
  Sparkles,
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface LearningJourneyPageProps {
  officialCourses: OfficialCourse[];
  students: Student[];
  onSelectStudent: (studentId: string) => void;
}

export const LearningJourneyPage: React.FC<LearningJourneyPageProps> = ({
  officialCourses,
  students,
  onSelectStudent
}) => {
  // Student lookup state
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentSearchInput, setStudentSearchInput] = useState('');
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionCourseId, setSubmissionCourseId] = useState<number>(1);
  const [proofUrl, setProofUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Student search matches
  const matchedStudents = studentSearchInput.trim()
    ? students.filter(s => s.fullName.toLowerCase().includes(studentSearchInput.toLowerCase())).slice(0, 5)
    : [];

  const handleStudentSelect = (s: Student) => {
    setSelectedStudentId(s.id);
    setStudentSearchInput('');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !proofUrl) return;

    storageService.submitStudentCourseVerification(
      selectedStudent.id,
      submissionCourseId,
      proofUrl,
      submissionNotes
    );

    setSubmissionSuccess(true);
    setTimeout(() => {
      setSubmissionSuccess(false);
      setShowSubmissionModal(false);
      setProofUrl('');
      setSubmissionNotes('');
    }, 1500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pt-16 sm:pt-20 md:pt-24 pb-12">
      {/* HEADER */}
      <div className="border-b border-slate-200/80 pb-4 sm:pb-5 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>OFFICIAL 10-COURSE CURRICULUM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Google Cloud Learning Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          The verified 10-course syllabus for the Google Cloud Learn with Communities 2026 program at Narayana Engineering College, Nellore. Complete hands-on labs and earn industry credentials directly from Google.
        </p>
      </div>

      {/* STUDENT LOOKUP / PERSONALIZED TRACKER BOX (GLASS FLUID FINISH) */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(20,43,112,0.06),6px_6px_18px_#D0DCED,-6px_-6px_18px_#FFFFFF] border border-white/95 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Personalized Student Progress Viewer
            </h2>
          </div>
          {selectedStudent && (
            <button
              onClick={() => setSelectedStudentId('')}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
            >
              Clear Selected Student
            </button>
          )}
        </div>

        {/* Search input with live suggestion pills */}
        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={studentSearchInput}
              onChange={(e) => setStudentSearchInput(e.target.value)}
              placeholder="Search your name to view individual course status..."
              className="w-full neo-inset pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {matchedStudents.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[12px_12px_28px_#CAD7E8,-12px_-12px_28px_#FFFFFF] border border-white/95 p-2 space-y-1">
              {matchedStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleStudentSelect(s)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/70 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
                >
                  <span>{s.fullName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Rank #{s.rank}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Student Banner */}
        {selectedStudent && (
          <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-xs border border-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 font-mono">
                Active Student Tracker
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                {selectedStudent.fullName}
              </h3>
              <p className="text-xs text-slate-500">
                {selectedStudent.skillBadgeCount} Badges Earned • {selectedStudent.points} Points • {selectedStudent.milestone}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowSubmissionModal(true)}
                className="neo-btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Course Proof</span>
              </button>

              <button
                onClick={() => onSelectStudent(selectedStudent.id)}
                className="neo-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 active:scale-95 transition-all shadow-xs"
              >
                View Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CURRICULUM NOTICE (GLASS FLUID CALLOUT) */}
      <div className="p-4 rounded-2xl bg-white/75 backdrop-blur-lg border border-blue-200/70 text-xs text-slate-700 flex items-start gap-3 shadow-[0_4px_16px_rgba(26,115,232,0.06)]">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 font-bold">Curriculum Tracking Policy:</strong> The source CSV contains verified skill badge credentials and milestone achievements. Individual module statuses for newly registered students are initialized as <strong>"Not Tracked"</strong>. Students can submit laboratory completion verification links below for administrator certification.
        </p>
      </div>

      {/* THE 10 OFFICIAL COURSES GRID (GLASS FLUID FINISH) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Official Course Modules (1 to 10)
          </h2>
          <span className="text-xs text-slate-500 font-mono font-semibold">
            10 Modules Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialCourses.map((course) => {
            const studentProgress = selectedStudent?.courseProgress.find(c => c.courseId === course.id);
            const status = studentProgress?.status || 'Not Tracked';
            const earnersCount = students.filter(s => s.skillBadges.some(b => b.includes(course.badgeName) || course.badgeName.includes(b))).length;

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_rgba(20,43,112,0.05),4px_4px_14px_#D0DCED,-4px_-4px_14px_#FFFFFF] border border-white/95 group hover:-translate-y-0.5 transition-all duration-300 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl neo-inset text-blue-700 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                      {course.courseNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {course.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-600 bg-white/90 px-2.5 py-1 rounded-lg shrink-0 border border-slate-200/80 font-medium shadow-2xs">
                    {course.estimatedHours}
                  </span>
                </div>

                {/* Cohort Stats for this Course */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Cohort Earners: <strong className="text-slate-900 font-bold">{earnersCount}</strong> students</span>
                  </div>

                  {selectedStudent && (
                    <div>
                      <CourseStatusPill status={status} />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Start on Google Skills</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {selectedStudent && (
                    <button
                      onClick={() => {
                        setSubmissionCourseId(course.id);
                        setShowSubmissionModal(true);
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1"
                    >
                      <span>Submit Proof</span>
                      <Send className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* COURSE PROOF SUBMISSION MODAL */}
      {showSubmissionModal && selectedStudent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSubmissionModal(false)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F0F4F9] shadow-[16px_16px_36px_#CAD7E8,-16px_-16px_36px_#FFFFFF] border border-white/95 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Submit Course Completion Proof
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submitting verification for: <strong className="text-slate-800">{selectedStudent.fullName}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerificationSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selected Course Module:
                </label>
                <select
                  value={submissionCourseId}
                  onChange={(e) => setSubmissionCourseId(Number(e.target.value))}
                  className="w-full neo-inset px-3.5 py-2.5 rounded-xl text-xs text-slate-900 focus:outline-none"
                >
                  {officialCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.courseNumber}. {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Public Proof URL (Google Skills Profile or Badge URL):
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.cloudskillsboost.google/public_profiles/..."
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full neo-inset px-3.5 py-2.5 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Notes / Verification Comments (Optional):
                </label>
                <textarea
                  rows={2}
                  placeholder="Any details to help administrators confirm lab completion..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className="w-full neo-inset px-3.5 py-2 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {submissionSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Proof submitted successfully! Administrator verification pending.</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submissionSuccess}
                  className="flex-1 neo-btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Verification</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmissionModal(false)}
                  className="px-4 py-2.5 rounded-xl neo-btn text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
