import React, { useState, useMemo } from 'react';
import type { Student, OfficialCourse, ImportLog, AdminVaultRecord, CohortStats } from '../types';
import { adminAuth } from '../services/adminAuth';
import type { AdminSession } from '../services/adminAuth';
import { storageService } from '../services/storageService';
import { matchesSearchQuery } from '../utils/searchHelper';
import { MilestonePill, RedemptionPill } from '../components/common/BadgePill';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  BarChart3, 
  History, 
  RotateCcw,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

interface AdminDashboardPageProps {
  students: Student[];
  officialCourses: OfficialCourse[];
  stats: CohortStats;
  onRefreshData: () => void;
  onSelectStudent: (studentId: string) => void;
  onBackToPublic?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  students,
  officialCourses,
  stats,
  onRefreshData,
  onSelectStudent,
  onBackToPublic
}) => {
  // Auth state
  const [session, setSession] = useState<AdminSession | null>(() => adminAuth.getCurrentSession());
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'import' | 'students' | 'courses' | 'vault' | 'history'>('analytics');

  // File import state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    rejectedCount: number;
    errors: string[];
  } | null>(null);

  // Student editor modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState('');

  // Course progress tracking state
  const [courseStudentId, setCourseStudentId] = useState<string>(students[0]?.id || '');

  // Reset to factory seed modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Vault records
  const vaultRecords = useMemo(() => storageService.getAdminVault(), [students]);
  const importLogs = useMemo(() => storageService.getImportLogs(), [students]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = adminAuth.login(passwordInput);
    if (res.success && res.session) {
      setSession(res.session);
      setPasswordInput('');
    } else {
      setLoginError(res.error || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    setSession(null);
  };

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportResult(null);
    }
  };

  const handleProcessImport = async () => {
    if (!selectedFile) return;
    setImportLoading(true);
    setImportResult(null);

    const result = await storageService.processImportFile(selectedFile, session?.name || 'admin');
    setImportResult(result);
    setImportLoading(false);
    onRefreshData();
  };

  // Handle Student Edit Save
  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    storageService.updateStudent(editingStudent);
    setEditingStudent(null);
    onRefreshData();
  };

  // Handle Course Progress Toggle
  const handleCourseStatusChange = (courseId: number, newStatus: any) => {
    if (!courseStudentId) return;
    storageService.updateStudentCourseProgress(courseStudentId, courseId, newStatus);
    onRefreshData();
  };

  // Filter students in management tab
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    return students.filter(s => matchesSearchQuery(studentSearch, s.fullName, s.id));
  }, [students, studentSearch]);

  const selectedCourseStudent = students.find(s => s.id === courseStudentId);

  // Chart Data Preparation (White mode palette)
  const redemptionPieData = [
    { name: 'Redeemed', value: stats.redeemedCount, color: '#10B981' },
    { name: 'Pending', value: stats.notRedeemedCount, color: '#F59E0B' }
  ];

  const milestoneBarData = [
    { name: 'Milestone 3', count: stats.milestone3Count, fill: '#D97706' },
    { name: 'Milestone 2', count: stats.milestone2Count, fill: '#2563EB' },
    { name: 'Milestone 1', count: stats.milestone1Count, fill: '#0891B2' },
    { name: 'No Milestone', count: stats.totalRegistered - stats.totalMilestonesCount, fill: '#94A3B8' }
  ];

  // If not authenticated, show secure admin login card
  if (!session) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center px-4">
        <div className="apple-card-outer max-w-md w-full bg-white border border-slate-200 shadow-xl">
          <div className="apple-card-inner p-6 sm:p-8 space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Shield className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                GDG NECN Admin Command Center
              </h2>
              <p className="text-xs text-slate-500">
                Authorized management portal for data synchronization and course progress.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Master Administrative Key:
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter admin key..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  Default keys: <code className="text-blue-600 font-bold">necn2026admin</code> or <code className="text-blue-600 font-bold">gdgnecn2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all"
              >
                Authenticate Session
              </button>
            </form>

            {onBackToPublic && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBackToPublic}
                  className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Website</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20 sm:pt-24">
      {/* ADMIN TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>AUTHENTICATED • {session.role.toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs text-slate-500">
            Logged in as <strong className="text-slate-800">{session.name}</strong> ({session.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onBackToPublic && (
            <button
              onClick={onBackToPublic}
              className="apple-pill-btn bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs py-2 px-3 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
          )}

          <button
            onClick={() => setShowResetConfirm(true)}
            className="apple-pill-btn bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 text-xs py-2 px-3 shadow-xs"
            title="Reset to Original 438-Student Dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed</span>
          </button>

          <button
            onClick={handleLogout}
            className="apple-pill-btn bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs py-2 px-3 shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* CONFIRM FACTORY SEED RESET MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="apple-card-outer max-w-sm w-full bg-white border border-slate-200 shadow-xl">
            <div className="apple-card-inner p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900">Reset Dataset to Factory Seed?</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will restore all 438 student records to the latest 07 Nov snapshot (190 redeemed, 248 pending, 46 milestones). Any manual edits will be reverted.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    storageService.resetToFactorySeed();
                    setShowResetConfirm(false);
                    onRefreshData();
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SUB-TABS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {[
          { id: 'analytics', label: 'Program Analytics', icon: BarChart3 },
          { id: 'import', label: 'CSV/Excel Import Engine', icon: Upload },
          { id: 'students', label: 'Student Management', icon: Users },
          { id: 'courses', label: 'Course Tracking Engine', icon: CheckCircle },
          { id: 'vault', label: 'Admin Security Vault', icon: Lock },
          { id: 'history', label: 'Import Audit History', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROGRAM ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Redemption Rate Pie Chart */}
            <div className="apple-card-outer bg-white border border-slate-200 shadow-sm">
              <div className="apple-card-inner p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Access Code Redemption Rate
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={redemptionPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {redemptionPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Redeemed: <strong className="text-emerald-700 font-bold">{stats.redeemedCount} ({stats.redemptionPercentage}%)</strong></span>
                  <span>Pending: <strong className="text-amber-700 font-bold">{stats.notRedeemedCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Milestone Distribution Bar Chart */}
            <div className="apple-card-outer bg-white border border-slate-200 shadow-sm">
              <div className="apple-card-inner p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Milestone Progression Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={milestoneBarData}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {milestoneBarData.map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>Total Milestone Achievers: <strong className="text-slate-900 font-bold">{stats.totalMilestonesCount}</strong></span>
                  <span>M3 Champions: <strong className="text-amber-700 font-bold">{stats.milestone3Count}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CSV/EXCEL IMPORT ENGINE */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="apple-card-outer bg-white border border-slate-200 shadow-sm">
            <div className="apple-card-inner p-6 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span>Import & Synchronize Student Data</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload a fresh CSV or Excel (.xlsx) file exported from Google Cloud Skills Boost. The system matches students deterministically by ID or Email, preserves all existing individual course progress, updates milestone and badge counts, and tracks import audits.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors text-center space-y-3 bg-slate-50/50">
                <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    {selectedFile ? selectedFile.name : 'Select or drag & drop CSV or Excel file'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports .csv and .xlsx formats (e.g. GDGC-NECNL [04 Nov].csv)
                  </p>
                </div>

                <label className="inline-flex cursor-pointer">
                  <input
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="apple-pill-btn bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 shadow-xs">
                    Browse Files
                  </span>
                </label>
              </div>

              {selectedFile && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs">
                    <span className="text-slate-500 font-medium">File Selected:</span>
                    <p className="font-bold text-slate-900">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>
                  </div>

                  <button
                    onClick={handleProcessImport}
                    disabled={importLoading}
                    className="apple-pill-btn bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 shadow-sm disabled:opacity-50"
                  >
                    {importLoading ? 'Processing & Matching...' : 'Start Secure Import'}
                  </button>
                </div>
              )}

              {/* Import Results Banner */}
              {importResult && (
                <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  importResult.success ? 'bg-emerald-50 border-emerald-300' : 'bg-rose-50 border-rose-300'
                }`}>
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    {importResult.success ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                    <span>Import Completed</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Inserted:</span>
                      <strong className="text-emerald-700 text-sm">+{importResult.insertedCount}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Updated:</span>
                      <strong className="text-blue-700 text-sm">{importResult.updatedCount}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Unchanged:</span>
                      <strong className="text-slate-700 text-sm">{importResult.unchangedCount}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-500 block text-[10px]">Rejected:</span>
                      <strong className="text-rose-700 text-sm">{importResult.rejectedCount}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students to edit..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Total Managed: <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong>
            </span>
          </div>

          <div className="apple-card-outer bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3">ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Redemption</th>
                    <th className="p-3">Milestone</th>
                    <th className="p-3">Badges</th>
                    <th className="p-3">Points</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.slice(0, 50).map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono text-slate-400">{s.id}</td>
                      <td className="p-3 font-bold text-slate-900">{s.fullName}</td>
                      <td className="p-3"><RedemptionPill status={s.redemptionStatus} /></td>
                      <td className="p-3"><MilestonePill milestone={s.milestone} /></td>
                      <td className="p-3 font-mono font-bold text-amber-700">{s.skillBadgeCount}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{s.points}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingStudent({ ...s })}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* EDIT STUDENT MODAL */}
          {editingStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
              <div className="apple-card-outer max-w-lg w-full bg-white border border-slate-200 shadow-xl">
                <div className="apple-card-inner p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      Edit Student: {editingStudent.fullName}
                    </h3>
                    <button
                      onClick={() => setEditingStudent(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded bg-slate-100 font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleSaveStudentEdit} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={editingStudent.fullName}
                        onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-600 font-semibold">Redemption Status:</label>
                        <select
                          value={editingStudent.redemptionStatus}
                          onChange={(e) => setEditingStudent({ ...editingStudent, redemptionStatus: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none font-medium"
                        >
                          <option value="Redeemed">Redeemed</option>
                          <option value="Not Redeemed">Not Redeemed</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-600 font-semibold">Milestone:</label>
                        <select
                          value={editingStudent.milestone}
                          onChange={(e) => setEditingStudent({ ...editingStudent, milestone: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none font-medium"
                        >
                          <option value="Milestone 3">Milestone 3</option>
                          <option value="Milestone 2">Milestone 2</option>
                          <option value="Milestone 1">Milestone 1</option>
                          <option value="No Milestone">No Milestone</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Skill Badges Count (0-10):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={editingStudent.skillBadgeCount}
                        onChange={(e) => setEditingStudent({ ...editingStudent, skillBadgeCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-semibold">Google Skills Profile URL:</label>
                      <input
                        type="url"
                        value={editingStudent.googleSkillsProfileUrl}
                        onChange={(e) => setEditingStudent({ ...editingStudent, googleSkillsProfileUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COURSE TRACKING ENGINE */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="apple-card-outer bg-white border border-slate-200 shadow-sm">
            <div className="apple-card-inner p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Update Individual Student Course Progress</span>
                </h3>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Select Student:</span>
                  <select
                    value={courseStudentId}
                    onChange={(e) => setCourseStudentId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none font-semibold"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedCourseStudent && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{selectedCourseStudent.fullName}</h4>
                      <p className="text-slate-500">{selectedCourseStudent.milestone} • {selectedCourseStudent.skillBadgeCount} Badges</p>
                    </div>
                    <span className="font-mono text-blue-700 font-bold">
                      {selectedCourseStudent.points} Points
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {officialCourses.map(course => {
                      const prog = selectedCourseStudent.courseProgress.find(c => c.courseId === course.id);
                      const currentStatus = prog?.status || 'Not Tracked';

                      return (
                        <div key={course.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900">
                              #{course.courseNumber} - {course.title}
                            </span>
                            <p className="text-slate-500 text-[11px]">{course.category}</p>
                            {prog?.notes && (
                              <p className="text-[10px] text-amber-700 font-semibold italic">{prog.notes}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(['Not Tracked', 'Not Started', 'In Progress', 'Completed'] as const).map(st => (
                              <button
                                key={st}
                                onClick={() => handleCourseStatusChange(course.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                  currentStatus === st
                                    ? st === 'Completed'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : st === 'In Progress'
                                      ? 'bg-blue-600 text-white shadow-xs'
                                      : 'bg-slate-700 text-white font-bold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN SECURITY VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-amber-900 font-bold">Confidential Vault Area:</strong> This view is strictly restricted to authenticated GDG administrators. Access codes and personal emails are never served through public API endpoints.
            </p>
          </div>

          <div className="apple-card-outer bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3">Student ID</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Registered Email</th>
                    <th className="p-3">Access Code</th>
                    <th className="p-3">Redemption Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vaultRecords.slice(0, 100).map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-500">{v.studentId}</td>
                      <td className="p-3 font-bold text-slate-900">{v.fullName}</td>
                      <td className="p-3 font-mono text-slate-600">{v.email || 'N/A'}</td>
                      <td className="p-3 font-mono text-amber-700 font-bold">{v.accessCode || 'N/A'}</td>
                      <td className="p-3"><RedemptionPill status={v.redemptionStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: IMPORT AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="apple-card-outer bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-mono text-[10px] uppercase font-bold">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Filename</th>
                    <th className="p-3">Format</th>
                    <th className="p-3 text-emerald-700">Inserted</th>
                    <th className="p-3 text-blue-700">Updated</th>
                    <th className="p-3 text-slate-600">Unchanged</th>
                    <th className="p-3 text-rose-700">Rejected</th>
                    <th className="p-3">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 font-mono">{new Date(log.importedAt).toLocaleString()}</td>
                      <td className="p-3 font-bold text-slate-900">{log.filename}</td>
                      <td className="p-3 font-mono text-slate-600">{log.fileType}</td>
                      <td className="p-3 font-mono font-bold text-emerald-700">+{log.insertedCount}</td>
                      <td className="p-3 font-mono text-blue-700 font-semibold">{log.updatedCount}</td>
                      <td className="p-3 font-mono text-slate-500">{log.unchangedCount}</td>
                      <td className="p-3 font-mono text-rose-700">{log.rejectedCount}</td>
                      <td className="p-3 text-slate-600">{log.importedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
