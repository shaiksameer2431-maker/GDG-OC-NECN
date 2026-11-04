# NECN CLOUD CHAMPIONS
## Premium Google Cloud Learning & Achievement Portal
### GDG On Campus – Narayana Engineering College, Nellore (NECN)
**Program:** Google Cloud Learn with Communities 2026  
**Tagline:** *Learn. Build. Earn. Achieve.*

---

## 🌟 Overview

**NECN Cloud Champions** is an Apple-inspired web portal engineered specifically for **Google Developer Groups (GDG) On Campus at Narayana Engineering College, Nellore (NECN)**. 

Built to celebrate, track, and amplify the achievements of **438 registered engineering students** enrolled in the *Google Cloud Learn with Communities 2026* campaign, this portal blends **Apple-tier frosted glassmorphism**, responsive bento grids, real-time analytics, and enterprise data security.

---

## 🎨 Visual Design Architecture (Apple Glassmorphism)

Crafted in strict adherence to WWDC principles and high-end agency standards:
- **Frosted Glassmorphism:** Translucent glass cards with multi-layer backdrop blurs (`backdrop-blur-xl`), sub-pixel 1px hairlines (`border-white/10`), and nested double-bezel enclosures (`apple-card-outer` + `apple-card-inner`).
- **Calibrated Color Spectrum:**
  - Deep Midnight Navy (`#030712`, `#0F172A`)
  - Apple Electric Sapphire Blue (`#0071E3`, `#38BDF8`)
  - Champagne Gold (`#F59E0B`, `#FBBF24`) for Top Champions & Milestone 3
  - Emerald Green (`#10B981`) for Redeemed Codes and Verified Credentials
  - Amber (`#F59E0B`) for In-Progress modules and pending activations
- **Fluid Micro-Interactions:** Subtle scale transitions, responsive hover glows, and SVG circular progress meters.
- **System Typography:** Clean `Plus Jakarta Sans` with monospace tabular figures for scores and metrics.

---

## 🛡️ Critical Data Security & Zero-Leak Protocol

The portal implements enterprise privacy standards for student data:
1. **Public View Sanitization:** Public students list (`src/data/initialStudents.json`) contains **ZERO access codes** and **ZERO personal emails**.
2. **Encrypted Admin Security Vault:** Access codes and email addresses are segregated into a protected vault (`student_private_vault` / `adminVault.json`), accessible exclusively to authenticated administrators.
3. **Deterministic Scoring & Tie-Breaking:**
   - **Milestone 3:** +300 points
   - **Milestone 2:** +200 points
   - **Milestone 1:** +100 points
   - **Skill Badges:** +50 points per badge (up to 500 points for 10 badges)
   - **Verified Profiles:** +20 points for Google Skills / Developer profile verification
   - *Tie-Breaking Priority:* Higher Points → Higher Badge Count → Higher Milestone → Verified Profile → Alphabetical.
   - *Rule:* Students are never ranked on access-code redemption alone.

---

## 📊 Initial Cohort Verification Snapshot (04 Nov)

All 438 student records from `GDGC-NECNL [04 Nov].csv` have been imported and verified:
- **Total Registered Students:** 438
- **Access Codes Redeemed:** 168 (38.4%)
- **Access Codes Pending:** 270 (61.6%)
- **Total Skill Badges Completed:** 166
- **Milestone 3 Champions (10 Badges):** 8
- **Milestone 2 Achievers (6 Badges):** 6
- **Milestone 1 Achievers (2 Badges):** 6
- **No Milestone Yet:** 418
- **Top 1 Leader:** Annam Mohith (820 pts)
- **Top 2 Leader:** Bheemireddy Risheetha (820 pts)
- **Top 3 Leader:** G BHAVANA (820 pts)

---

## 🚀 Key Portal Features

### 1. Landing & Overview (`/`)
- Dynamic Hero with live achievement counters.
- Top-Three Achievers Leadership Podium (Gold, Silver, Bronze pedestals).
- Real-time cohort analytics cards.
- Milestone distribution tiers breakdown.
- Curriculum highlights.

