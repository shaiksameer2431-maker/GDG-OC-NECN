// ==============================================================================
// NECN CLOUD CHAMPIONS - Native SQLite Database Initializer
// GDG On Campus | Narayana Engineering College, Nellore
// Uses Node 22 built-in native SQLite engine (Zero external npm packages needed)
// ==============================================================================

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../database.sqlite');
const STUDENTS_JSON = path.resolve(__dirname, '../src/data/initialStudents.json');
const VAULT_JSON = path.resolve(__dirname, '../src/data/adminVault.json');
const COURSES_JSON = path.resolve(__dirname, '../src/data/officialCourses.json');

console.log('⚡ Initializing SQLite database at:', DB_PATH);

// Create or open database
const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for performance
db.exec('PRAGMA journal_mode = WAL;');

// 1. Create courses table
db.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY,
    course_number TEXT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT,
    icon_name TEXT,
    estimated_hours TEXT,
    badge_name TEXT,
    description TEXT
  );
`);

// 2. Create public students table
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    google_skills_profile_url TEXT,
    google_skills_profile_status TEXT,
    google_developer_profile_url TEXT,
    google_developer_profile_status TEXT,
    redemption_status TEXT NOT NULL,
    milestone TEXT NOT NULL,
    gear_badges TEXT,
    skill_badge_count INTEGER DEFAULT 0,
    skill_badges TEXT, -- JSON array of badge names
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    course_progress TEXT, -- JSON array
    updated_at TEXT
  );
`);

// 3. Create private admin vault table (protected emails and access codes)
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_vault (
    student_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT,
    access_code TEXT,
    redemption_status TEXT,
    imported_at TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );
`);

// 4. Create import audit logs table
db.exec(`
  CREATE TABLE IF NOT EXISTS import_logs (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    file_type TEXT,
    inserted_count INTEGER,
    updated_count INTEGER,
    unchanged_count INTEGER,
    rejected_count INTEGER,
    imported_at TEXT,
    imported_by TEXT,
    error_summary TEXT
  );
`);

console.log('✅ SQLite schema tables created successfully.');

// Seed courses
if (fs.existsSync(COURSES_JSON)) {
  const courses = JSON.parse(fs.readFileSync(COURSES_JSON, 'utf-8'));
  const insertCourse = db.prepare(`
    INSERT OR REPLACE INTO courses (id, course_number, title, url, category, icon_name, estimated_hours, badge_name, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  courses.forEach(c => {
    insertCourse.run(c.id, c.courseNumber, c.title, c.url, c.category, c.iconName, c.estimatedHours, c.badgeName, c.description || '');
  });
  console.log(`✅ Seeded ${courses.length} official courses into SQLite.`);
}

// Seed students
if (fs.existsSync(STUDENTS_JSON)) {
  const students = JSON.parse(fs.readFileSync(STUDENTS_JSON, 'utf-8'));
  const insertStudent = db.prepare(`
    INSERT OR REPLACE INTO students (
      id, full_name, google_skills_profile_url, google_skills_profile_status,
      google_developer_profile_url, google_developer_profile_status,
      redemption_status, milestone, gear_badges, skill_badge_count,
      skill_badges, points, rank, course_progress, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  students.forEach(s => {
    insertStudent.run(
      s.id,
      s.fullName,
      s.googleSkillsProfileUrl || '',
      s.googleSkillsProfileStatus || '',
      s.googleDeveloperProfileUrl || '',
      s.googleDeveloperProfileStatus || '',
      s.redemptionStatus,
      s.milestone,
      s.gearBadges || '',
      s.skillBadgeCount || 0,
      JSON.stringify(s.skillBadges || []),
      s.points || 0,
      s.rank || 0,
      JSON.stringify(s.courseProgress || []),
      s.updatedAt || new Date().toISOString()
    );
  });
  console.log(`✅ Seeded ${students.length} students into SQLite.`);
}

// Seed admin vault
if (fs.existsSync(VAULT_JSON)) {
  const vault = JSON.parse(fs.readFileSync(VAULT_JSON, 'utf-8'));
  const insertVault = db.prepare(`
    INSERT OR REPLACE INTO admin_vault (student_id, full_name, email, access_code, redemption_status, imported_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  vault.forEach(v => {
    insertVault.run(v.studentId, v.fullName, v.email || '', v.accessCode || '', v.redemptionStatus, v.importedAt || new Date().toISOString());
  });
  console.log(`✅ Seeded ${vault.length} admin vault records into SQLite.`);
}

// Verification query
const countStudents = db.prepare('SELECT count(*) as count FROM students').get();
const countRedeemed = db.prepare("SELECT count(*) as count FROM students WHERE redemption_status = 'Redeemed'").get();
console.log(`📊 SQLite Live Summary: Total Students: ${countStudents.count} | Redeemed: ${countRedeemed.count}`);

db.close();
console.log('🎉 SQLite database ready at database.sqlite');
