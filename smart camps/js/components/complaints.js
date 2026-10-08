/**
 * SMART CAMPUS - Issue & Complaint Reporting Component
 * Core Real-World Interaction feature: Reference ID generation (SC-2026-XXXX) & Admin Resolution Pipeline.
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderComplaints() {
  const activeUser = DB.getActiveUser();
  const isAdmin = activeUser.role === CONFIG.ROLES.ADMIN;
  const complaints = DB.get('COMPLAINTS');

  const filteredComplaints = isAdmin 
    ? complaints 
    : complaints.filter(c => c.reportedBy === activeUser.id);

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Header -->
      <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span>🔧</span> Issue & Maintenance Reporting System
          </h2>
          <p class="text-xs text-gray-400">Report broken fixtures, water leaks, Wi-Fi outages, or classroom issues with real-time status tracking.</p>
        </div>

        <button 
          onclick="document.getElementById('complaint-form-card').scrollIntoView({ behavior: 'smooth' })"
          class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
        >
          ➕ Submit New Issue
        </button>
      </div>

      <!-- Submit Complaint Form Card -->
      <div id="complaint-form-card" class="glass-card p-6 md:p-8 rounded-2xl border border-cyan-500/30">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>📝</span> Submit a Campus Maintenance Issue
        </h3>
        <p class="text-xs text-gray-400 mb-6">Generates a unique tracking reference ID (e.g. SC-2026-00125).</p>

        <form id="complaint-form" onsubmit="window.handleComplaintSubmit(event)" class="space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="complaint-title" class="block text-xs font-semibold text-gray-300 mb-1">Issue Title *</label>
              <input 
                type="text" 
                id="complaint-title" 
                required 
                placeholder="e.g. Broken Light in Room 204" 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label for="complaint-category" class="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
              <select 
                id="complaint-category" 
                required 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Classroom">Classroom & Projector</option>
                <option value="Electrical">Electrical & Lighting</option>
                <option value="Wi-Fi">Wi-Fi & Network</option>
                <option value="Plumbing">Plumbing & Water</option>
                <option value="Cleanliness">Cleanliness & Hygiene</option>
                <option value="Infrastructure">Building & Furniture</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="complaint-location" class="block text-xs font-semibold text-gray-300 mb-1">Specific Location *</label>
              <input 
                type="text" 
                id="complaint-location" 
                required 
                placeholder="e.g. Block A, 2nd Floor, Room 204" 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label for="complaint-priority" class="block text-xs font-semibold text-gray-300 mb-1">Urgency / Priority *</label>
              <select 
                id="complaint-priority" 
                required 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium" selected>Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Emergency">Emergency Safety</option>
              </select>
            </div>
          </div>

          <div>
            <label for="complaint-desc" class="block text-xs font-semibold text-gray-300 mb-1">Detailed Description *</label>
            <textarea 
              id="complaint-desc" 
              rows="3" 
              required 
              placeholder="Describe the exact problem..." 
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <div>
            <label for="complaint-file" class="block text-xs font-semibold text-gray-300 mb-1">
              Optional Image Attachment (Strict Limit: Under 10 MB)
            </label>
            <input 
              type="file" 
              id="complaint-file" 
              accept="image/*,.pdf"
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-cyan-400 hover:file:bg-gray-700"
            />
            <p class="text-[11px] text-gray-500 mt-1">Files >= 10MB are strictly blocked for security and bandwidth compliance.</p>
          </div>

          <div class="pt-2 flex justify-end">
            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              Submit Complaint & Generate ID
            </button>
          </div>

        </form>
      </div>

      <!-- Complaints List & Tracking Pipeline -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>📋</span> ${isAdmin ? 'All Campus Complaints Pipeline (Admin View)' : 'My Reported Complaints Tracker'}
        </h3>

        ${filteredComplaints.length === 0 ? `
          <div class="glass-card p-12 text-center text-gray-500">
            <span class="text-3xl block mb-2">📭</span>
            No complaints found.
          </div>
        ` : filteredComplaints.map(c => `
          <div class="glass-card p-6 rounded-2xl space-y-4 border border-gray-800 hover:border-gray-700 transition">
            
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-gray-800">
              <div class="flex items-center gap-3">
                <span class="text-sm font-mono font-extrabold text-cyan-400 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  ${c.id}
                </span>
                <span class="badge ${c.status === 'Resolved' ? 'badge-resolved' : c.status === 'In Progress' ? 'badge-progress' : 'badge-review'}">
                  ${c.status}
                </span>
              </div>
              <div class="text-xs text-gray-400 font-medium">
                Reported by: <span class="text-gray-200 font-semibold">${c.reporterName}</span> • ${new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div>
              <h4 class="text-base font-bold text-white">${Security.sanitizeHTML(c.title)}</h4>
              <p class="text-xs text-gray-400 mt-1">${Security.sanitizeHTML(c.description)}</p>
              <div class="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                <span>📍 <strong class="text-gray-300">Location:</strong> ${c.location}</span>
                <span>🏷️ <strong class="text-gray-300">Category:</strong> ${c.category}</span>
                <span>⚠️ <strong class="text-gray-300">Priority:</strong> ${c.priority}</span>
              </div>
            </div>

            ${c.adminNote ? `
              <div class="p-3 rounded-xl bg-gray-900/90 border border-cyan-500/20 text-xs">
                <span class="font-bold text-cyan-400">💬 Admin Update Note:</span>
                <span class="text-gray-300 ml-1">${Security.sanitizeHTML(c.adminNote)}</span>
              </div>
            ` : ''}

            <!-- Status Step Pipeline Indicator -->
            <div class="pt-2">
              <div class="flex items-center justify-between text-[11px] text-gray-400 font-semibold mb-1">
                <span class="${c.status === 'Submitted' || c.status === 'Under Review' || c.status === 'In Progress' || c.status === 'Resolved' ? 'text-cyan-400' : ''}">1. Submitted</span>
                <span class="${c.status === 'Under Review' || c.status === 'In Progress' || c.status === 'Resolved' ? 'text-amber-400' : ''}">2. Under Review</span>
                <span class="${c.status === 'In Progress' || c.status === 'Resolved' ? 'text-cyan-400' : ''}">3. In Progress</span>
                <span class="${c.status === 'Resolved' ? 'text-emerald-400' : ''}">4. Resolved</span>
              </div>
              <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-emerald-500 transition-all duration-500" 
                  style="width: ${c.status === 'Submitted' ? '25%' : c.status === 'Under Review' ? '50%' : c.status === 'In Progress' ? '75%' : '100%'}"
                ></div>
              </div>
            </div>

            ${isAdmin ? `
              <div class="pt-3 flex items-center justify-end gap-2 border-t border-gray-800">
                <span class="text-xs text-gray-400 font-medium">Update Status:</span>
                <button onclick="window.updateComplaintStatus('${c.id}', 'Under Review')" class="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20">Under Review</button>
                <button onclick="window.updateComplaintStatus('${c.id}', 'In Progress')" class="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20">In Progress</button>
                <button onclick="window.updateComplaintStatus('${c.id}', 'Resolved')" class="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20">Resolved</button>
              </div>
            ` : ''}

          </div>
        `).join('')}
      </div>

    </div>
  `;
}
