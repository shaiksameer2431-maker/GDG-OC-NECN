import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Student, CohortStats, AdminVaultRecord, ImportLog } from '../types';
import { storageService } from '../services/storageService';
import { adminAuth } from '../services/adminAuth';
import type { AdminSession } from '../services/adminAuth';
import { 
  Shield, 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  RotateCcw,
  KeyRound,
  Download,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  LogOut,
  Clock,
  Filter,
  Check,
  FileText
} from 'lucide-react';

const PERSISTED_AUTH_KEY = 'necn_admin_mobile_remember_v1';

export const AdminMobileApp: React.FC = () => {
  // Authentication State
  const [session, setSession] = useState<AdminSession | null>(() => {
    const existing = adminAuth.getCurrentSession();
    if (existing) return existing;
    const remembered = localStorage.getItem(PERSISTED_AUTH_KEY);
    if (remembered === 'true') {
      const res = adminAuth.login('necn2026admin');
      if (res.success && res.session) return res.session;
    }
    return null;
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Live Data State
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [stats, setStats] = useState<CohortStats>(() => storageService.getCohortStats());
  const [vault, setVault] = useState<AdminVaultRecord[]>(() => storageService.getAdminVault());
  const [importLogs, setImportLogs] = useState<ImportLog[]>(() => storageService.getImportLogs());

  // Upload & File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    type: 'success' | 'error';
    title: string;
    message: string;
    details?: {
      inserted: number;
      updated: number;
      unchanged: number;
      rejected: number;
      redeemed: number;
      badges: number;
      milestones: number;
    };
  } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'redeemed' | 'pending' | 'm3' | 'm2' | 'm1' | '10badges'>('all');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Toast auto-clear
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Refresh data from storage
  const reloadData = () => {
    setStudents(storageService.getStudents());
    setStats(storageService.getCohortStats());
    setVault(storageService.getAdminVault());
    setImportLogs(storageService.getImportLogs());
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = adminAuth.login(passwordInput);
    if (res.success && res.session) {
      setSession(res.session);
      setPasswordInput('');
      if (rememberMe) {
        localStorage.setItem(PERSISTED_AUTH_KEY, 'true');
      }
      setToastMessage('Signed in to Admin Console');
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify master key.');
    }
  };

  const handleQuickDemoLogin = () => {
    const res = adminAuth.login('necn2026admin');
    if (res.success && res.session) {
      setSession(res.session);
      if (rememberMe) {
        localStorage.setItem(PERSISTED_AUTH_KEY, 'true');
      }
      setToastMessage('Signed in as GDG NECN Lead Admin');
    }
  };

  const handleLogout = () => {
    adminAuth.logout();
    localStorage.removeItem(PERSISTED_AUTH_KEY);
    setSession(null);
    setToastMessage('Signed out successfully');
  };

  // File selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadFeedback(null);
      // Auto-process on mobile for frictionless 1-tap UX
      processFile(file);
    }
  };

  // Process uploaded CSV/Excel
  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadFeedback(null);

    try {
      const result = await storageService.processImportFile(file, session?.name || 'GDG Admin');
      if (result.success) {
        reloadData();
        const updatedStats = storageService.getCohortStats();
        setUploadFeedback({
          type: 'success',
          title: 'Sheet Processed Successfully!',
          message: `Updated cohort with ${file.name}. Leaderboard is now live with the latest student data.`,
          details: {
            inserted: result.insertedCount,
            updated: result.updatedCount,
            unchanged: result.unchangedCount,
            rejected: result.rejectedCount,
            redeemed: updatedStats.redeemedCount,
            badges: updatedStats.totalSkillBadges,
            milestones: updatedStats.totalMilestonesCount
          }
        });
        setToastMessage(`✓ ${file.name} uploaded & data updated!`);
      } else {
        setUploadFeedback({
          type: 'error',
          title: 'Upload Processing Failed',
          message: result.errors[0] || 'Could not parse student rows. Please ensure it is a valid CSV or Excel file.'
        });
      }
    } catch (err: any) {
      setUploadFeedback({
        type: 'error',
        title: 'File Error',
        message: err?.message || 'An error occurred while reading the file.'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setToastMessage(`Copied ${label}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export JSON helper
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `initialStudents_${new Date().toISOString().split('T')[0]}.json`);
    dl.click();
    setToastMessage('Exported initialStudents.json');
  };

  // Reset to Factory Seed
  const handleResetFactory = () => {
    storageService.resetToFactorySeed();
    reloadData();
    setShowResetConfirm(false);
    setToastMessage('Reset cohort data to official 07 Nov factory seed.');
  };

  // Vault lookup mapping
  const vaultMap = useMemo(() => {
    const map = new Map<string, AdminVaultRecord>();
    vault.forEach(v => map.set(v.studentId, v));
    return map;
  }, [vault]);

  // Filter & Search logic
  const filteredStudents = useMemo(() => {
    let result = students;

    // Filter mode
    if (filterMode === 'redeemed') {
      result = result.filter(s => s.redemptionStatus === 'Redeemed');
    } else if (filterMode === 'pending') {
      result = result.filter(s => s.redemptionStatus === 'Not Redeemed');
    } else if (filterMode === 'm3') {
      result = result.filter(s => s.milestone === 'Milestone 3');
    } else if (filterMode === 'm2') {
      result = result.filter(s => s.milestone === 'Milestone 2');
    } else if (filterMode === 'm1') {
      result = result.filter(s => s.milestone === 'Milestone 1');
    } else if (filterMode === '10badges') {
      result = result.filter(s => (s.skillBadgeCount || 0) >= 10);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => {
        const v = vaultMap.get(s.id);
        const nameMatch = s.fullName.toLowerCase().includes(q);
        const idMatch = s.id.toLowerCase().includes(q);
        const emailMatch = v?.email ? v.email.toLowerCase().includes(q) : false;
        const codeMatch = v?.accessCode ? v.accessCode.toLowerCase().includes(q) : false;
        return nameMatch || idMatch || emailMatch || codeMatch;
      });
    }

    return result;
  }, [students, filterMode, searchQuery, vaultMap]);

  // If not logged in, render mobile login gate
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-[#F4F8FD] to-slate-100 flex flex-col justify-center px-4 py-8">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
              <svg width="24" height="15" viewBox="0 0 38 22" className="shrink-0">
                <path d="M10 3 2 11l8 8" stroke="#EA4335" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="m28 3 8 8-8 8" stroke="#34A853" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="m22 2-6 18" stroke="#FBBC04" strokeWidth="5" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-bold text-slate-800">GDG On Campus · NECN</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Admin Data Portal
            </h1>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Standalone student cohort management &amp; CSV data synchronization console.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Sign In with Master Key</h2>
                <p className="text-[11px] text-slate-500">Authorized administrators only</p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Administrative Master Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter master key..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me on this mobile device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Unlock Admin Console</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>One-Tap Admin Sign In (Lead Admin)</span>
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Google Cloud Learn with Communities 2026 · NECN
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Mobile Dashboard
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-slate-900 pb-20 antialiased font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* TOP MOBILE APP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              GDG
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-slate-900 truncate">Admin Portal</h1>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {stats.totalRegistered} Champions · {stats.redeemedCount} Redeemed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset to 07 Nov Factory Seed"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 transition-all active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN MOBILE CONTAINER */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-4 space-y-4">
        
        {/* =========================================================================
            SECTION 1: HERO FILE UPLOAD CARD (PRIMARY USER ACTION)
            ========================================================================= */}
        <section className="bg-white rounded-2xl border border-blue-200/70 p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-amber-500" />
          
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                <Upload className="w-3 h-3" />
                Instant CSV &amp; Excel Ingestion
              </div>
              <h2 className="text-base font-bold text-slate-900">Upload Student Data Sheet</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload new Google Cloud cohort sheet (.csv or .xlsx). Data updates immediately.
              </p>
            </div>
          </div>

          {/* Touch-Friendly Upload Area */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="mobile-csv-upload"
          />

          <label
            htmlFor="mobile-csv-upload"
            className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-[0.99] ${
              isUploading 
                ? 'border-blue-400 bg-blue-50/50' 
                : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 bg-slate-50/70'
            }`}
          >
            {isUploading ? (
              <div className="space-y-2 py-1">
                <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-blue-700">Processing student data sheet...</p>
                <p className="text-[11px] text-slate-500">Parsing rows, ranking, and updating cohort vault...</p>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Tap to select CSV / Excel sheet
                </div>
                <p className="text-[11px] text-slate-500">
                  e.g. <span className="font-mono text-blue-600">GDGC-NECNL [07 Nov].csv</span>
                </p>
              </div>
            )}
          </label>

          {/* Upload Feedback Card */}
          {uploadFeedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                uploadFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {uploadFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{uploadFeedback.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{uploadFeedback.message}</p>

              {uploadFeedback.details && (
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-bold text-[10px]">
                  <div className="p-1.5 rounded-lg bg-white/80 border border-emerald-200">
                    <div className="text-emerald-700 text-xs">{uploadFeedback.details.redeemed}</div>
                    <div className="text-slate-600">Redeemed</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/80 border border-emerald-200">
                    <div className="text-emerald-700 text-xs">{uploadFeedback.details.badges}</div>
                    <div className="text-slate-600">Badges</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white/80 border border-emerald-200">
                    <div className="text-emerald-700 text-xs">{uploadFeedback.details.milestones}</div>
                    <div className="text-slate-600">Milestones</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 2: REAL-TIME COHORT STATS (MOBILE 2x2 GRID)
            ========================================================================= */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Card 1: Total Registered */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Registered</span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.totalRegistered}</div>
            <div className="text-[10px] text-slate-500">Official Cohort Size</div>
          </div>

          {/* Card 2: Access Code Redeemed */}
          <div className="bg-white rounded-xl border border-emerald-200/80 p-3 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Redeemed</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-emerald-600">{stats.redeemedCount}</div>
            <div className="text-[10px] text-slate-500">
              {Math.round((stats.redeemedCount / (stats.totalRegistered || 1)) * 100)}% Claimed
            </div>
          </div>

          {/* Card 3: Total Badges */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Badges</span>
              <Award className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-extrabold text-amber-600">{stats.totalSkillBadges}</div>
            <div className="text-[10px] text-slate-500">Skill Badges Earned</div>
          </div>

          {/* Card 4: Milestones */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Milestones</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-extrabold text-purple-600">{stats.totalMilestonesCount}</div>
            <div className="text-[10px] text-slate-500">
              {stats.milestone3Count} M3 · {stats.milestone2Count} M2 · {stats.milestone1Count} M1
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: DATA EXPORT & HISTORY UTILITIES BAR
            ========================================================================= */}
        <section className="flex items-center justify-between gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => storageService.exportData('CSV')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => storageService.exportData('XLSX')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Export JSON</span>
            </button>
          </div>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs shrink-0 active:scale-95 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({importLogs.length})</span>
          </button>
        </section>

        {/* =========================================================================
            SECTION 4: SEARCH & FILTER BAR
            ========================================================================= */}
        <section className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5 shadow-2xs">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, ID, email, access code..."
              className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Chips Scrollbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setFilterMode('redeemed')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'redeemed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              ✓ Redeemed ({stats.redeemedCount})
            </button>
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              ⏳ Pending ({stats.notRedeemedCount})
            </button>
            <button
              onClick={() => setFilterMode('m3')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'm3'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              🏆 Milestone 3 ({stats.milestone3Count})
            </button>
            <button
              onClick={() => setFilterMode('m2')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'm2'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Milestone 2 ({stats.milestone2Count})
            </button>
            <button
              onClick={() => setFilterMode('m1')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === 'm1'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
              }`}
            >
              Milestone 1 ({stats.milestone1Count})
            </button>
            <button
              onClick={() => setFilterMode('10badges')}
              className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterMode === '10badges'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏅 10 Badges
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: LIVE STUDENT CARDS (MOBILE FIRST LEADERBOARD VIEW)
            ========================================================================= */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            <span className="font-semibold text-slate-700">Ranked by Official Points</span>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No students found matching your criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setFilterMode('all'); }}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Clear search &amp; filters
              </button>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const vaultRecord = vaultMap.get(student.id);
              const isExpanded = expandedStudentId === student.id;
              const isTop3 = student.rank <= 3;

              return (
                <div
                  key={student.id}
                  data-student-card={student.id}
                  className={`bg-white rounded-xl border transition-all shadow-2xs ${
                    isExpanded 
                      ? 'border-blue-400 ring-1 ring-blue-400/30' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header (Always Visible) */}
                  <div
                    onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                    className="student-card-header p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Rank Badge */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          student.rank === 1
                            ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                            : student.rank === 2
                            ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-200'
                            : student.rank === 3
                            ? 'bg-amber-700 text-amber-50 ring-2 ring-amber-600'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{student.rank}
                      </div>

                      {/* Name & ID */}
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">
                          {student.fullName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                          <span className="font-mono">{student.id}</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">{student.points} pts</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pills & Toggle */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {student.redemptionStatus === 'Redeemed' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Redeemed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending
                        </span>
                      )}

                      {student.milestone !== 'No Milestone' && (
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                          {student.milestone}
                        </span>
                      )}

                      <div className="text-slate-400 pl-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Summary Micro-Badges Bar */}
                  <div className="px-3.5 pb-3 flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700">
                      🏅 {student.skillBadgeCount || 0} Badges
                    </span>
                    {student.milestone !== 'No Milestone' && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-200 sm:hidden">
                        {student.milestone}
                      </span>
                    )}
                    {student.googleSkillsProfileStatus === 'All Good' && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                        Skills Verified
                      </span>
                    )}
                  </div>

                  {/* Expanded Admin Drawer */}
                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/60 rounded-b-xl text-xs animate-fadeIn">
                      {/* Email Row */}
                      {vaultRecord?.email && (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200">
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase text-slate-400">Email Address</div>
                            <div className="font-mono text-xs text-slate-800 truncate">{vaultRecord.email}</div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(vaultRecord.email, 'Email', `email-${student.id}`)}
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all shrink-0 cursor-pointer"
                            title="Copy Email"
                          >
                            {copiedKey === `email-${student.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Access Code Row */}
                      {vaultRecord?.accessCode && (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-slate-200">
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase text-slate-400">Access Code</div>
                            <div className="font-mono text-xs text-slate-800 truncate">{vaultRecord.accessCode}</div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(vaultRecord.accessCode, 'Access Code', `code-${student.id}`)}
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all shrink-0 cursor-pointer"
                            title="Copy Access Code"
                          >
                            {copiedKey === `code-${student.id}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}

                      {/* Profile Links */}
                      <div className="flex items-center gap-2 pt-0.5">
                        {student.googleSkillsProfileUrl && (
                          <a
                            href={student.googleSkillsProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-[11px] hover:bg-blue-100 transition-all cursor-pointer"
                          >
                            <span>Skills Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {student.googleDeveloperProfileUrl && (
                          <a
                            href={student.googleDeveloperProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] hover:bg-slate-200 transition-all cursor-pointer"
                          >
                            <span>Developer Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Earned Badges List */}
                      {student.skillBadges && student.skillBadges.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Completed Badges ({student.skillBadges.length})
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {student.skillBadges.map((badge, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-medium"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

      </main>

      {/* FACTORY RESET CONFIRM MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Reset to Factory 07 Nov Seed?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will restore all 438 student records to the verified 07 Nov snapshot (190 redeemed, 248 pending, 46 milestones). Any unsaved manual edits will be reverted.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleResetFactory}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT HISTORY MODAL */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Import History Logs</span>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {importLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate">{log.filename}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px]">
                      {log.fileType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{new Date(log.importedAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>by {log.importedBy}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-3 font-semibold pt-0.5">
                    <span className="text-emerald-700">+{log.insertedCount} new</span>
                    <span className="text-blue-700">{log.updatedCount} updated</span>
                    <span>{log.unchangedCount} unchanged</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 text-right">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
