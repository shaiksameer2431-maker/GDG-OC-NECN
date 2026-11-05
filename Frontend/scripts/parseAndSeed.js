import fs from 'fs';
import path from 'path';

const csvFilePath = path.resolve('GDGC-NECNL [04 Nov].csv');
const rawContent = fs.readFileSync(csvFilePath, 'utf8');

// The 10 official courses & badges
export const OFFICIAL_COURSES = [
  {
    id: 1,
    courseNumber: '01',
    title: 'The Basics of Google Cloud Compute',
    url: 'https://www.skills.google/course_templates/754',
    category: 'Compute & Infrastructure',
    iconName: 'Server',
    estimatedHours: '4h',
    badgeName: 'The Basics of Google Cloud Compute'
  },
  {
    id: 2,
    courseNumber: '02',
    title: 'Configure Service Accounts and IAM Roles for Google Cloud',
    url: 'https://www.skills.google/course_templates/702',
    category: 'Security & IAM',
    iconName: 'ShieldCheck',
    estimatedHours: '5h',
    badgeName: 'Configure Service Accounts and IAM Roles for Google Cloud'
  },
  {
    id: 3,
    courseNumber: '03',
    title: 'Implement Speech and Language Solutions with Pre-trained APIs',
    url: 'https://www.skills.google/course_templates/700',
    category: 'AI & Speech',
    iconName: 'Mic',
    estimatedHours: '4h',
    badgeName: 'Implement Speech and Language Solutions with Pre-trained APIs'
  },
  {
    id: 4,
    courseNumber: '04',
    title: 'Develop AI-Powered Prototypes in Google AI Studio',
    url: 'https://www.skills.google/course_templates/1426',
    category: 'Generative AI',
    iconName: 'Sparkles',
    estimatedHours: '3h',
    badgeName: 'Develop AI-Powered Prototypes in Google AI Studio'
  },
  {
    id: 5,
    courseNumber: '05',
    title: 'Analyze Images with the Cloud Vision API',
    url: 'https://www.skills.google/course_templates/633',
    category: 'Computer Vision',
    iconName: 'Image',
    estimatedHours: '4h',
    badgeName: 'Analyze Images with the Cloud Vision API'
  },
  {
    id: 6,
    courseNumber: '06',
    title: 'Build a Website on Google Cloud',
    url: 'https://www.skills.google/course_templates/638',
    category: 'Web & Hosting',
    iconName: 'Globe',
    estimatedHours: '5h',
    badgeName: 'Build a Website on Google Cloud'
  },
  {
    id: 7,
    courseNumber: '07',
    title: 'Create Your First Gemini Enterprise Application',
    url: 'https://www.skills.google/course_templates/1586/',
    category: 'Enterprise AI',
    iconName: 'Bot',
    estimatedHours: '6h',
    badgeName: 'Create Your First Gemini Enterprise Application'
  },
  {
    id: 8,
    courseNumber: '08',
    title: 'Store, Process, and Manage Data on Google Cloud - Console',
    url: 'https://www.skills.google/course_templates/658',
    category: 'Data & Databases',
    iconName: 'Database',
    estimatedHours: '5h',
    badgeName: 'Store, Process, and Manage Data on Google Cloud - Console'
  },
  {
    id: 9,
    courseNumber: '09',
    title: 'Using the Google Cloud Speech API',
    url: 'https://www.skills.google/course_templates/756',
    category: 'Audio & NLP',
    iconName: 'Volume2',
    estimatedHours: '3h',
    badgeName: 'Using the Google Cloud Speech API'
  },
  {
    id: 10,
    courseNumber: '10',
    title: 'Explore Generative AI in Agent Platform',
    url: 'https://www.skills.google/course_templates/959',
    category: 'Autonomous Agents',
    iconName: 'Cpu',
    estimatedHours: '4h',
    badgeName: 'Explore Generative AI in Agent Platform'
  }
];