### 2. Cohort Leaderboard (`/leaderboard`)
- Fast search by student name or student ID (`necn-xxx`).
- Multi-filter toolbar (Redeemed/Not Redeemed, Milestone Tiers, Badge Count Ranges).
- Dynamic sorting by Rank, Verified Points, Badge Count, or Alphabetical.
- Pagination with 25, 50, 100, or All students per view.
- 1-click export to CSV and Excel (`.xlsx`).
- Click any student to open their dedicated profile page.

### 3. Student Achievement Profiles (`/students/:id`)
- Personalized rank badge, achievement level title, and Google Skills profile direct link.
- Bento-grid metrics: Access code status, Milestone achieved, Skill badges earned.
- Verified badges portfolio displaying unlocked badges.
- 10-course tracker with status pills.
- Interactive student self-submission dialog for lab completion verification.

### 4. Official 10-Course Curriculum Journey (`/journey`)
- Comprehensive syllabus covering all 10 official Google Cloud courses:
  1. *The Basics of Google Cloud Compute* (ID: 754)
  2. *Configure Service Accounts and IAM Roles for Google Cloud* (ID: 702)
  3. *Implement Speech and Language Solutions with Pre-trained APIs* (ID: 700)
  4. *Develop AI-Powered Prototypes in Google AI Studio* (ID: 1426)
  5. *Analyze Images with the Cloud Vision API* (ID: 633)
  6. *Build a Website on Google Cloud* (ID: 638)
  7. *Create Your First Gemini Enterprise Application* (ID: 1586)
  8. *Store, Process, and Manage Data on Google Cloud - Console* (ID: 658)
  9. *Using the Google Cloud Speech API* (ID: 756)
  10. *Explore Generative AI in Agent Platform* (ID: 959)
- Personalized Student Progress Viewer with instant name lookup.
- Direct external links to official Google Cloud Skills Boost lab templates.

### 5. Achievements & Rewards Gallery (`/achievements`)
- **Wall of Champions:** Spotlighting the elite 8 students with Milestone 3 & 10 badges.
- **Swag & Rewards Thresholds:** Configured perks for Champion, Specialist, and Explorer tiers.
- **Credentials Catalog:** Breakdown of cohort earners per badge.

### 6. Admin Command Center (`/admin`)
- Master-Key authentication (`necn2026admin` / `gdgnecn2026`).
- **CSV & Excel Import Engine:** Drag-and-drop file uploader with smart duplicate matching, inserted/updated/unchanged/rejected statistics, and protection against accidental progress overwrites.
- **Student Editor:** Inline modal editor to update milestones, badges, profiles, and redemption status.
- **Course Tracker:** Module status editor for individual students.
- **Admin Security Vault:** Exclusive restricted view of registered emails and access codes.
- **Visual Analytics:** Interactive Recharts Pie and Bar charts.
- **Audit History:** Full log of all import runs.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Motion & Physics:** Framer Motion (critically damped springs)
- **Icons:** Lucide React (feather-light stroke lines)
- **Data Visualizations:** Recharts
- **Spreadsheet Processing:** PapaParse (CSV) + XLSX (Excel)
- **Celebrations:** Canvas-Confetti
- **Backend Architecture:** Supabase / PostgreSQL schema with Row Level Security (RLS)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended, tested on v22)
- npm or yarn

### Installation
```bash
# Clone or navigate to project directory
cd "GDG Learn with communities"

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Automated Test Suite
```bash
node scripts/testSuite.js
```
*Expected: 21 / 21 Tests Passed (100% Success).*

### Building for Production
```bash
npm run build
```

---

## 🗄️ Database Schema & Supabase Setup

The complete production SQL migration is located at:
`supabase/schema.sql`

To deploy to Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `supabase/schema.sql` and run.
4. Copy your **Project URL** and **Anon Key** into `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
*(Note: The application is pre-seeded with all 438 student records and runs completely offline or on client-side free-tier hosting even without Supabase!)*

---

## 🌐 Production Deployment

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Build command: `npm run build`
4. Output directory: `dist`

### Deploy to Netlify
1. Run `netlify deploy --prod --dir=dist`

---

## 🏫 Campus Credits

- **Host Institution:** Narayana Engineering College, Nellore (NECN)
- **Chapter:** Google Developer Groups On Campus NECN
- **Program:** Google Cloud Learn with Communities 2026
- **Lead Contact:** `gdg.necn@narayanagroup.com`
