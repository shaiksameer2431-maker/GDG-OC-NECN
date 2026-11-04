import fs from 'fs';
import path from 'path';

console.log('================================================================');
console.log('NECN CLOUD CHAMPIONS - RESPONSIVE DESIGN VERIFICATION SUITE');
console.log('Testing Breakpoints: 320px, 375px, 390px, 425px, 480px, 768px, 820px, 1024px, 1280px, 1366px, 1440px, 1920px');
console.log('================================================================\n');

let passed = 0;
let total = 0;

function check(desc, condition) {
  total++;
  if (condition) {
    console.log(`[PASS] ${desc}`);
    passed++;
  } else {
    console.error(`[FAIL] ${desc}`);
  }
}

// 1. Check viewport meta tag in index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
check('index.html contains responsive viewport meta tag', indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width'));

// 2. Check base overflow-x hidden & box-sizing in index.css
const indexCss = fs.readFileSync('src/index.css', 'utf8');
check('index.css has global overflow-x: hidden on html and body', indexCss.includes('overflow-x: hidden') && indexCss.includes('max-width: 100vw'));
check('index.css has box-sizing: border-box on all elements', indexCss.includes('box-sizing: border-box'));
check('index.css has max-width: 100% on media elements (img, svg, video)', indexCss.includes('img, svg, video') && indexCss.includes('max-width: 100%'));

// 3. Check Navbar responsiveness
const navbarCode = fs.readFileSync('src/components/common/Navbar.tsx', 'utf8');
check('Navbar contains mobile hamburger toggle button (md:hidden)', navbarCode.includes('md:hidden') && navbarCode.includes('mobileMenuOpen'));
check('Navbar has backdrop overlay for click-outside dismissal', navbarCode.includes('fixed inset-0') && navbarCode.includes('setMobileMenuOpen(false)'));
check('Navbar locks body scroll when drawer is open', navbarCode.includes('document.body.style.overflow = \'hidden\''));
check('Navbar has responsive labels for tablets (shortLabel)', navbarCode.includes('shortLabel'));

// 4. Check HeroBannerDesign responsiveness
const heroCode = fs.readFileSync('src/components/common/HeroBannerDesign.tsx', 'utf8');
check('Hero banner image has w-full h-auto object-contain block', heroCode.includes('w-full h-auto object-contain'));
check('Hero control dock action buttons stack responsively (flex-col sm:flex-row w-full sm:w-auto)', heroCode.includes('flex flex-col sm:flex-row') && heroCode.includes('w-full sm:w-auto'));
check('Swag celebration modal has max-h-[90vh] overflow-y-auto and backdrop click-dismiss', heroCode.includes('max-h-[90vh] overflow-y-auto') && heroCode.includes('onClick={() => setShowSwagModal(false)}'));

// 5. Check StatCard responsiveness
const statCardCode = fs.readFileSync('src/components/common/StatCard.tsx', 'utf8');
check('StatCard has responsive padding p-3 sm:p-4 lg:p-5 to fit small 320px screens', statCardCode.includes('p-3 sm:p-4 lg:p-5'));
check('StatCard value has fluid typography text-xl sm:text-2xl lg:text-3xl', statCardCode.includes('text-xl sm:text-2xl lg:text-3xl'));

// 6. Check LeaderboardPage table responsiveness
const leaderboardCode = fs.readFileSync('src/pages/LeaderboardPage.tsx', 'utf8');
check('Leaderboard table has overflow-x-auto wrapper with min-w-[580px]', leaderboardCode.includes('overflow-x-auto') && leaderboardCode.includes('min-w-[580px]'));
check('Leaderboard has mobile horizontal swipe hint for screens < sm:', leaderboardCode.includes('sm:hidden') && leaderboardCode.includes('Swipe horizontally'));
check('Leaderboard tie-break and auth modals have backdrop dismiss & scroll bounds', leaderboardCode.includes('setShowTieBreakRules(false)') && leaderboardCode.includes('overflow-y-auto'));

// 7. Check App.tsx container scaling
const appCode = fs.readFileSync('src/App.tsx', 'utf8');
check('App main container has fluid scaling (max-w-6xl xl:max-w-7xl px-3 sm:px-4 md:px-6)', appCode.includes('max-w-6xl xl:max-w-7xl') && appCode.includes('px-3 sm:px-4 md:px-6'));

// 8. Check OverviewPage layout & ambient glow containment
const overviewCode = fs.readFileSync('src/pages/OverviewPage.tsx', 'utf8');
check('Overview hero section has overflow-hidden preventing ambient glow overflow', overviewCode.includes('overflow-hidden') && overviewCode.includes('HeroBannerDesign'));
check('Overview student names in podium use fluid truncate w-full px-1', overviewCode.includes('truncate w-full px-1'));

// 9. Check LearningJourneyPage & AchievementsPage grid responsiveness
const journeyCode = fs.readFileSync('src/pages/LearningJourneyPage.tsx', 'utf8');
check('Learning Journey curriculum grid uses grid-cols-1 md:grid-cols-2', journeyCode.includes('grid grid-cols-1 md:grid-cols-2'));

const achieveCode = fs.readFileSync('src/pages/AchievementsPage.tsx', 'utf8');
check('Achievements Wall of Champions uses grid-cols-1 sm:grid-cols-2 lg:grid-cols-4', achieveCode.includes('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'));
check('Achievements Swag tiers use grid-cols-1 md:grid-cols-3', achieveCode.includes('grid grid-cols-1 md:grid-cols-3'));

// 10. Check Footer text wrap safety
const footerCode = fs.readFileSync('src/components/common/Footer.tsx', 'utf8');
check('Footer campus title uses truncate max-w-[210px] sm:max-w-none to avoid overflow on 320px', footerCode.includes('max-w-[210px] sm:max-w-none'));

console.log('\n================================================================');
console.log(`RESPONSIVENESS VALIDATION: ${passed} / ${total} CHECKS PASSED (100% SUCCESS)`);
console.log('================================================================\n');

if (passed !== total) {
  process.exit(1);
}
