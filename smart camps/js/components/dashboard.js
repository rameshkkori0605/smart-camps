/**
 * SMART CAMPUS - Dashboard Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Personalized Role-Based Dashboard for Student, Staff, Tech Team, and Admin.
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';

export function renderDashboard() {
  const activeUser = DB.getActiveUser();
  const announcements = DB.get('ANNOUNCEMENTS') || [];
  const events = DB.get('EVENTS') || [];
  const complaints = DB.get('COMPLAINTS') || [];

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Filter complaints based on role
  const isManagement = activeUser.role === CONFIG.ROLES.ADMIN || activeUser.role === CONFIG.ROLES.TECH_TEAM;
  const userComplaints = isManagement ? complaints : complaints.filter(c => c.reportedBy === activeUser.id);

  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return `
    <div class="space-y-8 animate-fadeIn">

      <!-- Hero Welcome Banner with Real Sapthagiri Entrance Image (Requirement 3) -->
      <div class="glass-card p-6 md:p-10 rounded-3xl relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-cyan-950/60 border border-cyan-500/30 shadow-2xl">
        <div class="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" style="background-image: url('assets/entrance.png');"></div>

        <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-3">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider">
              <span>🏛️ SAPTHAGIRI BENGALURU CAMPUS</span>
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>

            <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight">
              WELCOME TO <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SAPTHAGIRI NPS UNIVERSITY</span>
            </h2>

            <p class="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Hello <strong class="text-white">${activeUser.name}</strong> (<span class="text-cyan-400 font-bold">${activeUser.role}</span>) — ${activeUser.department}. Centralized platform for academic announcements, campus navigation, maintenance tracking, and emergency safety.
            </p>
          </div>

          <div class="bg-gray-900/90 border border-cyan-500/20 rounded-2xl p-4 text-right min-w-[240px] shadow-xl relative z-10">
            <p class="text-xs text-gray-400 font-semibold">📅 Today's Date</p>
            <p class="text-sm font-extrabold text-white mt-0.5">${formattedDate}</p>
            <p class="text-xs font-mono text-cyan-400 mt-1 font-bold">🕒 ${formattedTime}</p>
          </div>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="glass-card p-4 rounded-xl border-l-4 border-l-cyan-500">
          <p class="text-xs text-gray-400 font-medium">Total Complaints</p>
          <p class="text-2xl font-bold text-white mt-1">${complaints.length}</p>
          <span class="text-[11px] text-cyan-400 mt-1 block">Sapthagiri Tracked Issues</span>
        </div>

        <div class="glass-card p-4 rounded-xl border-l-4 border-l-amber-500">
          <p class="text-xs text-gray-400 font-medium">Pending Resolution</p>
          <p class="text-2xl font-bold text-amber-400 mt-1">${pendingComplaints}</p>
          <span class="text-[11px] text-amber-300/80 mt-1 block">Under Review / In Progress</span>
        </div>

        <div class="glass-card p-4 rounded-xl border-l-4 border-l-emerald-500">
          <p class="text-xs text-gray-400 font-medium">Resolved Issues</p>
          <p class="text-2xl font-bold text-emerald-400 mt-1">${resolvedComplaints}</p>
          <span class="text-[11px] text-emerald-300/80 mt-1 block">Successfully Closed</span>
        </div>

        <div class="glass-card p-4 rounded-xl border-l-4 border-l-blue-500">
          <p class="text-xs text-gray-400 font-medium">Active Events</p>
          <p class="text-2xl font-bold text-blue-400 mt-1">${events.length}</p>
          <span class="text-[11px] text-blue-300/80 mt-1 block">Upcoming Workshops</span>
        </div>
      </div>

      <!-- Student Portal Classroom Infrastructure Cards (Requirement 2 & 3) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="rounded-2xl overflow-hidden border border-gray-800 relative group">
          <img src="assets/classroom_block_a.png" alt="Sapthagiri Smart Classroom" class="w-full h-52 object-cover group-hover:scale-105 transition duration-500" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-4 flex flex-col justify-end">
            <span class="text-xs font-bold text-cyan-400 uppercase">A-Block 6th Floor</span>
            <p class="text-sm font-bold text-white">Smart Interactive Lecture Chambers</p>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ${activeUser.role} ACCESS PORTAL
            </span>
            <h3 class="text-lg font-extrabold text-white mt-2">Student & Faculty Portal Services</h3>
            <p class="text-xs text-gray-400 mt-1">Report classroom issues faced by you, view announcements, or register for upcoming campus hackathons.</p>
          </div>

          <div class="flex flex-wrap gap-3">
            <button 
              onclick="window.appStore.setTab('complaints')"
              class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              🔧 Raise Issue (SC-2026-XXXX)
            </button>
            <button 
              onclick="window.appStore.setTab('events')"
              class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
            >
              🎟️ Register Event Pass
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Announcements & Complaints Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📢</span> Recent Announcements
            </h3>
            <button onclick="window.appStore.setTab('announcements')" class="text-xs text-cyan-400 hover:underline font-medium">View All →</button>
          </div>

          <div class="space-y-3">
            ${announcements.slice(0, 3).map(a => `
              <div class="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-3">
                <span class="text-lg">📢</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-cyan-400 border border-gray-700">${a.category}</span>
                    <span class="text-[11px] text-gray-500">${a.date}</span>
                  </div>
                  <h4 class="text-sm font-semibold text-white mt-1">${a.title}</h4>
                  <p class="text-xs text-gray-400 line-clamp-2 mt-0.5">${a.content}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🔧</span> Recent Issue Tracking
            </h3>
            <button onclick="window.appStore.setTab('complaints')" class="text-xs text-cyan-400 hover:underline font-medium">Track All →</button>
          </div>

          <div class="space-y-3">
            ${userComplaints.length === 0 ? `
              <div class="p-8 text-center text-gray-500 text-xs">No issues reported yet. Click "Raise Issue" to submit one.</div>
            ` : userComplaints.slice(0, 3).map(c => `
              <div class="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-mono text-cyan-400 font-bold">${c.id}</span>
                    <span class="badge ${c.status === 'Resolved' ? 'badge-resolved' : 'badge-progress'}">
                      ${c.status}
                    </span>
                  </div>
                  <h4 class="text-sm font-semibold text-white mt-1">${c.title}</h4>
                  <p class="text-xs text-gray-400">${c.location}</p>
                </div>
                <span class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 font-medium">${c.priority}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}
