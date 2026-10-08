/**
 * SMART CAMPUS - Welcome & Landing Page Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Features College Building Background, University Logo, and Embedded Role Login System.
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';

export function renderWelcomePage() {
  const activeUser = DB.getActiveUser();

  return `
    <div class="space-y-8 animate-fadeIn">

      <!-- Hero Welcome Banner with Sapthagiri College Building Background Image -->
      <div class="relative rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl min-h-[480px] flex flex-col justify-between p-6 md:p-12">
        
        <!-- College Building Background Image (Requirement 3 & 5) -->
        <div class="absolute inset-0 z-0 bg-cover bg-center filter brightness-50" style="background-image: url('assets/college_building.png');"></div>
        <div class="absolute inset-0 z-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent"></div>

        <!-- Header Content inside Hero -->
        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div class="flex items-center gap-4">
            <!-- Official Sapthagiri Crest Logo (Requirement 3) -->
            <img src="assets/logo.png" alt="Sapthagiri NPS University Logo" class="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl bg-white/10 p-1.5 rounded-2xl border border-white/20" />
            <div>
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest">BENGALURU, KARNATAKA</span>
              <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight mt-1">
                SAPTHAGIRI NPS UNIVERSITY
              </h1>
              <p class="text-xs md:text-sm text-gray-300 font-medium">One Smart Platform for a Better Campus.</p>
            </div>
          </div>

          <button 
            onclick="window.appStore.setTab('dashboard')"
            class="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs transition shadow-2xl shadow-cyan-500/30 flex items-center gap-2"
          >
            <span>🚀</span> Enter Main Campus Portal
          </button>
        </div>

        <!-- Embedded Role Login System Box right on the Welcome Page (Requirement 5) -->
        <div class="relative z-10 max-w-xl w-full mx-auto my-6 glass-card p-6 rounded-2xl border border-cyan-500/40 bg-gray-950/80 backdrop-blur-xl shadow-2xl">
          <div class="text-center space-y-1 mb-4">
            <h2 class="text-lg font-extrabold text-white flex items-center justify-center gap-2">
              <span>🔑</span> Sapthagiri Unified Role Login System
            </h2>
            <p class="text-xs text-gray-400">Select your user role to authenticate into the campus ecosystem.</p>
          </div>

          <!-- Role Login Tabs -->
          <div class="grid grid-cols-4 gap-1.5 p-1 bg-gray-900/90 rounded-xl border border-gray-800 text-xs font-bold text-center mb-4">
            <button id="welcome-tab-student" onclick="window.switchWelcomeLoginTab('STUDENT')" class="py-2.5 rounded-xl font-black bg-cyan-500 text-gray-950 border border-cyan-300 shadow-md shadow-cyan-500/30 transition">Student</button>
            <button id="welcome-tab-staff" onclick="window.switchWelcomeLoginTab('STAFF')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Staff</button>
            <button id="welcome-tab-tech" onclick="window.switchWelcomeLoginTab('TECH_TEAM')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Tech Team</button>
            <button id="welcome-tab-admin" onclick="window.switchWelcomeLoginTab('ADMIN')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Admin</button>
          </div>

          <!-- Quick Preset Hint Box -->
          <div class="p-3 rounded-xl bg-gray-900/90 border border-cyan-500/20 text-xs space-y-1 mb-4 flex items-center justify-between">
            <div>
              <span class="font-bold text-cyan-400 block text-[11px]">📌 Active Selected Preset:</span>
              <span id="welcome-preset-hint" class="text-gray-300">ID: <strong>1SG23CS045</strong> | Pass: <strong>student2026</strong></span>
            </div>
            <button onclick="window.fillWelcomePreset()" class="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold hover:bg-cyan-500/20 text-xs">Auto Fill</button>
          </div>

          <!-- Embedded Login Form -->
          <form onsubmit="window.handleWelcomeLogin(event)" class="space-y-3 text-xs">
            <div>
              <label for="welcome-login-id" class="block font-semibold text-gray-300 mb-1">User ID / USN / Email *</label>
              <input type="text" id="welcome-login-id" required value="1SG23CS045" placeholder="Enter User ID (e.g. SNPSUADMIN)" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 font-medium" />
            </div>

            <div>
              <label for="welcome-login-pass" class="block font-semibold text-gray-300 mb-1">Password *</label>
              <input type="password" id="welcome-login-pass" required value="student2026" placeholder="Enter Password (e.g. SNPSU2026)" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500 font-medium" />
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider">
              Authenticate & Enter Campus Portal
            </button>
          </form>
        </div>

        <!-- Footer Notice -->
        <div class="relative z-10 text-center text-xs text-gray-400">
          Current Session Status: ${activeUser && activeUser.isLoggedIn ? `<strong class="text-emerald-400">Logged in as ${activeUser.name} (${activeUser.role})</strong>` : `<strong class="text-amber-400">Guest Visitor (Log In Required to Access Campus Features)</strong>`}
        </div>

      </div>

      <!-- Campus Highlights & Classroom Gallery Card (Requirement 2 & 3) -->
      <div class="glass-card p-6 md:p-8 rounded-2xl space-y-4">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>🏛️</span> Sapthagiri NPS University Campus Infrastructure & Classrooms
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-2xl overflow-hidden border border-gray-800 relative group">
            <img src="assets/classroom.png" alt="Sapthagiri NPS University Smart Classroom" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-4 flex flex-col justify-end">
              <span class="text-xs font-bold text-cyan-400 uppercase">Smart Lecture Halls</span>
              <p class="text-sm font-bold text-white">Advanced Interactive Classrooms & Seminar Chambers</p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden border border-gray-800 relative group">
            <img src="assets/college_building.png" alt="Sapthagiri NPS University Campus Building" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-4 flex flex-col justify-end">
              <span class="text-xs font-bold text-cyan-400 uppercase">Bengaluru Campus</span>
              <p class="text-sm font-bold text-white">Central Academic & Administrative Towers</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}