function parseCSV(content) {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === '\n' || (char === '\r' && content[i + 1] === '\n')) && !inQuotes) {
      if (char === '\r') i++;
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) lines.push(currentLine);

  function parseFields(line) {
    const fields = [];
    let cur = '';
    let inQ = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        if (inQ && line[j + 1] === '"') {
          cur += '"';
          j++;
        } else {
          inQ = !inQ;
        }
      } else if (c === ',' && !inQ) {
        fields.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
    fields.push(cur);
    return fields.map(f => f.trim());
  }

  const rawHeaders = parseFields(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const f = parseFields(lines[i]);
    const obj = {};
    rawHeaders.forEach((h, idx) => {
      obj[h] = f[idx] || '';
    });
    rows.push(obj);
  }
  return rows;
}

const rows = parseCSV(rawContent);
console.log(`Parsed ${rows.length} rows.`);

// Parse badge names with accuracy
function extractBadgeList(badgeNamesRaw) {
  if (!badgeNamesRaw || !badgeNamesRaw.trim()) return [];
  const raw = badgeNamesRaw.trim();
  const matched = [];

  // Match against known 10 badges
  for (const c of OFFICIAL_COURSES) {
    if (raw.includes(c.badgeName)) {
      matched.push(c.badgeName);
    }
  }

  // If no match found but string present, fallback to clean commas
  if (matched.length === 0 && raw.length > 0) {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
  return matched;
}

// Calculate points
function calculatePoints(student) {
  let pts = 0;
  // Milestone points
  if (student.milestone === 'Milestone 3') pts += 300;
  else if (student.milestone === 'Milestone 2') pts += 200;
  else if (student.milestone === 'Milestone 1') pts += 100;

  // Badge points: 50 each
  pts += (student.skillBadgeCount || 0) * 50;

  // Verified Profile bonus
  if (student.googleSkillsProfileStatus === 'All Good') pts += 20;
  if (student.googleDeveloperProfileStatus === 'All Good') pts += 20;

  return pts;
}

// Stats tracking
let redeemedCount = 0;
let notRedeemedCount = 0;
const milestoneDistribution = {
  'Milestone 1': 0,
  'Milestone 2': 0,
  'Milestone 3': 0,
  'No Milestone': 0
};
let totalBadgesSum = 0;

const publicStudents = [];
const adminVault = [];

rows.forEach((r, idx) => {
  const rawRedemption = r['Access Code Redemption Status'] || '';
  const isRedeemed = rawRedemption.trim().toLowerCase() === 'yes';
  const redemptionStatus = isRedeemed ? 'Redeemed' : 'Not Redeemed';
  
  if (isRedeemed) redeemedCount++;
  else notRedeemedCount++;

  let ms = r['Milestone Completed'] ? r['Milestone Completed'].trim() : 'No Milestone';
  if (!ms || ms.toLowerCase() === 'no milestone' || ms.toLowerCase() === 'none') {
    ms = 'No Milestone';
  }
  milestoneDistribution[ms] = (milestoneDistribution[ms] || 0) + 1;

  const badgeCount = parseInt(r['Skill Badges Completed Count'] || '0', 10) || 0;
  totalBadgesSum += badgeCount;

  const badgeList = extractBadgeList(r['Skill Badges Completed Names'] || '');

  // Stable ID
  const id = `necn-${String(idx + 1).padStart(3, '0')}`;
  const fullName = r['User Name'] ? r['User Name'].trim() : 'Anonymous Student';
  
  // Public student model
  const student = {
    id,
    fullName,
    googleSkillsProfileUrl: r['Google Skills Profile URL'] || '',
    googleSkillsProfileStatus: r['Google Skills Profile Status'] || 'Not applicable',
    googleDeveloperProfileUrl: r['Google Developer Profile URL'] || '',
    googleDeveloperProfileStatus: r['Google Developer Profile Status'] || 'Not applicable',
    redemptionStatus,
    milestone: ms,
    gearBadges: r['GEAR Digital Badges'] || 'Not applicable',
    skillBadgeCount: badgeCount,
    skillBadges: badgeList,
    points: 0,
    rank: 0,
    // Official 10 courses progress, initially 'Not Tracked' as required
    courseProgress: OFFICIAL_COURSES.map(course => ({
      courseId: course.id,
      courseTitle: course.title,
      status: 'Not Tracked', // 'Not Tracked' | 'Not Started' | 'In Progress' | 'Completed'
      completedAt: null
    }))
  };

  student.points = calculatePoints(student);
  publicStudents.push(student);

  // Private Admin Vault Record
  adminVault.push({
    studentId: id,
    fullName,
    email: r['User Email'] ? r['User Email'].trim() : '',
    accessCode: r['Access Code'] ? r['Access Code'].trim() : '',
    redemptionStatus,
    importedAt: new Date().toISOString()
  });
});

// Deterministic Sorting & Ranking
// 1. Points (desc)
// 2. Skill Badges (desc)
// 3. Milestone tier (Milestone 3 > 2 > 1 > No Milestone)
// 4. Google Skills Profile Status ('All Good' > others)
// 5. Alphabetical by Full Name
function getMilestoneRank(m) {
  if (m === 'Milestone 3') return 3;
  if (m === 'Milestone 2') return 2;
  if (m === 'Milestone 1') return 1;
  return 0;
}

publicStudents.sort((a, b) => {
  // 1. OFFICIAL COHORT REDEMPTION PRIORITY #1:
  // In Google Cloud Learn with Communities, a student MUST redeem their official cohort
  // access code to be eligible for the official cohort podium, swags, and ranking.
  // Redeemed students ALWAYS rank ahead of unredeemed students!
  const aRedeemed = a.redemptionStatus === 'Redeemed';
  const bRedeemed = b.redemptionStatus === 'Redeemed';
  if (aRedeemed !== bRedeemed) {
    return aRedeemed ? -1 : 1;
  }

  // 2. Points (desc)
  if (b.points !== a.points) return b.points - a.points;

  // 3. Skill Badges (desc)
  if (b.skillBadgeCount !== a.skillBadgeCount) return b.skillBadgeCount - a.skillBadgeCount;

  // 4. Milestone tier (Milestone 3 > 2 > 1 > No Milestone)
  const mDiff = getMilestoneRank(b.milestone) - getMilestoneRank(a.milestone);
  if (mDiff !== 0) return mDiff;

  // 5. Google Skills Profile Status ('All Good' > others)
  if ((b.googleSkillsProfileStatus === 'All Good') !== (a.googleSkillsProfileStatus === 'All Good')) {
    return b.googleSkillsProfileStatus === 'All Good' ? 1 : -1;
  }

  // 6. Alphabetical by Full Name
  return a.fullName.localeCompare(b.fullName);
});

// Assign ranks
publicStudents.forEach((s, idx) => {
  s.rank = idx + 1;
});

console.log('=== VERIFICATION SUMMARY ===');
console.log(`Total students: ${publicStudents.length}`);
console.log(`Redeemed: ${redeemedCount} (Expected: 174)`);
console.log(`Not Redeemed: ${notRedeemedCount} (Expected: 264)`);
console.log(`Milestones:`, milestoneDistribution);
console.log(`Total Skill Badges Earned: ${totalBadgesSum}`);
console.log(`Top 5 Students:`);
publicStudents.slice(0, 5).forEach(s => {
  console.log(`  #${s.rank} [${s.redemptionStatus}] ${s.fullName} - Points: ${s.points}, Badges: ${s.skillBadgeCount}, Milestone: ${s.milestone}`);
});

// Save to src/data
const dataDir = path.resolve('src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'initialStudents.json'), JSON.stringify(publicStudents, null, 2));
fs.writeFileSync(path.join(dataDir, 'adminVault.json'), JSON.stringify(adminVault, null, 2));
fs.writeFileSync(path.join(dataDir, 'officialCourses.json'), JSON.stringify(OFFICIAL_COURSES, null, 2));

console.log('Successfully written initial data files to src/data/');

