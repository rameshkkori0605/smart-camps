/**
 * SMART CAMPUS - Normal Campus Map Component (2D GPS Interactive Map)
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { DB } from '../db.js';
import { Security } from '../security.js';

export function renderMap() {
  const locations = DB.get('LOCATIONS') || [];
  const activeLocId = window.selectedMapLocationId || locations[0]?.id;
  const activeLoc = locations.find(l => l.id === activeLocId) || locations[0];

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- Header -->
      <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-cyan-500/30">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span>🗺️</span> Sapthagiri NPS University Campus Map
          </h2>
          <p class="text-xs text-gray-400">Interactive 2D GPS Location Finder for academic blocks, labs, canteen, and hostels.</p>
        </div>

        <div class="text-xs text-right bg-gray-900/90 px-3.5 py-1.5 rounded-xl border border-gray-800">
          <span class="text-gray-400">Map Mode: </span>
          <span class="font-bold text-cyan-400">📍 2D GPS Grid & Location Pins</span>
        </div>
      </div>

      <!-- Normal 2D Interactive Map Grid Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Interactive 2D Map Canvas -->
        <div class="lg:col-span-2 glass-card p-4 rounded-2xl border border-gray-800 relative overflow-hidden bg-gray-950/80 min-h-[420px] flex flex-col justify-between">
          
          <div class="relative w-full h-80 rounded-xl bg-[#0d1322] border border-gray-800 overflow-hidden flex items-center justify-center p-4">
            
            <!-- Campus Map Grid Lines -->
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

            <!-- Campus Road Network Visual Lines -->
            <svg class="absolute inset-0 w-full h-full stroke-cyan-500/20" stroke-width="2" fill="none">
              <line x1="10%" y1="50%" x2="90%" y2="50%" stroke-dasharray="4" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" stroke-dasharray="4" />
              <circle cx="50%" cy="50%" r="20%" stroke="#06b6d4" stroke-opacity="0.3" />
            </svg>

            <!-- Map Location Pins Grid -->
            <div class="relative z-10 w-full h-full flex flex-wrap items-center justify-around gap-4 p-4">
              ${locations.map(loc => `
                <button 
                  onclick="window.selectMapLocation('${loc.id}')"
                  class="p-2.5 rounded-xl transition transform hover:scale-110 flex items-center gap-2 text-xs font-bold shadow-lg ${loc.id === activeLoc.id ? 'bg-cyan-500 text-gray-950 ring-2 ring-cyan-400 scale-105' : 'bg-gray-900/90 text-cyan-400 border border-gray-700 hover:border-cyan-400'}"
                >
                  <span>📍</span>
                  <span>${loc.code}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="mt-3 p-3 rounded-xl bg-gray-900/90 border border-gray-800 flex items-center justify-between text-xs">
            <span class="text-gray-400">Click any location pin to view details.</span>
            <span class="text-cyan-400 font-bold">Selected: ${activeLoc.name} (${activeLoc.code})</span>
          </div>

        </div>

        <!-- Selected Location Details Panel -->
        <div class="glass-card p-6 rounded-2xl border border-cyan-500/30 flex flex-col justify-between space-y-4">
          <div>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ${activeLoc.category}
            </span>
            <h3 class="text-xl font-extrabold text-white mt-2">${Security.sanitizeHTML(activeLoc.name)}</h3>
            <p class="text-xs text-cyan-400 font-mono font-semibold mt-0.5">Code: ${activeLoc.code}</p>
            <p class="text-xs text-gray-300 mt-3 leading-relaxed">${Security.sanitizeHTML(activeLoc.description)}</p>
          </div>

          <div class="space-y-2 pt-4 border-t border-gray-800 text-xs">
            <div class="flex items-center justify-between text-gray-400">
              <span>Latitude:</span>
              <span class="font-mono text-gray-200 font-bold">${activeLoc.lat} N</span>
            </div>
            <div class="flex items-center justify-between text-gray-400">
              <span>Longitude:</span>
              <span class="font-mono text-gray-200 font-bold">${activeLoc.lng} E</span>
            </div>
            <button 
              onclick="alert('🧭 Directions loaded: Route from Main Gate to ${activeLoc.name}')"
              class="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition"
            >
              Get GPS Campus Directions →
            </button>
          </div>
        </div>

      </div>

      <!-- Campus Directory Table -->
      <div class="glass-card p-6 rounded-2xl border border-gray-800 space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>📍</span> Full Campus Directory Locations (${locations.length})
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${locations.map(loc => `
            <div 
              onclick="window.selectMapLocation('${loc.id}')"
              class="glass-card p-4 rounded-xl border border-gray-800 hover:border-cyan-500/50 cursor-pointer transition flex items-start gap-3 ${loc.id === activeLoc.id ? 'border-cyan-500/60 bg-cyan-500/5' : ''}"
            >
              <div class="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-cyan-400 font-bold text-sm shrink-0">
                ${loc.code}
              </div>
              <div>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-cyan-400 border border-gray-700">${loc.category}</span>
                <h4 class="text-sm font-bold text-white mt-1">${loc.name}</h4>
                <p class="text-xs text-gray-400 mt-0.5 line-clamp-2">${loc.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
