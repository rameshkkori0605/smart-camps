/**
 * SMART CAMPUS - Admissions Advertisement Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

export function renderAdmissionsBanner() {
  return `
    <div class="glass-card p-6 md:p-8 rounded-3xl border border-amber-500/40 relative overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-amber-950/40 shadow-2xl space-y-6">
      
      <!-- Background Entrance Image Overlay -->
      <div class="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none" style="background-image: url('assets/entrance.png');"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        <div class="space-y-3 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <span>🔥 ADMISSIONS OPEN 2026–2027</span>
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>

          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">
            JOIN <span class="text-amber-400">SAPTHAGIRI NPS UNIVERSITY</span>, BENGALURU
          </h2>

          <p class="text-xs md:text-sm text-gray-300 leading-relaxed">
            Applications are invited for B.Tech (CS, AI/ML, EC, Mechanical), M.Tech, MBA, MCA, and Applied Sciences. Experience world-class smart classrooms, industry tie-ups, 100% placement support, and modern research labs.
          </p>

          <div class="flex flex-wrap gap-2 text-xs font-semibold pt-1">
            <span class="px-2.5 py-1 rounded-lg bg-gray-900 text-cyan-400 border border-gray-800">✅ B.Tech Computer Science & AI</span>
            <span class="px-2.5 py-1 rounded-lg bg-gray-900 text-blue-400 border border-gray-800">✅ MBA & MCA 2026 Batch</span>
            <span class="px-2.5 py-1 rounded-lg bg-gray-900 text-emerald-400 border border-gray-800">✅ Merit Scholarships Available</span>
          </div>
        </div>

        <div class="bg-gray-900/90 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3 min-w-[260px] shadow-xl relative z-10">
          <span class="text-3xl block">🎓</span>
          <h3 class="text-base font-bold text-white">Apply for Admission</h3>
          <p class="text-xs text-gray-400">Seats filling fast for 2026 Batch.</p>
          <button 
            onclick="window.openAdmissionFormModal()"
            class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs transition uppercase tracking-wider shadow-lg shadow-amber-500/20"
          >
            Apply Online Now →
          </button>
        </div>

      </div>

    </div>
  `;
}
