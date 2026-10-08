/**
 * SMART CAMPUS - Global Search View Component
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { Security } from '../security.js';

export function renderSearch() {
  const query = Store.getState().globalSearchQuery.toLowerCase().trim();

  if (!query) {
    return `
      <div class="glass-card p-12 text-center text-gray-500 animate-fadeIn">
        <span class="text-4xl block mb-3">🔍</span>
        <h3 class="text-lg font-bold text-white">Global Campus Search</h3>
        <p class="text-xs text-gray-400 mt-1">Type in the top search bar to find announcements, hackathons, locations, services, or complaints.</p>
      </div>
    `;
  }

  const announcements = DB.get('ANNOUNCEMENTS').filter(a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query));
  const events = DB.get('EVENTS').filter(e => e.name.toLowerCase().includes(query) || e.description.toLowerCase().includes(query));
  const locations = DB.get('LOCATIONS').filter(l => l.name.toLowerCase().includes(query) || l.description.toLowerCase().includes(query));
  const services = DB.get('SERVICES').filter(s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query));
  const complaints = DB.get('COMPLAINTS').filter(c => c.id.toLowerCase().includes(query) || c.title.toLowerCase().includes(query));

  const totalResults = announcements.length + events.length + locations.length + services.length + complaints.length;

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <div class="glass-card p-6 rounded-2xl">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <span>🔍</span> Search Results for "<span class="text-cyan-400">${Security.sanitizeHTML(query)}</span>"
        </h2>
        <p class="text-xs text-gray-400 mt-1">Found ${totalResults} matching results across campus modules.</p>
      </div>

      ${totalResults === 0 ? `
        <div class="glass-card p-12 text-center text-gray-500">
          <span class="text-3xl block mb-2">🚫</span>
          No matching campus records found. Try searching for "exam", "hackathon", "library", or "SC-2026".
        </div>
      ` : ''}

      ${announcements.length > 0 ? `
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-cyan-400 uppercase tracking-wider">📢 Announcements (${announcements.length})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${announcements.map(a => `
              <div class="glass-card p-4 rounded-xl border border-gray-800">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-cyan-400">${a.category}</span>
                <h4 class="text-sm font-bold text-white mt-1">${a.title}</h4>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2">${a.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${events.length > 0 ? `
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-blue-400 uppercase tracking-wider">📅 Events & Workshops (${events.length})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${events.map(e => `
              <div class="glass-card p-4 rounded-xl border border-gray-800">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-blue-400">${e.category}</span>
                <h4 class="text-sm font-bold text-white mt-1">${e.name}</h4>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2">${e.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${locations.length > 0 ? `
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">📍 Campus Locations (${locations.length})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${locations.map(l => `
              <div class="glass-card p-4 rounded-xl border border-gray-800">
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-emerald-400">${l.code}</span>
                <h4 class="text-sm font-bold text-white mt-1">${l.name}</h4>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2">${l.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${complaints.length > 0 ? `
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-amber-400 uppercase tracking-wider">🔧 Complaints & Issues (${complaints.length})</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${complaints.map(c => `
              <div class="glass-card p-4 rounded-xl border border-gray-800">
                <span class="text-xs font-mono font-bold text-cyan-400">${c.id}</span>
                <h4 class="text-sm font-bold text-white mt-1">${c.title}</h4>
                <p class="text-xs text-gray-400 mt-1">${c.location}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}
