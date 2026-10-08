/**
 * SMART CAMPUS - Campus Announcements Component
 * Full CRUD for Admin, Search & Category filtering for Students.
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderAnnouncements() {
  const activeUser = DB.getActiveUser();
  const isAdmin = activeUser.role === CONFIG.ROLES.ADMIN;
  let announcements = DB.get('ANNOUNCEMENTS');
  
  const categories = ['ALL', ...CONFIG.ANNOUNCEMENT_CATEGORIES];
  const activeCategory = Store.getState().activeAnnouncementCategory || 'ALL';

  if (activeCategory !== 'ALL') {
    announcements = announcements.filter(a => a.category === activeCategory);
  }

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- Section Header & Controls -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span>📢</span> Campus Announcements
          </h2>
          <p class="text-xs text-gray-400">Official updates from administration, exam cell, placement, and departments.</p>
        </div>

        ${isAdmin ? `
          <button 
            onclick="window.openNewAnnouncementModal()"
            class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>➕</span> Create Announcement
          </button>
        ` : ''}
      </div>

      <!-- Category Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        ${categories.map(cat => `
          <button 
            onclick="window.setAnnouncementCategory('${cat}')"
            class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${activeCategory === cat ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-gray-200'}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Announcements Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${announcements.length === 0 ? `
          <div class="col-span-full glass-card p-12 text-center text-gray-500">
            <span class="text-3xl block mb-2">📭</span>
            No announcements found in category "${activeCategory}".
          </div>
        ` : announcements.map(a => `
          <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 border ${a.isImportant ? 'border-amber-500/40 shadow-amber-500/5' : 'border-gray-800'}">
            
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  ${a.category}
                </span>
                ${a.isImportant ? `
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    ⚠️ IMPORTANT
                  </span>
                ` : ''}
              </div>

              <h3 class="text-lg font-bold text-white">${Security.sanitizeHTML(a.title)}</h3>
              <p class="text-xs text-gray-400 mt-2 leading-relaxed">${Security.sanitizeHTML(a.content)}</p>
            </div>

            <div class="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-500">
              <span class="font-medium text-gray-400">Published by: ${a.author}</span>
              <span>${a.date}</span>
            </div>

            ${isAdmin ? `
              <div class="pt-2 flex items-center justify-end gap-2 border-t border-gray-800/40">
                <button onclick="window.deleteAnnouncement('${a.id}')" class="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1">Delete</button>
              </div>
            ` : ''}

          </div>
        `).join('')}
      </div>

    </div>
  `;
}
