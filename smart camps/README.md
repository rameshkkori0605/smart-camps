# SMART CAMPUS 🎓
> **“One Smart Platform for a Better Campus.”**

[![Hackathon Ready](https://img.shields.io/badge/Hackathon-Production--Quality-06b6d4?style=for-the-badge)](https://github.com/rameshkkori0605/smart-camps)
[![Security File Limit](https://img.shields.io/badge/Security-Strict_%3C10MB_Files-10b981?style=for-the-badge)](https://github.com/rameshkkori0605/smart-camps)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1_Compliant-3b82f6?style=for-the-badge)](https://github.com/rameshkkori0605/smart-camps)

Smart Campus is a centralized, production-grade web application built to solve fragmentations in campus communication, facility navigation, maintenance reporting, and student safety.

---

## 🚀 How Smart Campus Solves the Problem

### Problem Statement
Traditional campus systems suffer from information fragmentation across notice boards, WhatsApp groups, emails, and separate portals. Students struggle to:
- Discover campus announcements and academic schedules.
- Locate laboratories, hostels, canteens, and placement cells.
- Report broken facilities or maintenance issues and track resolution progress.
- Find 24/7 campus emergency contact numbers.

### The Solution: Problem → Solution → Real-World Impact
Smart Campus brings every essential service into **one responsive, role-based platform**:
- **Problem**: Lost or delayed maintenance complaints.  
  **Solution**: Instant issue reporting generating unique reference IDs (`SC-2026-00125`) with a 4-step real-time resolution status pipeline.
- **Problem**: Fragmented notice boards.  
  **Solution**: Categorized announcements with admin CRUD controls and priority badges.
- **Problem**: Navigation confusion for freshers and visitors.  
  **Solution**: Integrated 3D Holographic Campus Model and Google Maps navigation.
- **Problem**: Student safety risks.  
  **Solution**: One-touch SOS alert dispatcher and emergency contacts directory.

---

## 🏆 Hackathon Evaluation Criteria Mapping

| Evaluation Criterion | Implementation Details |
| :--- | :--- |
| **1. Code Quality** | Modular component architecture (`js/components/`), centralized reactive state store (`Store`), persistent local DB engine, clean separation of UI and business logic. |
| **2. Security** | **Strict 10MB per-file upload validation** (client & Git pre-commit hook), XSS input sanitization (`Security.sanitizeHTML`), role authorization checks, `.env.example` secret isolation. |
| **3. Testing** | Self-contained automated test suite (`test.html` & in-app runner) asserting Auth, Announcement filtering, Event duplicate prevention, SC-2026 ID generation, and file limits. |
| **4. Efficiency / Performance** | Zero node-build bloat, lightweight ES modules, dynamic data rendering, debounced global search, zero redundant network calls. |
| **5. Accessibility** | WCAG 2.1 compliant semantic HTML5, visible focus indicators, skip-to-content link, high contrast dark theme, full keyboard navigation. |
| **6. Google Services** | Google Maps SDK integration with coordinates + automatic 3D visual fallback canvas. |
| **7. Problem Alignment** | Addresses notice scatter, complaint tracking, navigation, and emergency safety directly. |
| **8. Real-World Interaction** | End-to-end Student Complaint (`SC-2026-XXXX`) → Admin Review & Status Update → Real-time Student Status Tracking workflow. |

---

## 🎨 UI/UX Features & Dark Mode Architecture

- **Sleek Space Dark Theme**: Deep dark backgrounds (`#0b0f19`), glassmorphism card styling, and high-contrast typography.
- **Interactive Space Cursor Light**: Dynamic particle starfield background canvas with an interactive glowing light follow orb responding to mouse movement.
- **Interactive 3D Holographic Campus Model**: Built with Three.js featuring rotating campus structures, ambient lighting attached to cursor coordinates, floating building node labels, and interactive raycasting.

---

## 📁 Repository & Folder Structure

```text
smart camps/
├── index.html                  # Main Web Application Entry Point
├── test.html                   # Dedicated Standalone Test Suite Runner Page
├── README.md                   # Complete Documentation & Hackathon Pitch
├── .env.example                # Environment Variables Isolation
├── .gitignore                  # Git Ignore rules (excludes logs & temp cache)
├── check-size.ps1              # File Size Audit Script (Verifies <10MB per file)
├── css/
│   └── style.css               # Dark Theme, Space Cursor & Glassmorphism Styling
├── js/
│   ├── app.js                  # Main Application Orchestrator & UI Router
│   ├── config.js               # Global Constants & Environment Config
│   ├── store.js                # Reactive State Store & Subscriber Bus
│   ├── db.js                   # LocalStorage Database & Seed Demo Data
│   ├── security.js             # Input Sanitization, XSS & File Upload Security (<10MB)
│   ├── 3d-campus.js            # Three.js 3D Campus Model & Holographic Canvas
│   ├── cursor-effect.js        # Cosmic Starfield & Cursor Follower Effect
│   ├── components/             # UI Components
│   │   ├── header.js           # Header Navigation & Role Switcher
│   │   ├── dashboard.js        # Dynamic Smart Dashboard & Quick Actions
│   │   ├── announcements.js    # Announcements & Admin CRUD Modal
│   │   ├── events.js           # Event Registration & Duplicate Check
│   │   ├── map.js              # Google Maps & 3D Holographic Fallback Map
│   │   ├── complaints.js       # Issue Reporting Form & Status Pipeline
│   │   ├── emergency.js        # Emergency Contacts & SOS Dispatcher
│   │   ├── services.js         # Campus Services Directory
│   │   ├── feedback.js         # Student Feedback & Review System
│   │   ├── search.js           # Global Search Results View
│   │   └── admin-analytics.js  # Admin Analytics Command Center
│   └── tests/
│       └── suite.test.js       # Automated Unit & Integration Tests Engine
```

---

## 🛠️ How to Run the Application

### Method 1: Local Browser (Zero Setup Required)
1. Double-click or open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).
2. The application will initialize immediately with persistent seed data and full functionality!

### Method 2: Live Local Web Server
```bash
# Using Python builtin server
python -m http.server 8000
```
Then navigate to `http://localhost:8000`.

---

## 🧪 How to Run Automated Tests

- **Option A (In-App)**: Click **"🧪 Run System Test Suite"** in the website footer.
- **Option B (Standalone Page)**: Open `test.html` in your browser.

---

## 🔒 Security Practices & 10MB File Limit Enforcement

1. **Client & Git Pre-Commit Security Guards**:
   - Includes a custom Git pre-commit hook in `.git/hooks/pre-commit` that automatically rejects any commit containing a file $\ge$ 10MB.
   - Run `.\check-size.ps1` at any time to verify all files are strictly under 10MB.
2. **XSS Protection**: All user text inputs are sanitized via `Security.sanitizeHTML()`.
3. **Role Authorization**: Sensitive admin actions (such as updating complaint statuses) enforce server-style role authorization checks (`Security.authorize()`).

---

## 🎬 5-Minute Hackathon Demo Flow

1. **Open App**: Land on Smart Campus homepage displaying the **3D Holographic Campus Building** and **Space Cursor Follower**.
2. **Student Dashboard**: Show personalized greeting for `Alex Johnson (STUDENT)`, dynamic metric cards, and live clock.
3. **Announcements**: Filter announcements by `Placement` or `Examination`.
4. **Event Registration**: Click "Register Now" on the AI & Cloud Hackathon 2026. Note that clicking again shows "✅ Registered for Event" and prevents duplicate entry.
5. **Issue Reporting (Real-World Interaction)**:
   - Fill out the maintenance form: `"Projector HDMI Not Working in Room 302"`.
   - Submit the issue and observe the generated reference ID: `SC-2026-00125`.
6. **Admin Role Switch**:
   - Use the header Role Switcher to switch to `Campus Admin (ADMIN)`.
   - Open Complaints pipeline, locate `SC-2026-00125`, and update status to `"In Progress"` with note: `"Technician assigned"`.
7. **Verify Real-Time Resolution**: Switch back to `Student` and observe the updated status timeline!
8. **Run System Tests**: Click "Run System Test Suite" in the footer to show 100% passing test assertions.

---

## 🌐 Deploying to GitHub Pages & Vercel

### Option A: Deploying to Vercel (Recommended)
This repository is pre-configured with `vercel.json` and `package.json` for seamless 1-click Vercel deployment:
1. **Via Vercel Web Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository `smart-camps`
   - Framework Preset: **Other / Static**
   - Root Directory: `./` (leave default)
   - Click **Deploy**!
2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
   Follow prompts to deploy instantly to your custom `*.vercel.app` domain.

### Option B: Deploying to GitHub Pages
1. Stage and commit your files:
   ```bash
   git add .
   git commit -m "Deploying Smart Campus to GitHub Pages"
   ```
2. Push to GitHub:
   ```bash
   git push -u origin main
   ```
3. Enable GitHub Pages in your GitHub Repository settings:
   - **Settings** → **Pages** → Source: `Deploy from a branch` → Select `main` / `/(root)`.
   - Your site will be live at: `https://rameshkkori0605.github.io/smart-camps/`
