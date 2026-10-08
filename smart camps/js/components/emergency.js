/**
 * SMART CAMPUS - Emergency & Safety Component
 */

export function renderEmergency() {
  const emergencyContacts = [
    { name: 'Campus Security Control Room', phone: '+91 80 2345 0000', location: 'Main Gate Security Block', icon: '👮' },
    { name: '24/7 Medical Center & Hospital', phone: '+91 80 2345 9999', location: 'Medical Building Wing A', icon: '🏥' },
    { name: 'Campus Emergency Ambulance', phone: '+91 80 2345 9111', location: 'Health Center Parking', icon: '🚑' },
    { name: 'Women & Student Safety Cell', phone: '+91 80 2345 8888', location: 'Admin Block Room 102', icon: '🛡️' },
    { name: 'Fire & Rescue Safety Desk', phone: '+91 80 2345 1010', location: 'Central Security Tower', icon: '🚒' },
    { name: 'Disaster Management Cell', phone: '+91 80 2345 5555', location: 'Administrative Block', icon: '🚨' }
  ];

  return `
    <div class="space-y-6 animate-fadeIn">
      
      <!-- High Visibility Warning Banner -->
      <div class="glass-card p-6 rounded-2xl bg-gradient-to-r from-rose-950/80 via-gray-900 to-gray-900 border border-rose-500/40">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-3xl font-bold animate-pulse shrink-0">
            🚨
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">Emergency SOS & Campus Helpline</h2>
            <p class="text-xs text-rose-200/80 mt-1">
              For immediate physical danger, medical emergencies, or security incidents, call the numbers below or click SOS Alert to notify campus guards.
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Action SOS Trigger -->
      <div class="glass-card p-8 rounded-2xl text-center space-y-4 border border-rose-500/30 bg-gray-950/50">
        <h3 class="text-xl font-bold text-white">One-Touch Campus SOS Emergency Alert</h3>
        <p class="text-xs text-gray-400 max-w-md mx-auto">
          Clicking the SOS button below will broadcast your current location (Main Campus Coordinates) to the Security Command Center.
        </p>
        <button 
          onclick="window.triggerSOSAlert()"
          class="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base transition shadow-2xl shadow-rose-600/40 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto"
        >
          <span>🚨</span> BROADCAST SOS ALERT NOW
        </button>
      </div>

      <!-- Emergency Directory Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${emergencyContacts.map(c => `
          <div class="glass-card p-6 rounded-2xl border border-gray-800 hover:border-rose-500/40 transition flex flex-col justify-between space-y-4">
            <div class="flex items-start gap-3">
              <span class="text-3xl">${c.icon}</span>
              <div>
                <h3 class="text-base font-bold text-white">${c.name}</h3>
                <p class="text-xs text-gray-400 mt-0.5">📍 ${c.location}</p>
              </div>
            </div>

            <div class="pt-3 border-t border-gray-800 flex items-center justify-between">
              <span class="text-sm font-mono font-bold text-rose-400">${c.phone}</span>
              <a 
                href="tel:${c.phone}" 
                class="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition border border-rose-500/30"
              >
                Call Now 📞
              </a>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
