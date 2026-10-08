/**
 * SMART CAMPUS - Campus Services Directory Component
 */

import { DB } from '../db.js';

export function renderServices() {
  const services = DB.get('SERVICES');

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- Header -->
      <div class="glass-card p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
          <span>🏛️</span> Campus Services Directory
        </h2>
        <p class="text-xs text-gray-400">Explore key campus facilities, operational timings, and contact channels.</p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${services.map(s => `
          <div class="glass-card p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4">
            <div>
              <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                ${s.category}
              </span>
              <h3 class="text-lg font-bold text-white mt-2">${s.name}</h3>
              <p class="text-xs text-gray-400 mt-1 leading-relaxed">${s.description}</p>
            </div>

            <div class="space-y-1.5 pt-3 border-t border-gray-800 text-xs text-gray-300 font-medium">
              <p>📍 <strong>Location:</strong> ${s.location}</p>
              <p>🕒 <strong>Hours:</strong> ${s.hours}</p>
              <p>📞 <strong>Contact:</strong> ${s.contact}</p>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
