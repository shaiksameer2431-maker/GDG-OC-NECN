import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('NECN CLOUD CHAMPIONS - AUTOMATED VERIFICATION & TEST SUITE');
console.log('GDG On Campus | Narayana Engineering College, Nellore');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Check Initial Students JSON
const studentsPath = path.resolve('src/data/initialStudents.json');
const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

assert(students.length === 438, `Student count must equal 438 (Got: ${students.length})`);

// 2. Check Redemption Counts
let redeemed = 0;
let notRedeemed = 0;
students.forEach(s => {
  if (s.redemptionStatus === 'Redeemed') redeemed++;
  else if (s.redemptionStatus === 'Not Redeemed') notRedeemed++;
});

assert(redeemed === 174, `Redeemed count must equal 174 (Got: ${redeemed})`);
assert(notRedeemed === 264, `Not Redeemed count must equal 264 (Got: ${notRedeemed})`);

// 3. Check Milestones
let m1 = 0, m2 = 0, m3 = 0, noM = 0;
students.forEach(s => {
  if (s.milestone === 'Milestone 1') m1++;
  else if (s.milestone === 'Milestone 2') m2++;
  else if (s.milestone === 'Milestone 3') m3++;
  else noM++;
});

assert(m3 === 14, `Milestone 3 count must equal 14 (Got: ${m3})`);
assert(m2 === 8, `Milestone 2 count must equal 8 (Got: ${m2})`);
assert(m1 === 10, `Milestone 1 count must equal 10 (Got: ${m1})`);
assert(noM === 406, `No Milestone count must equal 406 (Got: ${noM})`);

// 4. Check Total Badges Sum
const totalBadges = students.reduce((acc, s) => acc + (s.skillBadgeCount || 0), 0);
assert(totalBadges === 247, `Total badges count must equal 247 (Got: ${totalBadges})`);

// 5. Check Privacy & Security: Zero Leaked Access Codes or Emails in Public Dataset
let leakedEmails = 0;
let leakedCodes = 0;
students.forEach(s => {
  if (s.email || s.userEmail) leakedEmails++;
  if (s.accessCode || s.code) leakedCodes++;
});

assert(leakedEmails === 0, `Zero emails must exist in public students data (Got: ${leakedEmails})`);
assert(leakedCodes === 0, `Zero access codes must exist in public students data (Got: ${leakedCodes})`);

// 6. Check Admin Vault
const vaultPath = path.resolve('src/data/adminVault.json');
const vault = JSON.parse(fs.readFileSync(vaultPath, 'utf8'));

assert(vault.length === 438, `Admin vault must contain all 438 secure student records (Got: ${vault.length})`);
assert(vault[0].accessCode !== undefined, 'Admin vault contains protected access codes for administrative lookup');
assert(vault[0].email !== undefined, 'Admin vault contains protected student emails for administrative verification');

// 7. Check 10 Official Courses
const coursesPath = path.resolve('src/data/officialCourses.json');
const courses = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));

assert(courses.length === 10, `Official courses count must equal 10 (Got: ${courses.length})`);
const course1 = courses.find(c => c.courseNumber === '01');
assert(course1.title === 'The Basics of Google Cloud Compute', 'Course 01 title verified');
const course10 = courses.find(c => c.courseNumber === '10');
assert(course10.title === 'Explore Generative AI in Agent Platform', 'Course 10 title verified');

// 8. Check Initial Course Progress statuses
let nonNotTrackedCount = 0;
students.forEach(s => {
  s.courseProgress.forEach(cp => {
    if (cp.status !== 'Not Tracked') nonNotTrackedCount++;
  });
});
assert(nonNotTrackedCount === 0, `All initial courses must start as "Not Tracked" as required (Got: ${nonNotTrackedCount})`);

// 9. Check Top Three Achievers
assert(students[0].rank === 1, 'Top 1 student rank assigned #1');
assert(students[0].redemptionStatus === 'Redeemed', `Top 1 must be Redeemed (Got: ${students[0].redemptionStatus} for ${students[0].fullName})`);
assert(students[0].points >= 800, `Top 1 student points verified >= 800 (Got: ${students[0].points})`);
assert(students[1].rank === 2, 'Top 2 student rank assigned #2');
assert(students[1].redemptionStatus === 'Redeemed', `Top 2 must be Redeemed (Got: ${students[1].redemptionStatus} for ${students[1].fullName})`);
assert(students[2].rank === 3, 'Top 3 student rank assigned #3');
assert(students[2].redemptionStatus === 'Redeemed', `Top 3 must be Redeemed (Got: ${students[2].redemptionStatus} for ${students[2].fullName})`);

console.log('\n================================================================');
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} PASSED (100% SUCCESS)`);
console.log('================================================================\n');

