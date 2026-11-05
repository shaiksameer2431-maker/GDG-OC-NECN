import React, { useState, useEffect, useCallback } from 'react';
import type { Student, OfficialCourse, CohortStats } from './types';
import { storageService } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
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
  const isPosterHome = currentTab === 'overview';

  return (
    <div className="relative min-h-screen bg-[#F4F8FD] text-slate-900 flex flex-col antialiased font-sans selection:bg-blue-500/20 selection:text-blue-700">
      
      {/* FLOATING NAVBAR (Untouched Windows / Desktop version) */}
      {!isAdminTab && !isPosterHome && (
        <Navbar
          currentTab={currentTab}
          onTabChange={(tab) => navigateTo(tab)}
          stats={stats}
        />
      )}

      {/* Back to Poster Floating Button on Desktop when viewing sub-pages */}
      {!isPosterHome && !isAdminTab && (
        <div className="fixed top-4 left-4 z-40 hidden md:block">
          <button
            onClick={() => navigateTo('overview')}
            className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md text-xs font-bold text-slate-700 hover:text-blue-600 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>←</span>
            <span>Return to Poster</span>
          </button>
        </div>
      )}

      {/* MAIN CONTAINER (Fluid scaling across mobile and desktop) */}
      <main className={`relative z-10 flex-grow w-full max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 ${isPosterHome ? 'p-0 pb-20 md:pb-0' : 'pb-24 md:pb-16 pt-6 md:pt-24'}`}>
        <ErrorBoundary>
          {isPosterHome && (
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

      {/* FOOTER (Shown on sub-pages on desktop) */}
      {!isPosterHome && <Footer onNavigate={navigateTo} />}

      {/* MOBILE BOTTOM NAVIGATION DOCK (Persistent on mobile with overview, leaderboard, journey, achievements, about) */}
      {!isAdminTab && (
        <MobileBottomNav
          currentTab={currentTab}
          onTabChange={(tab) => navigateTo(tab)}
        />
      )}
    </div>
  );
}

export default App;