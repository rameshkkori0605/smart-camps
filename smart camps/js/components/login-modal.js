/**
 * SMART CAMPUS - Role Login & Student Registration Modal
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';

export function openLoginModal() {
  const existing = document.getElementById('login-modal-root');
  if (existing) existing.remove();

  // Default preset setup
  window.currentPreset = { id: '1SG23CS045', pass: 'student2026' };

  const modalHTML = `
    <div id="login-modal-root" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="glass-card max-w-lg w-full p-6 md:p-8 rounded-2xl border border-cyan-500/40 relative space-y-6 shadow-2xl">
        
        <!-- Close Button -->
        <button onclick="document.getElementById('login-modal-root').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>

        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-cyan-500/30">
            🎓
          </div>
          <h3 class="text-xl font-extrabold text-white tracking-tight">SAPTHAGIRI NPS UNIVERSITY</h3>
          <p class="text-xs text-cyan-400 font-medium">Select Login Portal / Access Credentials</p>
        </div>

        <!-- Role Login Tabs -->
        <div class="grid grid-cols-4 gap-1.5 p-1 bg-gray-900 rounded-xl border border-gray-800 text-xs font-bold text-center">
          <button id="tab-student" onclick="window.switchLoginTab('STUDENT')" class="py-2.5 rounded-xl font-black bg-cyan-500 text-gray-950 border border-cyan-300 shadow-md transition">Student</button>
          <button id="tab-staff" onclick="window.switchLoginTab('STAFF')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Staff</button>
          <button id="tab-tech" onclick="window.switchLoginTab('TECH_TEAM')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Tech Team</button>
          <button id="tab-admin" onclick="window.switchLoginTab('ADMIN')" class="py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold">Admin</button>
        </div>

        <!-- Credentials Quick Preset Shortcut Box -->
        <div id="quick-preset-box" class="p-3 rounded-xl bg-gray-900/90 border border-cyan-500/20 text-xs space-y-1">
          <span class="font-bold text-cyan-400 block">📌 Active Selected Preset:</span>
          <span id="preset-hint-text" class="text-gray-300">ID: <strong>1SG23CS045</strong> | Pass: <strong>student2026</strong></span>
          <button onclick="window.fillPresetCredentials()" class="mt-1 px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold hover:bg-cyan-500/20">Auto Fill</button>
        </div>

        <!-- Login Form -->
        <form onsubmit="window.handleRoleLoginSubmit(event)" class="space-y-4">
          <input type="hidden" id="login-active-role" value="STUDENT" />

          <div>
            <label for="login-id" class="block text-xs font-semibold text-gray-300 mb-1">User ID / USN / Email *</label>
            <input 
              type="text" 
              id="login-id" 
              required 
              value="1SG23CS045"
              placeholder="Enter User ID (e.g. SNPSUADMIN)" 
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div>
            <label for="login-password" class="block text-xs font-semibold text-gray-300 mb-1">Password *</label>
            <input 
              type="password" 
              id="login-password" 
              required 
              value="student2026"
              placeholder="Enter Password (e.g. SNPSU2026)" 
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div id="login-error-msg" class="hidden text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30"></div>

          <button 
            type="submit" 
            class="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider"
          >
            Authenticate & Log In
          </button>
        </form>

        <!-- Student New Registration Trigger -->
        <div class="pt-2 border-t border-gray-800/80 text-center text-xs">
          <span class="text-gray-400">New Student? </span>
          <button onclick="window.openStudentRegistrationModal()" class="text-cyan-400 font-bold hover:underline">Apply for Tech Department Registration →</button>
        </div>

      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHTML;
  document.body.appendChild(container);

  window.switchLoginTab = (role) => {
    document.getElementById('login-active-role').value = role;
    const hints = {
      STUDENT: { hint: 'ID: <strong>1SG23CS045</strong> | Pass: <strong>student2026</strong>', id: '1SG23CS045', pass: 'student2026' },
      STAFF: { hint: 'ID: <strong>STAFF201</strong> | Pass: <strong>staff2026</strong>', id: 'STAFF201', pass: 'staff2026' },
      TECH_TEAM: { hint: 'ID: <strong>TECH101</strong> | Pass: <strong>tech2026</strong>', id: 'TECH101', pass: 'tech2026' },
      ADMIN: { hint: 'Admin ID: <strong>SNPSUADMIN</strong> | Pass: <strong>SNPSU2026</strong>', id: 'SNPSUADMIN', pass: 'SNPSU2026' }
    };

    ['student', 'staff', 'tech', 'admin'].forEach(t => {
      const btn = document.getElementById(`tab-${t}`);
      if (btn) {
        btn.className = 'py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold';
      }
    });

    const activeMap = { STUDENT: 'student', STAFF: 'staff', TECH_TEAM: 'tech', ADMIN: 'admin' };
    const activeBtn = document.getElementById(`tab-${activeMap[role]}`);
    if (activeBtn) {
      activeBtn.className = 'py-2.5 rounded-xl font-black bg-cyan-500 text-gray-950 border border-cyan-300 shadow-md transition';
    }

    document.getElementById('preset-hint-text').innerHTML = hints[role].hint;
    const idEl = document.getElementById('login-id');
    const passEl = document.getElementById('login-password');
    if (idEl) idEl.value = hints[role].id;
    if (passEl) passEl.value = hints[role].pass;
    window.currentPreset = hints[role];
  };

  window.fillPresetCredentials = () => {
    const preset = window.currentPreset || { id: '1SG23CS045', pass: 'student2026' };
    document.getElementById('login-id').value = preset.id;
    document.getElementById('login-password').value = preset.pass;
  };

  window.handleRoleLoginSubmit = (e) => {
    e.preventDefault();
    const loginId = document.getElementById('login-id').value;
    const password = document.getElementById('login-password').value;

    const auth = DB.login(loginId, password);

    if (auth.success) {
      Store.setActiveUser(auth.user);
      const root = document.getElementById('login-modal-root');
      if (root) root.remove();
      Store.setTab('dashboard');
      alert(`✅ Welcome to SAPTHAGIRI NPS UNIVERSITY, ${auth.user.name} (${auth.user.role})!`);
    } else {
      const errBox = document.getElementById('login-error-msg');
      if (errBox) {
        errBox.innerText = auth.error;
        errBox.classList.remove('hidden');
      }
    }
  };
}

export function openStudentRegistrationModal() {
  const existing = document.getElementById('login-modal-root');
  if (existing) existing.remove();

  const regHTML = `
    <div id="login-modal-root" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div class="glass-card max-w-md w-full p-6 md:p-8 rounded-2xl border border-cyan-500/40 relative space-y-4 shadow-2xl">
        <button onclick="document.getElementById('login-modal-root').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>

        <div class="text-center space-y-1">
          <h3 class="text-lg font-bold text-white">Student Registration</h3>
          <p class="text-xs text-cyan-400">Submit details for Tech Department verification</p>
        </div>

        <form onsubmit="window.handleStudentRegistrationSubmit(event)" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-gray-300 mb-1">Student USN / ID *</label>
            <input type="text" id="reg-usn" required placeholder="e.g. 1SG24CS099" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-gray-200" />
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">Full Name *</label>
            <input type="text" id="reg-name" required placeholder="e.g. Ananya Rao" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-gray-200" />
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">University Email *</label>
            <input type="email" id="reg-email" required placeholder="ananya@student.sapthagiri.edu.in" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-gray-200" />
          </div>

          <div>
            <label class="block font-semibold text-gray-300 mb-1">Department *</label>
            <input type="text" id="reg-dept" required placeholder="Computer Science & Engineering" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-gray-200" />
          </div>

          <button type="submit" class="w-full py-2.5 rounded-xl bg-cyan-500 text-gray-950 font-bold hover:bg-cyan-400">
            Submit Registration to Tech Team
          </button>
        </form>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = regHTML;
  document.body.appendChild(container);

  window.handleStudentRegistrationSubmit = (e) => {
    e.preventDefault();
    const usn = document.getElementById('reg-usn').value;
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const dept = document.getElementById('reg-dept').value;

    const list = DB.get('STUDENT_REGISTRATIONS') || [];
    const newReg = {
      id: `SREG-${Date.now()}`,
      studentUsn: usn,
      studentName: name,
      email,
      department: dept,
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString(),
      approvedBy: ''
    };

    DB.set('STUDENT_REGISTRATIONS', [...list, newReg]);

    alert('✅ Student Registration Submitted!\nYour request is sent to the Tech Department for verification.');
    const root = document.getElementById('login-modal-root');
    if (root) root.remove();
  };
}
