/**
 * SMART CAMPUS - Events Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Includes Add Event system for Admin, Staff, and Tech Team (hidden for Students).
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderEvents() {
  const activeUser = DB.getActiveUser();
  const events = DB.get('EVENTS');
  const registrations = DB.get('REGISTRATIONS');

  // Can Add Event: Admin, Staff, or Tech Team (EXCEPT Student)
  const canAddEvent = activeUser.role === CONFIG.ROLES.ADMIN || 
                      activeUser.role === CONFIG.ROLES.STAFF || 
                      activeUser.role === CONFIG.ROLES.TECH_TEAM;

  const registeredEventIds = registrations
    .filter(r => r.userId === activeUser.id)
    .map(r => r.eventId);

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- Section Header -->
      <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span>📅</span> Sapthagiri Campus Events & Hackathons
          </h2>
          <p class="text-xs text-gray-400">Discover upcoming technical hackathons, career workshops, and cultural festivals.</p>
        </div>

        ${canAddEvent ? `
          <button 
            onclick="window.openAddEventModal()"
            class="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>➕</span> Add New Campus Event
          </button>
        ` : `
          <span class="text-xs text-cyan-400 font-medium px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            🎟️ Student Event Pass Registration
          </span>
        `}
      </div>

      <!-- Events Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${events.map(evt => {
          const isRegistered = registeredEventIds.includes(evt.id);
          const seatsLeft = evt.capacity - evt.registrations;

          return `
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden border border-gray-800 hover:border-cyan-500/40">
              
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    ${evt.category}
                  </span>
                  <span class="text-[11px] text-gray-400 font-medium">
                    ${seatsLeft} / ${evt.capacity} Seats Left
                  </span>
                </div>

                <h3 class="text-lg font-bold text-white">${Security.sanitizeHTML(evt.name)}</h3>
                <p class="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">${Security.sanitizeHTML(evt.description)}</p>
              </div>

              <div class="space-y-2 py-3 border-y border-gray-800/80 text-xs">
                <div class="flex items-center gap-2 text-gray-300">
                  <span>📅</span> <span class="font-medium">${evt.date} (${evt.time})</span>
                </div>
                <div class="flex items-center gap-2 text-gray-300">
                  <span>📍</span> <span class="font-medium">${evt.location}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <span>👤</span> <span>Organizer: ${evt.organizer}</span>
                </div>
              </div>

              <div>
                ${isRegistered ? `
                  <button 
                    disabled 
                    class="w-full py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>✅</span> Registered for Event
                  </button>
                ` : `
                  <button 
                    onclick="window.registerForEvent('${evt.id}')"
                    class="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    <span>🎟️</span> Register Now
                  </button>
                `}
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
