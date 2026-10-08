/**
 * SMART CAMPUS - Tech Department Portal Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Features Student Issues Folder & Staff Issues Folder management.
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderTechPortal() {
  const activeUser = DB.getActiveUser();
  const isTechTeam = activeUser.role === CONFIG.ROLES.TECH_TEAM || activeUser.role === CONFIG.ROLES.ADMIN;

  if (!isTechTeam) {
    return `
      <div class="glass-card p-12 text-center text-rose-400 space-y-3">
        <span class="text-4xl block">🛡️</span>
        <h3 class="text-xl font-bold">Access Denied: Tech Team Portal</h3>
        <p class="text-xs text-gray-400">Restricted to Sapthagiri NPS University Tech Department staff.</p>
        <button onclick="window.openLoginModal()" class="px-4 py-2 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs">Switch to Tech Team Login →</button>
      </div>
    `;
  }

  const studentRegs = DB.get('STUDENT_REGISTRATIONS') || [];
  const complaints = DB.get('COMPLAINTS') || [];
  const users = DB.get('USERS') || [];
  const admissions = DB.get('ADMISSIONS') || [];

  const studentUserIds = users.filter(u => u.role === CONFIG.ROLES.STUDENT).map(u => u.id);
  const staffUserIds = users.filter(u => u.role === CONFIG.ROLES.STAFF).map(u => u.id);

  // Issues Folders (Requirement 4)
  const studentComplaints = complaints.filter(c => studentUserIds.includes(c.reportedBy) || c.reportedBy?.startsWith('1SG'));
  const staffComplaints = complaints.filter(c => staffUserIds.includes(c.reportedBy) || c.reportedBy?.startsWith('STAFF'));

  const activeIssueFolder = window.techPortalActiveFolder || 'STUDENT_FOLDER';

  const displayedComplaints = activeIssueFolder === 'STUDENT_FOLDER' 
    ? studentComplaints 
    : activeIssueFolder === 'STAFF_FOLDER' 
    ? staffComplaints 
    : complaints;

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Tech Portal Header -->
      <div class="glass-card p-6 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-gray-900 via-gray-900 to-cyan-950/30 flex items-center justify-between">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
            <span>💻 TECH DEPARTMENT COMMAND PORTAL</span>
          </div>
          <h2 class="text-2xl font-extrabold text-white">Sapthagiri Tech Team Operations Desk</h2>
          <p class="text-xs text-gray-400 mt-1">Manage student registration approvals, IT infrastructure, and categorized Student vs Staff maintenance issues.</p>
        </div>
        <span class="text-3xl">💻</span>
      </div>

      <!-- Folders for Issues Raised by Student vs Staff (Requirement 4) -->
      <div class="glass-card p-6 md:p-8 rounded-2xl space-y-6 border border-cyan-500/30">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📁</span> Campus Issue Folders (Student vs Staff Categories)
            </h3>
            <p class="text-xs text-gray-400">Inspect and resolve technical maintenance tickets submitted by students and faculty staff.</p>
          </div>

          <!-- Folder Selection Tabs -->
          <div class="flex items-center gap-2 bg-gray-900/90 p-1 rounded-xl border border-gray-800 text-xs font-bold">
            <button 
              onclick="window.setTechIssueFolder('STUDENT_FOLDER')"
              class="px-3 py-1.5 rounded-lg transition ${activeIssueFolder === 'STUDENT_FOLDER' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:text-white'}"
            >
              📁 Student Issues (${studentComplaints.length})
            </button>
            <button 
              onclick="window.setTechIssueFolder('STAFF_FOLDER')"
              class="px-3 py-1.5 rounded-lg transition ${activeIssueFolder === 'STAFF_FOLDER' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:text-white'}"
            >
              📁 Staff Issues (${staffComplaints.length})
            </button>
            <button 
              onclick="window.setTechIssueFolder('ALL_FOLDER')"
              class="px-3 py-1.5 rounded-lg transition ${activeIssueFolder === 'ALL_FOLDER' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-gray-400 hover:text-white'}"
            >
              📂 All (${complaints.length})
            </button>
          </div>
        </div>

        <!-- Issue Cards inside Selected Folder -->
        <div class="space-y-4">
          ${displayedComplaints.length === 0 ? `
            <div class="p-8 text-center text-gray-500 text-xs bg-gray-900/40 rounded-xl border border-gray-800">
              No issues reported in folder "${activeIssueFolder.replace('_FOLDER', '')}".
            </div>
          ` : displayedComplaints.map(c => `
            <div class="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-3 hover:border-cyan-500/30 transition">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">${c.id}</span>
                  <span class="badge ${c.status === 'Resolved' ? 'badge-resolved' : 'badge-progress'}">${c.status}</span>
                </div>
                <span class="text-xs text-gray-400">Reported by: <strong class="text-gray-200">${c.reporterName}</strong></span>
              </div>

              <div>
                <h4 class="text-sm font-bold text-white">${Security.sanitizeHTML(c.title)}</h4>
                <p class="text-xs text-gray-400 mt-0.5">${Security.sanitizeHTML(c.description)}</p>
                <p class="text-xs text-gray-500 mt-1">📍 Location: ${c.location} | Priority: ${c.priority}</p>
              </div>

              ${c.adminNote ? `
                <div class="p-2 rounded-lg bg-gray-950 border border-cyan-500/20 text-xs text-cyan-300">
                  💬 Update Note: ${Security.sanitizeHTML(c.adminNote)}
                </div>
              ` : ''}

              <div class="pt-2 flex items-center justify-end gap-2 border-t border-gray-800/80 text-xs">
                <span class="text-gray-400 font-medium">Update Status:</span>
                <button onclick="window.updateComplaintStatus('${c.id}', 'In Progress')" class="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">In Progress</button>
                <button onclick="window.updateComplaintStatus('${c.id}', 'Resolved')" class="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">Resolved</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Student Registration Verification Table -->
      <div class="glass-card p-6 md:p-8 rounded-2xl space-y-4 border border-gray-800">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>🎓</span> Student Registration Verification Requests (${studentRegs.length})
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th class="p-3">USN / ID</th>
                <th class="p-3">Student Name</th>
                <th class="p-3">University Email</th>
                <th class="p-3">Department</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Tech Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800/60">
              ${studentRegs.map(r => `
                <tr class="hover:bg-gray-900/40">
                  <td class="p-3 font-mono font-bold text-cyan-400">${r.studentUsn}</td>
                  <td class="p-3 font-bold text-white">${r.studentName}</td>
                  <td class="p-3 text-gray-300">${r.email}</td>
                  <td class="p-3 text-gray-400">${r.department}</td>
                  <td class="p-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}">
                      ${r.status}
                    </span>
                  </td>
                  <td class="p-3 text-right">
                    ${r.status === 'PENDING_APPROVAL' ? `
                      <button 
                        onclick="window.handleApproveStudentRegistration('${r.id}')"
                        class="px-3 py-1 rounded-lg bg-emerald-500 text-gray-950 font-bold hover:bg-emerald-400 transition"
                      >
                        Approve & Provision Account
                      </button>
                    ` : `
                      <span class="text-gray-500 font-medium">Approved by ${r.approvedBy || 'Tech Team'}</span>
                    `}
                  </td>
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
            <span>➕</span> New Admission Application Form
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
                <th class="p-3 text-right">Tech Actions</th>
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
