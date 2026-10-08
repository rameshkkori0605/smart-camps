/**
 * SMART CAMPUS - Header & Navigation Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { Store } from '../store.js';
import { DB } from '../db.js';
import { CONFIG } from '../config.js';

export function renderHeader() {
  const state = Store.getState();
  const activeUser = state.activeUser || DB.getActiveUser();
  const isAuthenticated = activeUser && activeUser.isLoggedIn === true && activeUser.role !== 'GUEST';

  let navItems = [];
  if (isAuthenticated) {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
      { id: 'announcements', label: 'Announcements', icon: '📢' },
      { id: 'events', label: 'Events', icon: '📅' },
      { id: 'fees', label: 'College Fees', icon: '💳' },
      { id: 'map', label: 'Campus GPS Map', icon: '🗺️' },
      { id: 'complaints', label: 'Report Issue', icon: '🔧' },
      { id: 'services', label: 'Services', icon: '🏛️' },
      { id: 'emergency', label: 'Emergency SOS', icon: '🚨' },
      { id: 'feedback', label: 'Feedback', icon: '⭐' }
    ];

    if (activeUser.role === CONFIG.ROLES.TECH_TEAM || activeUser.role === CONFIG.ROLES.ADMIN) {
      navItems.push({ id: 'tech', label: 'Tech Portal', icon: '💻' });
    }

    if (activeUser.role === CONFIG.ROLES.ADMIN) {
      navItems.push({ id: 'admin', label: 'Admin Panel', icon: '🛡️' });
    }
  } else {
    navItems = [
      { id: 'welcome', label: 'Welcome Home', icon: '🏛️' }
    ];
  }

  return `
    <header class="glass-nav sticky top-0 z-50 px-4 lg:px-8 py-3.5 transition-all border-b border-cyan-500/20" role="banner">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Brand & Tagline with Official University Crest Logo -->
        <div class="flex items-center justify-between w-full md:w-auto">
          <div class="flex items-center gap-3 cursor-pointer" onclick="window.appStore.setTab('${isAuthenticated ? 'dashboard' : 'welcome'}')">
            <img src="assets/logo.png" alt="Sapthagiri NPS University Logo" class="w-10 h-10 object-contain drop-shadow-md rounded-lg bg-white/5 p-0.5 border border-white/10" />
            <div>
              <h1 class="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                SAPTHAGIRI NPS UNIVERSITY
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">BENGALURU</span>
              </h1>
              <p class="text-[11px] text-gray-400 font-medium">One Smart Platform for a Better Campus.</p>
            </div>
          </div>

          <!-- Mobile Menu Toggle Button -->
          <button id="mobile-menu-btn" aria-label="Toggle Navigation Menu" class="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800">
            ☰
          </button>
        </div>

        <!-- Global Search Bar -->
        <div class="w-full md:max-w-xs relative">
          <input 
            type="text" 
            id="global-search-input"
            value="${state.globalSearchQuery}"
            placeholder="Search campus information..." 
            class="w-full bg-gray-900/90 border border-gray-700/60 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            aria-label="Global Search Input"
          />
          <span class="absolute right-3 top-2.5 text-gray-400 text-xs">🔍</span>
        </div>

        <!-- Role Login Status & Portal Access -->
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          ${isAuthenticated ? `
            <button 
              onclick="window.openLoginModal()" 
              class="px-3 py-1.5 rounded-xl bg-gray-900 border border-cyan-500/40 hover:bg-gray-800 text-xs font-semibold text-cyan-400 flex items-center gap-2 transition shadow-sm"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>${activeUser.name} (${activeUser.role})</span>
            </button>
            <button 
              onclick="window.handleUserLogout()" 
              class="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold text-rose-300 transition flex items-center gap-1 shadow-sm"
            >
              🚪 Log Out
            </button>
            <button 
              onclick="window.appStore.setTab('emergency')" 
              class="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition flex items-center gap-1.5 shadow-sm"
            >
              <span>🚨</span>
              <span class="hidden sm:inline">SOS Help</span>
            </button>
          ` : `
            <button 
              onclick="window.openLoginModal()" 
              class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 uppercase tracking-wider"
            >
              🔑 Log In to Access Campus
            </button>
          `}
        </div>

      </div>

      <!-- Navigation Tabs -->
      <nav id="nav-menu" class="max-w-7xl mx-auto mt-3 pt-3 border-t border-gray-800/60 flex items-center gap-1 overflow-x-auto scrollbar-none" role="navigation" aria-label="Main Navigation">
        ${navItems.map(item => `
          <button 
            onclick="window.appStore.setTab('${item.id}')"
            class="px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition flex items-center gap-2 ${state.currentTab === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}"
            aria-current="${state.currentTab === item.id ? 'page' : 'false'}"
          >
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </nav>
    </header>
  `;
}
          </button>
        `).join('')}
      </nav>
    </header>
  `;
}
