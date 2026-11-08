# GDG ON CAMPUS NECN — Dedicated Admin Data Portal

This is the standalone **Admin Data Portal** for **Google Cloud Learn with Communities 2026** at **Narayana Engineering College, Nellore (NECN)**.

Per administrative security and separation requirements, all admin controls have been **completely decoupled and isolated** from the public student website.

---

## 📱 How to Access the Admin Dashboard

### 1. Online / Cloud Deployment (Mobile & Desktop)
When the website is deployed (e.g. on Vercel):
- **Public Student Website:** `https://leaderboard.vercel.app/` *(Contains ZERO admin controls)*
- **Admin Data Portal:** `https://leaderboard.vercel.app/admin` or `https://leaderboard.vercel.app/admin.html`

### 2. Local Machine (One-Click Launch)
- Double-click **`start-admin.bat`** in this folder, or run:
  ```bash
  cd Frontend
  npx vite --port 5174
  ```
  Then visit: `http://localhost:5174/admin.html`

---

## 🚀 Key Features

1. **Instant CSV & Excel Ingestion**
   - Tap **"Tap to select CSV / Excel sheet"** on your mobile device or desktop.
   - Select your official cohort progress sheet (e.g. `GDGC-NECNL [07 Nov].csv` or newer dates).
   - The dashboard **automatically parses all rows, updates points, recalculates ranks, and immediately displays the new data**.

2. **Real-Time Synchronisation**
   - Uploading a new sheet immediately refreshes the active data on screen and syncs across all open tabs/devices using shared broadcast channels and local storage.

3. **Mobile-First Student Leaderboard Cards**
   - View all 438 registered students in clean, thumb-friendly cards.
   - Filter by:
     - **All** (438)
     - **✓ Redeemed** (190)
     - **⏳ Pending** (248)
     - **🏆 Milestone 3** (23)
     - **Milestone 2** (11)
     - **Milestone 1** (12)
     - **🏅 10 Badges**
   - Tap any card to reveal protected administrative details:
     - Student Email (with 1-tap Copy)
     - Cohort Access Code (with 1-tap Copy)
     - Google Skills Profile URL (direct link)
     - Google Developer Profile URL (direct link)
     - Individual list of completed badges

4. **Data Export & Backup**
   - **Export CSV:** Downloads the latest cohort sheet.
   - **Export Excel:** Downloads formatted `.xlsx` workbook.
   - **Export JSON:** Generates `initialStudents.json` for code repository updates.
   - **Reset to Factory Seed:** Instantly restores the verified 07 Nov cohort snapshot if needed.

---

## 🔐 Administrative Master Keys
Authorized keys for access:
- `necn2026admin` (Default)
- `gdgnecn2026`
- `googlecloudnecn`
- Quick One-Tap Sign In button available on the login screen.
