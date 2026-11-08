// ==============================================================================
// NECN CLOUD CHAMPIONS - SQLite CSV Ingestion & Sync Engine
// GDG On Campus | Narayana Engineering College, Nellore
// Usage: node scripts/importCsvToSqlite.js "path/to/sheet.csv"
// ==============================================================================

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../database.sqlite');
const STUDENTS_JSON = path.resolve(__dirname, '../src/data/initialStudents.json');
const VAULT_JSON = path.resolve(__dirname, '../src/data/adminVault.json');
const COURSES_JSON = path.resolve(__dirname, '../src/data/officialCourses.json');

const csvArg = process.argv[2];
if (!csvArg) {
  console.error('❌ Please provide the CSV file path. Example:\nnode scripts/importCsvToSqlite.js "C:/path/to/GDGC-NECNL [08 Nov].csv"');
  process.exit(1);
}

const csvPath = path.resolve(process.cwd(), csvArg);
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found at: ${csvPath}`);
  process.exit(1);
}

console.log(`📂 Ingesting CSV into SQLite from: ${csvPath}`);

const db = new DatabaseSync(DB_PATH);
const courses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf-8'));

const extractBadges = (raw) => {
  if (!raw || !raw.trim()) return [];
  const text = raw.trim();
  const matched = [];
  courses.forEach(c => {
    if (text.includes(c.badgeName)) matched.push(c.badgeName);
  });
  if (matched.length === 0 && text.length > 0) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }
  return matched;
};

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
const rows = parsed.data;

console.log(`🔍 Processing ${rows.length} rows from CSV...`);

let inserted = 0;
let updated = 0;
let unchanged = 0;

// Read existing students & vault from SQLite
const existingStudents = db.prepare('SELECT * FROM students').all();
const existingVault = db.prepare('SELECT * FROM admin_vault').all();

const studentMap = new Map();
existingStudents.forEach(s => {
  studentMap.set(s.id, {
    ...s,
    skill_badges: JSON.parse(s.skill_badges || '[]'),
    course_progress: JSON.parse(s.course_progress || '[]')
  });
});

const vaultMap = new Map();
existingVault.forEach(v => {
  vaultMap.set(v.student_id, v);
});

rows.forEach((r, idx) => {
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

  if (!name && !email) return;

  // Match by email via vault or name
  let matchedStudentId = null;
  for (const [sId, v] of vaultMap.entries()) {
    if (email && v.email && v.email.toLowerCase() === email) {
      matchedStudentId = sId;
      break;
    }
  }
  if (!matchedStudentId) {
    for (const [sId, s] of studentMap.entries()) {
      if (s.full_name.toLowerCase() === name.toLowerCase()) {
        matchedStudentId = sId;
        break;
      }
    }
  }

  const isRedeemed = redemptionRaw.toLowerCase() === 'yes' || redemptionRaw.toLowerCase() === 'redeemed';
  const redemptionStatus = isRedeemed ? 'Redeemed' : 'Not Redeemed';
  const badgeCount = parseInt(badgeCountRaw, 10) || 0;
  const parsedBadges = extractBadges(badgeNamesRaw);

  if (matchedStudentId && studentMap.has(matchedStudentId)) {
    const s = studentMap.get(matchedStudentId);
    let changed = false;

    if (name && s.full_name !== name) { s.full_name = name; changed = true; }
    if (skillsUrl && s.google_skills_profile_url !== skillsUrl) { s.google_skills_profile_url = skillsUrl; changed = true; }
    if (skillsStatus && s.google_skills_profile_status !== skillsStatus) { s.google_skills_profile_status = skillsStatus; changed = true; }
    if (devUrl && s.google_developer_profile_url !== devUrl) { s.google_developer_profile_url = devUrl; changed = true; }
    if (redemptionStatus !== s.redemption_status) { s.redemption_status = redemptionStatus; changed = true; }
    if (milestoneRaw && s.milestone !== milestoneRaw) { s.milestone = milestoneRaw; changed = true; }
    if (badgeCount !== s.skill_badge_count) { s.skill_badge_count = badgeCount; changed = true; }
    if (parsedBadges.length > 0) { s.skill_badges = parsedBadges; changed = true; }
    if (gearBadges && s.gear_badges !== gearBadges) { s.gear_badges = gearBadges; changed = true; }

    const v = vaultMap.get(matchedStudentId);
    if (v) {
      if (email && v.email !== email) v.email = email;
      if (accessCode && v.access_code !== accessCode) v.access_code = accessCode;
      v.redemption_status = redemptionStatus;
    }

    if (changed) {
      s.updated_at = new Date().toISOString();
      updated++;
    } else {
      unchanged++;
    }
  } else {
    const newId = `necn-${String(studentMap.size + 1).padStart(3, '0')}`;
    const newStudent = {
      id: newId,
      full_name: name || 'New Student',
      google_skills_profile_url: skillsUrl,
      google_skills_profile_status: skillsStatus,
      google_developer_profile_url: devUrl,
      google_developer_profile_status: devStatus,
      redemption_status: redemptionStatus,
      milestone: milestoneRaw || 'No Milestone',
      gear_badges: gearBadges,
      skill_badge_count: badgeCount,
      skill_badges: parsedBadges,
      points: 0,
      rank: 0,
      course_progress: courses.map(c => ({
        courseId: c.id,
        courseTitle: c.title,
        status: 'Not Tracked',
        completedAt: null
      })),
      updated_at: new Date().toISOString()
    };
    studentMap.set(newId, newStudent);
    vaultMap.set(newId, {
      student_id: newId,
      full_name: name,
      email: email,
      access_code: accessCode,
      redemption_status: redemptionStatus,
      imported_at: new Date().toISOString()
    });
    inserted++;
  }
});

// Recalculate deterministic points and ranks
const studentsList = Array.from(studentMap.values());
studentsList.forEach(s => {
  let pts = 0;
  if (s.milestone === 'Milestone 3') pts += 300;
  else if (s.milestone === 'Milestone 2') pts += 200;
  else if (s.milestone === 'Milestone 1') pts += 100;

  pts += (s.skill_badge_count || 0) * 50;
  if (s.google_skills_profile_status === 'All Good') pts += 20;
  if (s.google_developer_profile_status === 'All Good') pts += 20;
  s.points = pts;
});

const getMilestoneRank = (m) => {
  if (m === 'Milestone 3') return 3;
  if (m === 'Milestone 2') return 2;
  if (m === 'Milestone 1') return 1;
  return 0;
};

studentsList.sort((a, b) => {
  const aRedeemed = a.redemption_status === 'Redeemed';
  const bRedeemed = b.redemption_status === 'Redeemed';
  if (aRedeemed !== bRedeemed) return aRedeemed ? -1 : 1;
  if (b.points !== a.points) return b.points - a.points;
  if (b.skill_badge_count !== a.skill_badge_count) return b.skill_badge_count - a.skill_badge_count;
  const mDiff = getMilestoneRank(b.milestone) - getMilestoneRank(a.milestone);
  if (mDiff !== 0) return mDiff;
  if ((b.google_skills_profile_status === 'All Good') !== (a.google_skills_profile_status === 'All Good')) {
    return b.google_skills_profile_status === 'All Good' ? 1 : -1;
  }
  return a.full_name.localeCompare(b.full_name);
});

studentsList.forEach((s, idx) => {
  s.rank = idx + 1;
});

// Write to SQLite database
const updateSqlite = db.prepare(`
  INSERT OR REPLACE INTO students (
    id, full_name, google_skills_profile_url, google_skills_profile_status,
    google_developer_profile_url, google_developer_profile_status,
    redemption_status, milestone, gear_badges, skill_badge_count,
    skill_badges, points, rank, course_progress, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

studentsList.forEach(s => {
  updateSqlite.run(
    s.id,
    s.full_name,
    s.google_skills_profile_url || '',
    s.google_skills_profile_status || '',
    s.google_developer_profile_url || '',
    s.google_developer_profile_status || '',
    s.redemption_status,
    s.milestone,
    s.gear_badges || '',
    s.skill_badge_count || 0,
    JSON.stringify(s.skill_badges || []),
    s.points || 0,
    s.rank || 0,
    JSON.stringify(s.course_progress || []),
    s.updated_at || new Date().toISOString()
  );
});

const updateVaultSqlite = db.prepare(`
  INSERT OR REPLACE INTO admin_vault (student_id, full_name, email, access_code, redemption_status, imported_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

Array.from(vaultMap.values()).forEach(v => {
  updateVaultSqlite.run(v.student_id, v.full_name, v.email || '', v.access_code || '', v.redemption_status, v.imported_at || new Date().toISOString());
});

// Log import
const insertLog = db.prepare(`
  INSERT INTO import_logs (id, filename, file_type, inserted_count, updated_count, unchanged_count, rejected_count, imported_at, imported_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertLog.run(`imp-${Date.now()}`, path.basename(csvPath), 'CSV', inserted, updated, unchanged, 0, new Date().toISOString(), 'admin');

// Export to JSON for Vercel bundling
const exportedStudents = studentsList.map(s => ({
  id: s.id,
  fullName: s.full_name,
  googleSkillsProfileUrl: s.google_skills_profile_url,
  googleSkillsProfileStatus: s.google_skills_profile_status,
  googleDeveloperProfileUrl: s.google_developer_profile_url,
  googleDeveloperProfileStatus: s.google_developer_profile_status,
  redemptionStatus: s.redemption_status,
  milestone: s.milestone,
  gearBadges: s.gear_badges,
  skillBadgeCount: s.skill_badge_count,
  skillBadges: s.skill_badges,
  points: s.points,
  rank: s.rank,
  courseProgress: s.course_progress,
  updatedAt: s.updated_at
}));

const exportedVault = Array.from(vaultMap.values()).map(v => ({
  studentId: v.student_id,
  fullName: v.full_name,
  email: v.email,
  accessCode: v.access_code,
  redemptionStatus: v.redemption_status,
  importedAt: v.imported_at
}));

fs.writeFileSync(STUDENTS_JSON, JSON.stringify(exportedStudents, null, 2), 'utf-8');
fs.writeFileSync(VAULT_JSON, JSON.stringify(exportedVault, null, 2), 'utf-8');

// Also copy to Gdgadmin so both repos have identical latest data
const GDG_ADMIN_STUDENTS = path.resolve(__dirname, '../../Gdgadmin/src/data/initialStudents.json');
const GDG_ADMIN_VAULT = path.resolve(__dirname, '../../Gdgadmin/src/data/adminVault.json');
if (fs.existsSync(GDG_ADMIN_STUDENTS)) {
  fs.writeFileSync(GDG_ADMIN_STUDENTS, JSON.stringify(exportedStudents, null, 2), 'utf-8');
  fs.writeFileSync(GDG_ADMIN_VAULT, JSON.stringify(exportedVault, null, 2), 'utf-8');
}

const redeemedTotal = studentsList.filter(s => s.redemption_status === 'Redeemed').length;
const totalBadges = studentsList.reduce((acc, s) => acc + (s.skill_badge_count || 0), 0);
const totalMilestones = studentsList.filter(s => s.milestone !== 'No Milestone').length;

console.log(`\n======================================================`);
console.log(`✅ SQLite Ingestion Complete!`);
console.log(`📊 Total Students: ${studentsList.length}`);
console.log(`🎉 Redeemed: ${redeemedTotal} (Updated: +${updated})`);
console.log(`🏅 Total Badges: ${totalBadges}`);
console.log(`🏆 Milestones: ${totalMilestones}`);
console.log(`💾 Synced to: database.sqlite & initialStudents.json`);
console.log(`======================================================\n`);

db.close();

