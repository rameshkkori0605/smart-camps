/**
 * SMART CAMPUS - Administrator Command & User Management Portal
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { DB } from '../db.js';
import { CONFIG, EVALUATION_CRITERIA_MAPPING } from '../config.js';

export function renderAdminAnalytics() {
  const activeUser = DB.getActiveUser();
  const isAdmin = activeUser.role === CONFIG.ROLES.ADMIN;

  if (!isAdmin) {
    return `
      <div class="glass-card p-12 text-center text-rose-400 space-y-3">
        <span class="text-4xl block">🛡️</span>
        <h3 class="text-xl font-bold">Access Denied: Admin Panel</h3>
        <p class="text-xs text-gray-400">Restricted to Sapthagiri NPS University Central Administration (Admin ID: SNPSUADMIN).</p>
        <button onclick="window.openLoginModal()" class="px-4 py-2 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs">Login as SNPSUADMIN →</button>
      </div>
    `;
  }

  const users = DB.get('USERS');
  const complaints = DB.get('COMPLAINTS');
  const events = DB.get('EVENTS');
  const announcements = DB.get('ANNOUNCEMENTS');
  const admissions = DB.get('ADMISSIONS') || [];

  const students = users.filter(u => u.role === CONFIG.ROLES.STUDENT);
  const staffMembers = users.filter(u => u.role === CONFIG.ROLES.STAFF);
  const techTeam = users.filter(u => u.role === CONFIG.ROLES.TECH_TEAM);
  const admins = users.filter(u => u.role === CONFIG.ROLES.ADMIN);

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Admin Header -->
      <div class="glass-card p-6 md:p-8 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
            <span>🛡️ CENTRAL ADMIN COMMAND PORTAL</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">SAPTHAGIRI NPS UNIVERSITY ADMIN PANEL</h2>
          <p class="text-xs text-gray-400 mt-1">Logged in as <strong class="text-cyan-400">${activeUser.name}</strong> (Admin ID: <code class="text-cyan-400 font-mono">SNPSUADMIN</code>)</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            onclick="window.openAdmissionFormModal()"
            class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            <span>🎓</span> New Admission Form
          </button>
          <button 
            onclick="document.getElementById('add-user-modal-form').scrollIntoView({ behavior: 'smooth' })"
            class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            ➕ Add Member
          </button>
        </div>
      </div>

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-cyan-500">
          <p class="text-xs text-gray-400 font-medium">Tech Team Staff</p>
          <p class="text-2xl font-bold text-cyan-400 mt-1">${techTeam.length}</p>
          <span class="text-[11px] text-cyan-300/80">IT Support</span>
        </div>
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-blue-500">
          <p class="text-xs text-gray-400 font-medium">Faculty & Staff</p>
          <p class="text-2xl font-bold text-blue-400 mt-1">${staffMembers.length}</p>
          <span class="text-[11px] text-blue-300/80">Academic Staff</span>
        </div>
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-emerald-500">
          <p class="text-xs text-gray-400 font-medium">Enrolled Students</p>
          <p class="text-2xl font-bold text-emerald-400 mt-1">${students.length}</p>
          <span class="text-[11px] text-emerald-300/80">Active Accounts</span>
        </div>
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-amber-500">
          <p class="text-xs text-gray-400 font-medium">Admissions 2026</p>
          <p class="text-2xl font-bold text-amber-400 mt-1">${admissions.length}</p>
          <span class="text-[11px] text-amber-300/80">₹${(admissions.length * 2000).toLocaleString()} Collected</span>
        </div>
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-purple-500">
          <p class="text-xs text-gray-400 font-medium">Administrators</p>
          <p class="text-2xl font-bold text-purple-400 mt-1">${admins.length}</p>
          <span class="text-[11px] text-purple-300/80">Central Control</span>
        </div>
      </div>

      <!-- Add New User Form (Admin Action 9: Admin can add Tech Team, Staff, Students) -->
      <div id="add-user-modal-form" class="glass-card p-6 md:p-8 rounded-2xl border border-cyan-500/30">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>👤</span> Add New Tech Team / Staff / Student Member
        </h3>
        <p class="text-xs text-gray-400 mb-6">Provision new accounts directly into the Sapthagiri NPS University platform database.</p>

        <form onsubmit="window.handleAdminAddUser(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="admin-add-role" class="block text-xs font-semibold text-gray-300 mb-1">Select Role *</label>
              <select id="admin-add-role" required class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500">
                <option value="TECH_TEAM">Tech Team Staff</option>
                <option value="STAFF">Faculty / Staff</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>

            <div>
              <label for="admin-add-id" class="block text-xs font-semibold text-gray-300 mb-1">User ID / USN *</label>
              <input type="text" id="admin-add-id" required placeholder="e.g. TECH-102 or 1SG24CS100" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label for="admin-add-name" class="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
              <input type="text" id="admin-add-name" required placeholder="e.g. Vikram Sharma" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="admin-add-email" class="block text-xs font-semibold text-gray-300 mb-1">University Email *</label>
              <input type="email" id="admin-add-email" required placeholder="vikram@sapthagiri.edu.in" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label for="admin-add-password" class="block text-xs font-semibold text-gray-300 mb-1">Password *</label>
              <input type="text" id="admin-add-password" required value="sapthagiri2026" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label for="admin-add-dept" class="block text-xs font-semibold text-gray-300 mb-1">Department *</label>
              <input type="text" id="admin-add-dept" required placeholder="IT Infrastructure / CS / ECE" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500" />
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20">
              Provision Member Credentials
            </button>
          </div>
        </form>
      </div>

      <!-- User Directory Access Table (Admin Item 5: Admin can access details of Tech Team, Staff, Student) -->
      <div class="glass-card p-6 md:p-8 rounded-2xl space-y-4 border border-gray-800">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>👥</span> Sapthagiri NPS University Master User Directory (${users.length})
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th class="p-3">User ID</th>
                <th class="p-3">Name</th>
                <th class="p-3">Email</th>
                <th class="p-3">Role</th>
                <th class="p-3">Department</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60">
              ${users.map(u => `
                <tr class="hover:bg-gray-900/40">
                  <td class="p-3 font-mono font-bold text-cyan-400">${u.id}</td>
                  <td class="p-3 font-bold text-white">${u.name}</td>
                  <td class="p-3 text-gray-300">${u.email}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : u.role === 'TECH_TEAM' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : u.role === 'STAFF' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}">
                      ${u.role}
                    </span>
                  </td>
                  <td class="p-3 text-gray-400">${u.department}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
      <!-- Candidate Online Admission Registration Requests (₹2,000 Paid Applications) -->
      <div class="glass-card p-6 md:p-8 rounded-2xl space-y-6 border border-amber-500/30">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-1">
              <span>🎓 ADMISSION COUNSELING & VERIFICATION DESK</span>
            </div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📋</span> Candidate Admission Applications (${admissions.length} Registered)
            </h3>
            <p class="text-xs text-gray-400">Review prospective candidate registrations, verify eligibility marks, and track ₹2,000 application fee payments.</p>
          </div>
          <button 
            onclick="window.openAdmissionFormModal()"
            class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0"
          >
            <span>➕</span> Process Walk-in Admission Form
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th class="p-3">Application Ref</th>
                <th class="p-3">Candidate Details</th>
                <th class="p-3">Course / Branch</th>
                <th class="p-3">12th / PUC %</th>
                <th class="p-3">Fee (₹2,000)</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60">
              ${admissions.length === 0 ? `
                <tr><td colspan="7" class="p-6 text-center text-gray-500 text-xs">No candidate admission applications received yet.</td></tr>
              ` : admissions.map(a => `
                <tr class="hover:bg-gray-900/40">
                  <td class="p-3 font-mono font-bold text-amber-400">${a.id}</td>
                  <td class="p-3">
                    <strong class="text-white block">${a.candidateName}</strong>
                    <span class="text-[11px] text-gray-400">${a.email} • ${a.phone}</span>
                  </td>
                  <td class="p-3 font-semibold text-gray-300">${a.course}</td>
                  <td class="p-3 font-bold text-white">${a.marks}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ₹${(a.feeAmount || 2000).toLocaleString()} PAID
                    </span>
                    <span class="block text-[10px] text-gray-500 font-mono mt-0.5">${a.paymentMethod || 'UPI'}</span>
                  </td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      a.status === 'OFFER_ISSUED' 
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                        : a.status === 'VERIFIED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }">
                      ${(a.status || 'PENDING_REVIEW').replace('_', ' ')}
                    </span>
                  </td>
                  <td class="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button 
                      onclick="window.showAdmissionSlipModal(DB.get('ADMISSIONS').find(x => x.id === '${a.id}'))"
                      class="px-2.5 py-1 rounded bg-gray-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold"
                    >
                      View Slip
                    </button>
                    ${a.status !== 'OFFER_ISSUED' ? `
                      <button 
                        onclick="window.handleUpdateAdmissionStatus('${a.id}', 'OFFER_ISSUED')"
                        class="px-2.5 py-1 rounded bg-emerald-500 text-gray-950 font-bold hover:bg-emerald-400 transition"
                      >
                        Issue Offer
                      </button>
                    ` : `
                      <button 
                        onclick="window.handleUpdateAdmissionStatus('${a.id}', 'VERIFIED')"
                        class="px-2.5 py-1 rounded bg-cyan-500 text-gray-950 font-bold hover:bg-cyan-400 transition"
                      >
                        Verify Docs
                      </button>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
