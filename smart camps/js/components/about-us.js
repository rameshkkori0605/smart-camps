/**
 * SMART CAMPUS - About Us System Component
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

export function renderAboutUsSection() {
  return `
    <section class="glass-card p-6 md:p-10 rounded-3xl border border-gray-800 space-y-8 mt-12">
      
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div class="flex items-center gap-4">
          <img src="assets/logo.png" alt="Sapthagiri Logo" class="w-14 h-14 object-contain bg-white/10 p-1.5 rounded-2xl border border-white/20" />
          <div>
            <h2 class="text-2xl font-black text-white tracking-tight">ABOUT SAPTHAGIRI NPS UNIVERSITY</h2>
            <p class="text-xs text-cyan-400 font-semibold">Bengaluru, Karnataka • Empowering Future Tech Leaders</p>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs font-bold text-gray-400">
          <span class="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400">🏆 UGC Recognized</span>
          <span class="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-emerald-400">⭐ NAAC Accredited</span>
        </div>
      </div>

      <!-- Overview Grid with Real Campus Photos (Requirement 3 & 4) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        <div class="space-y-4">
          <h3 class="text-xl font-extrabold text-white">Engineering Excellence & Innovation</h3>
          <p class="text-xs md:text-sm text-gray-300 leading-relaxed">
            Sapthagiri NPS University is a premier higher education institution located in Bengaluru, Karnataka. Renowned for its state-of-the-art academic infrastructure, research innovation, and high placement records, the University offers undergraduate, postgraduate, and doctoral programs in Engineering, Management, Computer Applications, and Applied Sciences.
          </p>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-lg block">🎯 Vision</span>
              <p class="text-gray-400 mt-1">To be a globally recognized university fostering technical innovation, ethical values, and research leadership.</p>
            </div>
            <div class="p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-lg block">💡 Mission</span>
              <p class="text-gray-400 mt-1">Provide quality industry-aligned education, modern lab facilities, and holistic student career development.</p>
            </div>
          </div>
        </div>

        <!-- Campus Image Gallery Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-2xl overflow-hidden border border-gray-800 relative group">
            <img src="assets/entrance.png" alt="Sapthagiri Main Entrance" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-3 flex items-end">
              <span class="text-[11px] font-bold text-white">A-Block Main Building</span>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden border border-gray-800 relative group">
            <img src="assets/classroom_block_a.png" alt="6th Floor Smart Classroom" class="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent p-3 flex items-end">
              <span class="text-[11px] font-bold text-cyan-400">A-Block 6th Floor Classroom</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Quick Contact Info Footer -->
      <div class="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div>📍 <strong>Address:</strong> Sapthagiri NPS University Campus, Chikkasandra, Hesaraghatta Main Road, Bengaluru – 560057</div>
        <div>📞 <strong>Helpdesk:</strong> +91 80 2837 2800 | ✉️ <strong>Email:</strong> info@sapthagiri.edu.in</div>
      </div>

    </section>
  `;
}
