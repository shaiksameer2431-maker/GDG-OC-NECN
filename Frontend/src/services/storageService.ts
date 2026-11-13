import type { Student, AdminVaultRecord, OfficialCourse, ImportLog, CohortStats, CourseProgressItem } from '../types';
import rawInitialStudents from '../data/initialStudents.json';
import rawAdminVault from '../data/adminVault.json';
import rawOfficialCourses from '../data/officialCourses.json';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const STORAGE_KEYS = {
  STUDENTS: 'necn_cloud_champions_students_v13',
  ADMIN_VAULT: 'necn_cloud_champions_vault_v13',
  IMPORT_LOGS: 'necn_cloud_champions_import_logs_v13',
  ADMIN_TOKEN: 'necn_cloud_champions_admin_token_v13',
  COURSE_PROGRESS: 'necn_cloud_champions_course_progress_v13',
};

// Initial import history log
const INITIAL_IMPORT_LOG: ImportLog = {
  id: 'imp-009',
  filename: 'GDGC-NECNL [13 Nov].csv',
  fileType: 'CSV',
  insertedCount: 438,
  updatedCount: 0,
  unchangedCount: 0,
  rejectedCount: 0,
  importedAt: '2026-11-13T18:45:00.000Z',
  importedBy: 'system',
  errorSummary: []
};

