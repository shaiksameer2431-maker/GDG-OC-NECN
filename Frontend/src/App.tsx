import React, { useState, useEffect, useCallback } from 'react';
import type { Student, OfficialCourse, CohortStats } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OverviewPage } from './pages/OverviewPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { LearningJourneyPage } from './pages/LearningJourneyPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // App Data state
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [officialCourses] = useState<OfficialCourse[]>(() => storageService.getOfficialCourses());
  const [stats, setStats] = useState<CohortStats>(() => storageService.getCohortStats());

  // Refresh callback
  const refreshData = useCallback(() => {
    setStudents(storageService.getStudents());
    setStats(storageService.getCohortStats());
  }, []);

  // Hash-based routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentTab('overview');
        setSelectedStudentId(null);
        return;
      }

      if (hash.startsWith('students/')) {
        const id = hash.replace('students/', '');
        setSelectedStudentId(id);
        setCurrentTab('students');
      } else {
        setCurrentTab(hash);
        setSelectedStudentId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Secret shortcut for Admin: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo(currentTab === 'admin' ? 'overview' : 'admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab]);

  const navigateTo = (tab: string, studentId?: string) => {
    if (tab === 'students' && studentId) {
      setSelectedStudentId(studentId);
      setCurrentTab('students');
      window.location.hash = `students/${studentId}`;
    } else {
      setSelectedStudentId(null);
      setCurrentTab(tab);
      window.location.hash = tab;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedStudent = selectedStudentId
    ? students.find(s => s.id === selectedStudentId)
    : undefined;

  const isAdminTab = currentTab === 'admin' || currentTab === 'admin-portal';

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-blue-500/20 selection:text-blue-700 antialiased font-sans">
      {/* SOFT AMBIENT LIGHTING MESH (White Mode Apple depth) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-center soft blue glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-blue-100/60 blur-[120px] rounded-full" />
        {/* Top-right soft amber glow */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[400px] bg-amber-100/40 blur-[130px] rounded-full" />
        {/* Bottom-left soft emerald glow */}
        <div className="absolute bottom-20 left-[-10%] w-[550px] h-[400px] bg-emerald-100/40 blur-[130px] rounded-full" />
      </div>

      {/* FLOATING GLASS NAVBAR (Hidden when in dedicated Admin Mode for clean separation) */}
      {!isAdminTab && (
        <Navbar
          currentTab={currentTab}
          onTabChange={(tab) => navigateTo(tab)}
          stats={stats}
        />
      )}

      {/* MAIN CONTAINER */}
      <main className="relative z-10 flex-grow max-w-6xl xl:max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 pb-16">
        <ErrorBoundary>
          {currentTab === 'overview' && (
            <OverviewPage
              stats={stats}
              topStudents={students}
              onNavigate={navigateTo}
            />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardPage
              students={students}
              stats={stats}
              onSelectStudent={(id) => navigateTo('students', id)}
            />
          )}

          {currentTab === 'students' && (
            selectedStudent ? (
              <StudentProfilePage
                student={selectedStudent}
                officialCourses={officialCourses}
                onBack={() => navigateTo('leaderboard')}
              />
            ) : (
              <div className="pt-32 text-center space-y-4">
                <p className="text-slate-500 text-sm">Student profile not found.</p>
                <button
                  onClick={() => navigateTo('leaderboard')}
                  className="apple-pill-btn bg-blue-600 text-xs font-bold text-white shadow-sm"
                >
                  Return to Leaderboard
                </button>
              </div>
            )
          )}

          {currentTab === 'journey' && (
            <LearningJourneyPage
              officialCourses={officialCourses}
              students={students}
              onSelectStudent={(id) => navigateTo('students', id)}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsPage
              stats={stats}
              students={students}
              officialCourses={officialCourses}
              onSelectStudent={(id) => navigateTo('students', id)}
            />
          )}

          {isAdminTab && (
            <AdminDashboardPage
              students={students}
              officialCourses={officialCourses}
              stats={stats}
              onRefreshData={refreshData}
              onSelectStudent={(id) => navigateTo('students', id)}
              onBackToPublic={() => navigateTo('overview')}
            />
          )}

          {currentTab === 'about' && (
            <AboutPage />
          )}
        </ErrorBoundary>
      </main>

      {/* FOOTER */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;