class StorageService {
  private students: Student[] = [];
  private adminVault: AdminVaultRecord[] = [];
  private officialCourses: OfficialCourse[] = rawOfficialCourses as OfficialCourse[];
  private importLogs: ImportLog[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      // Clear legacy storage versions to prevent stale caches
      ['necn_cloud_champions_students_v1', 'necn_cloud_champions_students_v2', 'necn_cloud_champions_students_v3', 'necn_cloud_champions_students_v4', 'necn_cloud_champions_students_v5', 'necn_cloud_champions_students_v6', 'necn_cloud_champions_students_v7', 'necn_students'].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });

      const cachedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (cachedStudents) {
        this.students = JSON.parse(cachedStudents);
      } else {
        this.students = rawInitialStudents as Student[];
      }

      // Safeguard: Always ensure ranking order strictly enforces redeemed cohort students first
      this.recalculateRanks();

      const cachedVault = localStorage.getItem(STORAGE_KEYS.ADMIN_VAULT);
      if (cachedVault) {
        this.adminVault = JSON.parse(cachedVault);
      } else {
        this.adminVault = rawAdminVault as AdminVaultRecord[];
        this.saveVault();
      }

      const cachedLogs = localStorage.getItem(STORAGE_KEYS.IMPORT_LOGS);
      if (cachedLogs) {
        this.importLogs = JSON.parse(cachedLogs);
      } else {
        this.importLogs = [INITIAL_IMPORT_LOG];
        this.saveLogs();
      }

      // Check for live updates directly from GitHub repository in background
      this.fetchLiveGitHubData();
    } catch (e) {
      console.error('StorageService init error, falling back to bundled JSON:', e);
      this.students = rawInitialStudents as Student[];
      this.adminVault = rawAdminVault as AdminVaultRecord[];
      this.importLogs = [INITIAL_IMPORT_LOG];
      this.recalculateRanks();
    }
  }

  private saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
      // Notify other open tabs/windows (such as the public website) in real-time
      try {
        const channel = new BroadcastChannel('necn_leaderboard_sync');
        channel.postMessage({ type: 'DATA_UPDATED', timestamp: Date.now() });
        channel.close();
      } catch {}
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable:', e);
    }
  }

  private saveVault() {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_VAULT, JSON.stringify(this.adminVault));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable:', e);
    }
  }

  private saveLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.IMPORT_LOGS, JSON.stringify(this.importLogs));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable:', e);
    }
  }

  // Recalculate deterministic points and ranks
  public recalculateRanks() {
    this.students.forEach(student => {
      let pts = 0;
      if (student.milestone === 'Milestone 3') pts += 300;
      else if (student.milestone === 'Milestone 2') pts += 200;
      else if (student.milestone === 'Milestone 1') pts += 100;

      pts += (student.skillBadgeCount || 0) * 50;

      if (student.googleSkillsProfileStatus === 'All Good') pts += 20;
      if (student.googleDeveloperProfileStatus === 'All Good') pts += 20;

      student.points = pts;
    });

    const getMilestoneRank = (m: string) => {
      if (m === 'Milestone 3') return 3;
      if (m === 'Milestone 2') return 2;
      if (m === 'Milestone 1') return 1;
      return 0;
    };

    this.students.sort((a, b) => {
      // 1. OFFICIAL COHORT REDEMPTION PRIORITY #1:
      // In Google Cloud Learn with Communities, a student MUST redeem their official cohort
      // access code to be eligible for the official cohort podium, swags, and ranking.
      // Redeemed students ALWAYS rank ahead of unredeemed students!
      const aRedeemed = a.redemptionStatus === 'Redeemed';
      const bRedeemed = b.redemptionStatus === 'Redeemed';
      if (aRedeemed !== bRedeemed) {
        return aRedeemed ? -1 : 1;
      }

      // 2. Points (descending)
      if (b.points !== a.points) return b.points - a.points;

      // 3. Badges (descending)
      if (b.skillBadgeCount !== a.skillBadgeCount) return b.skillBadgeCount - a.skillBadgeCount;

      // 4. Milestone level (descending)
      const mDiff = getMilestoneRank(b.milestone) - getMilestoneRank(a.milestone);
      if (mDiff !== 0) return mDiff;

      // 5. Google Skills Profile Status All Good
      if ((b.googleSkillsProfileStatus === 'All Good') !== (a.googleSkillsProfileStatus === 'All Good')) {
        return b.googleSkillsProfileStatus === 'All Good' ? 1 : -1;
      }

      return a.fullName.localeCompare(b.fullName);
    });

    this.students.forEach((s, idx) => {
      s.rank = idx + 1;
    });

    this.saveStudents();
  }

  // Get all students (Safe public view - zero emails, zero access codes)
  public getStudents(): Student[] {
    return [...this.students];
  }

  // Get student by ID
  public getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  // Verify student registered email for secure profile unlocking
  public verifyStudentEmail(studentId: string, emailInput: string): boolean {
    if (!emailInput || !emailInput.trim()) return false;
    const clean = emailInput.trim().toLowerCase();
    const vaultRecord = this.adminVault.find(v => v.studentId === studentId);
    if (!vaultRecord || !vaultRecord.email) return false;
    return vaultRecord.email.trim().toLowerCase() === clean;
  }

  // Get official courses
  public getOfficialCourses(): OfficialCourse[] {
    return [...this.officialCourses];
  }

  // Calculate live cohort stats
  public getCohortStats(): CohortStats {
    const total = this.students.length;
    let redeemed = 0;
    let notRedeemed = 0;
    let m1 = 0;
    let m2 = 0;
    let m3 = 0;
    let totalBadges = 0;
    let tenBadgesCount = 0;

    this.students.forEach(s => {
      if (s.redemptionStatus === 'Redeemed') redeemed++;
      else notRedeemed++;

      if (s.milestone === 'Milestone 1') m1++;
      else if (s.milestone === 'Milestone 2') m2++;
      else if (s.milestone === 'Milestone 3') m3++;

      totalBadges += s.skillBadgeCount || 0;
      if (s.skillBadgeCount >= 10) tenBadgesCount++;
    });

    return {
      totalRegistered: total,
      redeemedCount: redeemed,
      notRedeemedCount: notRedeemed,
      redemptionPercentage: total > 0 ? Number(((redeemed / total) * 100).toFixed(1)) : 0,
      totalSkillBadges: totalBadges,
      milestone1Count: m1,
      milestone2Count: m2,
      milestone3Count: m3,
      totalMilestonesCount: m1 + m2 + m3,
      averageBadgesPerStudent: total > 0 ? Number((totalBadges / total).toFixed(2)) : 0,
      tenBadgesAchieversCount: tenBadgesCount
    };
  }

  // Update a student record
  public updateStudent(updatedStudent: Partial<Student> & { id: string }): boolean {
    const idx = this.students.findIndex(s => s.id === updatedStudent.id);
    if (idx === -1) return false;

    this.students[idx] = {
      ...this.students[idx],
      ...updatedStudent,
      updatedAt: new Date().toISOString()
    };

    this.recalculateRanks();
    return true;
  }

  // Update course progress for a student
  public updateStudentCourseProgress(
    studentId: string,
    courseId: number,
    status: CourseProgressItem['status'],
    notes?: string
  ): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return false;

    const courseIdx = student.courseProgress.findIndex(c => c.courseId === courseId);
    if (courseIdx === -1) {
      const course = this.officialCourses.find(c => c.id === courseId);
      student.courseProgress.push({
        courseId,
        courseTitle: course ? course.title : `Course #${courseId}`,
        status,
        completedAt: status === 'Completed' ? new Date().toISOString() : null,
        notes
      });
    } else {
      student.courseProgress[courseIdx] = {
        ...student.courseProgress[courseIdx],
        status,
        completedAt: status === 'Completed' ? new Date().toISOString() : student.courseProgress[courseIdx].completedAt,
        notes: notes !== undefined ? notes : student.courseProgress[courseIdx].notes
      };
    }

    student.updatedAt = new Date().toISOString();
    this.saveStudents();
    return true;
  }

  // Submit student verification request
  public submitStudentCourseVerification(
    studentId: string,
    courseId: number,
    proofUrl: string,
    notes: string
  ): boolean {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return false;

    // Sets course to 'In Progress' with verification pending note
    const course = this.officialCourses.find(c => c.id === courseId);
    const existing = student.courseProgress.find(c => c.courseId === courseId);
    const verificationNote = `Verification Request: ${proofUrl} | ${notes}`;

    if (existing) {
      existing.status = existing.status === 'Completed' ? 'Completed' : 'In Progress';
      existing.notes = verificationNote;
    } else {
      student.courseProgress.push({
        courseId,
        courseTitle: course ? course.title : `Course #${courseId}`,
        status: 'In Progress',
        notes: verificationNote
      });
    }

    this.saveStudents();
    return true;
  }

  // Admin: Get Vault records (Authenticated admin only)
  public getAdminVault(): AdminVaultRecord[] {
    return [...this.adminVault];
  }

  // Admin: Get Import logs
  public getImportLogs(): ImportLog[] {
    return [...this.importLogs];
  }

  // Helper to extract badge list matching official course badges
  private extractBadgeList(badgeNamesRaw: string): string[] {
    if (!badgeNamesRaw || !badgeNamesRaw.trim()) return [];
    const raw = badgeNamesRaw.trim();
    const matched: string[] = [];

    for (const c of this.officialCourses) {
      if (raw.includes(c.badgeName)) {
        matched.push(c.badgeName);
      }
    }

    if (matched.length === 0 && raw.length > 0) {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return matched;
  }

  // Process CSV/Excel Upload
  public async processImportFile(
    file: File,
    operator: string = 'admin'
  ): Promise<{
    success: boolean;
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    rejectedCount: number;
    errors: string[];
  }> {
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    let rawRows: any[] = [];

    try {
      if (isExcel) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      } else {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        rawRows = parsed.data;
      }
    } catch (err: any) {
      return {
        success: false,
        insertedCount: 0,
        updatedCount: 0,
        unchangedCount: 0,
        rejectedCount: 0,
        errors: [`Failed to parse file: ${err.message}`]
      };
    }

    let inserted = 0;
    let updated = 0;
    let unchanged = 0;
    let rejected = 0;
    const errors: string[] = [];

    rawRows.forEach((r, idx) => {
      // Find matching keys flexibly
      const name = (r['User Name'] || r['Name'] || r['fullName'] || r['Student Name'] || '').toString().trim();
      const email = (r['User Email'] || r['Email'] || r['email'] || '').toString().trim().toLowerCase();
      const skillsUrl = (r['Google Skills Profile URL'] || r['skills_url'] || '').toString().trim();
      const skillsStatus = (r['Google Skills Profile Status'] || 'Not applicable').toString().trim();
      const devUrl = (r['Google Developer Profile URL'] || r['developer_url'] || '').toString().trim();
      const devStatus = (r['Google Developer Profile Status'] || 'Not applicable').toString().trim();
      const accessCode = (r['Access Code'] || r['access_code'] || '').toString().trim();
      const redemptionRaw = (r['Access Code Redemption Status'] || r['redemption_status'] || '').toString().trim();
      const milestoneRaw = (r['Milestone Completed'] || r['milestone'] || 'No Milestone').toString().trim();
      const badgeCountRaw = (r['Skill Badges Completed Count'] || r['badge_count'] || '0').toString().trim();
      const badgeNamesRaw = (r['Skill Badges Completed Names'] || r['badge_names'] || '').toString().trim();
      const gearBadges = (r['GEAR Digital Badges'] || 'Not applicable').toString().trim();

      if (!name && !email) {
        rejected++;
        errors.push(`Row ${idx + 2}: Missing student name and email.`);
        return;
      }

      // Check for existing student match:
      // Match by email via vault or by normalized full name
      let existingVault = this.adminVault.find(v => email && v.email.toLowerCase() === email);
      let existingStudent: Student | undefined;

      if (existingVault) {
        existingStudent = this.students.find(s => s.id === existingVault!.studentId);
      } else {
        existingStudent = this.students.find(s => s.fullName.toLowerCase() === name.toLowerCase());
      }

      const isRedeemed = redemptionRaw.toLowerCase() === 'yes' || redemptionRaw.toLowerCase() === 'redeemed';
      const redemptionStatus: 'Redeemed' | 'Not Redeemed' = isRedeemed ? 'Redeemed' : 'Not Redeemed';
      const badgeCount = parseInt(badgeCountRaw, 10) || 0;
      const parsedBadges = this.extractBadgeList(badgeNamesRaw);

      if (existingStudent) {
        // UPDATE EXISTING RECORD
        // Critical: Do NOT erase student information when new field is blank
        // Critical: Do NOT overwrite existing course progress!
        let hasChanges = false;

        if (name && existingStudent.fullName !== name) {
          existingStudent.fullName = name;
          hasChanges = true;
        }
        if (skillsUrl && existingStudent.googleSkillsProfileUrl !== skillsUrl) {
          existingStudent.googleSkillsProfileUrl = skillsUrl;
          hasChanges = true;
        }
        if (skillsStatus && existingStudent.googleSkillsProfileStatus !== skillsStatus) {
          existingStudent.googleSkillsProfileStatus = skillsStatus;
          hasChanges = true;
        }
        if (devUrl && existingStudent.googleDeveloperProfileUrl !== devUrl) {
          existingStudent.googleDeveloperProfileUrl = devUrl;
          hasChanges = true;
        }
        if (redemptionStatus !== existingStudent.redemptionStatus) {
          existingStudent.redemptionStatus = redemptionStatus;
          hasChanges = true;
        }
        if (milestoneRaw && existingStudent.milestone !== milestoneRaw) {
          existingStudent.milestone = (milestoneRaw as any) || 'No Milestone';
          hasChanges = true;
        }
        if (badgeCount !== existingStudent.skillBadgeCount) {
          existingStudent.skillBadgeCount = badgeCount;
          hasChanges = true;
        }
        if (parsedBadges.length > 0) {
          existingStudent.skillBadges = parsedBadges;
          hasChanges = true;
        }
        if (gearBadges && existingStudent.gearBadges !== gearBadges) {
          existingStudent.gearBadges = gearBadges;
          hasChanges = true;
        }

        // Update vault
        if (existingVault) {
          if (email && existingVault.email !== email) existingVault.email = email;
          if (accessCode && existingVault.accessCode !== accessCode) existingVault.accessCode = accessCode;
          existingVault.redemptionStatus = redemptionStatus;
        }

        if (hasChanges) {
          updated++;
          existingStudent.updatedAt = new Date().toISOString();
        } else {
          unchanged++;
        }
      } else {
        // INSERT NEW STUDENT
        const newId = `necn-${String(this.students.length + 1).padStart(3, '0')}`;
        const newStudent: Student = {
          id: newId,
          fullName: name || 'New Student',
          googleSkillsProfileUrl: skillsUrl,
          googleSkillsProfileStatus: skillsStatus,
          googleDeveloperProfileUrl: devUrl,
          googleDeveloperProfileStatus: devStatus,
          redemptionStatus,
          milestone: (milestoneRaw as any) || 'No Milestone',
          gearBadges,
          skillBadgeCount: badgeCount,
          skillBadges: parsedBadges,
          points: 0,
          rank: 0,
          courseProgress: this.officialCourses.map(course => ({
            courseId: course.id,
            courseTitle: course.title,
            status: 'Not Tracked',
            completedAt: null
          })),
          updatedAt: new Date().toISOString()
        };

        this.students.push(newStudent);

        // Add to private admin vault
        this.adminVault.push({
          studentId: newId,
          fullName: name,
          email: email,
          accessCode: accessCode,
          redemptionStatus,
          importedAt: new Date().toISOString()
        });

        inserted++;
      }
    });

    // Recalculate ranks and deterministic points
    this.recalculateRanks();
    this.saveVault();

    // Create import log
    const log: ImportLog = {
      id: `imp-${Date.now()}`,
      filename: file.name,
      fileType: isExcel ? 'XLSX' : 'CSV',
      insertedCount: inserted,
      updatedCount: updated,
      unchangedCount: unchanged,
      rejectedCount: rejected,
      importedAt: new Date().toISOString(),
      importedBy: operator,
      errorSummary: errors
    };

    this.importLogs.unshift(log);
    this.saveLogs();

    return {
      success: true,
      insertedCount: inserted,
      updatedCount: updated,
      unchangedCount: unchanged,
      rejectedCount: rejected,
      errors
    };
  }

  // Export dataset
  public exportData(format: 'CSV' | 'XLSX') {
    const exportRows = this.students.map(s => ({
      'Rank': s.rank,
      'Student ID': s.id,
      'Full Name': s.fullName,
      'Points': s.points,
      'Milestone Completed': s.milestone,
      'Skill Badges Completed Count': s.skillBadgeCount,
      'Skill Badges Completed Names': s.skillBadges.join('; '),
      'Access Code Redemption Status': s.redemptionStatus,
      'Google Skills Profile URL': s.googleSkillsProfileUrl,
      'Google Skills Profile Status': s.googleSkillsProfileStatus,
      'GEAR Digital Badges': s.gearBadges
    }));

    if (format === 'CSV') {
      const csv = Papa.unparse(exportRows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NECN_Cloud_Champions_Leaderboard_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Leaderboard');
      XLSX.writeFile(wb, `NECN_Cloud_Champions_Leaderboard_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  }

  // Reset to factory seed (for admin testing/recovery)
  public resetToFactorySeed() {
    this.students = rawInitialStudents as Student[];
    this.adminVault = rawAdminVault as AdminVaultRecord[];
    this.importLogs = [INITIAL_IMPORT_LOG];
    this.recalculateRanks();
    this.saveVault();
    this.saveLogs();
  }

  // Fetch live cohort data directly from GitHub repository (Zero delay sync)
  public async fetchLiveGitHubData(force: boolean = false): Promise<boolean> {
    try {
      let liveStudents: Student[] | null = null;

      // Primary: GitHub Contents API with raw header (bypasses raw CDN edge caching)
      try {
        const apiRes = await fetch(
          `https://api.github.com/repos/shaiksameer2431-maker/GDG-OC-NECN/contents/Frontend/src/data/initialStudents.json?ref=main`,
          {
            headers: {
              'Accept': 'application/vnd.github.raw+json',
              'User-Agent': 'GDG-NECN-LiveSync'
            },
            cache: 'no-store'
          }
        );
        if (apiRes.ok) {
          liveStudents = await apiRes.json();
        }
      } catch {}

      // Fallback: raw.githubusercontent.com with cache-busting timestamp
      if (!liveStudents || !Array.isArray(liveStudents)) {
        const rawUrl = `https://raw.githubusercontent.com/shaiksameer2431-maker/GDG-OC-NECN/main/Frontend/src/data/initialStudents.json?t=${Date.now()}`;
        const res = await fetch(rawUrl, { cache: 'no-store' });
        if (res.ok) {
          liveStudents = await res.json();
        }
      }

      if (!liveStudents || !Array.isArray(liveStudents) || liveStudents.length === 0) return false;

      // Fingerprint current vs incoming data
      const currentRedeemed = this.students.filter(s => s.redemptionStatus === 'Redeemed').length;
      const liveRedeemed = liveStudents.filter((s: Student) => s.redemptionStatus === 'Redeemed').length;
      const currentBadges = this.students.reduce((acc, s) => acc + (s.skillBadgeCount || 0), 0);
      const liveBadges = liveStudents.reduce((acc: number, s: Student) => acc + (s.skillBadgeCount || 0), 0);
      const currentPts = this.students.reduce((acc, s) => acc + (s.points || 0), 0);
      const livePts = liveStudents.reduce((acc: number, s: Student) => acc + (s.points || 0), 0);

      const hasChanged = force ||
        liveRedeemed !== currentRedeemed ||
        liveBadges !== currentBadges ||
        livePts !== currentPts ||
        liveStudents.length !== this.students.length ||
        (liveStudents[0]?.fullName !== this.students[0]?.fullName);

      if (hasChanged) {
        this.students = liveStudents;
        this.recalculateRanks();
        this.saveStudents();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('necn_live_data_synced'));
        }
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Live GitHub data sync error:', e);
      return false;
    }
  }

  // Force trigger live sync
  public async forceSyncLive(): Promise<boolean> {
    return this.fetchLiveGitHubData(true);
  }
}

export const storageService = new StorageService();
