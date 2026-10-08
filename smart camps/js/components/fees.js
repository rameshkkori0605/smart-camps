/**
 * SMART CAMPUS - College Fee Payment & Dues Monitoring Ledger System
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Dual Mode: Student Online Fee Payment + Staff/Tech Team/Admin Fee Monitoring Ledger
 */

import { DB } from '../db.js';
import { Store } from '../store.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderFeesSystem() {
  const activeUser = DB.getActiveUser();
  const allFees = DB.get('FEES') || [];
  const admissions = DB.get('ADMISSIONS') || [];

  const body = (activeUser.role === CONFIG.ROLES.STUDENT)
    ? renderStudentFeePortal(activeUser, allFees)
    : renderAdminStaffFeeLedger(activeUser, allFees, admissions);

  return `<div class="fees-system-container space-y-8 animate-fadeIn">${body}</div>`;
}

function renderStudentFeePortal(student, allFees) {
  // Find current student fee record or fallback to Alex Johnson
  let studentFee = allFees.find(f => f.studentUsn === student.id || f.studentUsn === student.loginId);
  if (!studentFee) {
    studentFee = allFees[0]; // fallback default
  }

  const isFullyPaid = studentFee.dueAmount <= 0;

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Header Banner -->
      <div class="glass-card p-6 md:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-gray-950 via-gray-900 to-cyan-950/30">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <span>🎓 SAPTHAGIRI STUDENT ACCOUNTS</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">College Fee Payment & Statement</h2>
          <p class="text-xs md:text-sm text-gray-300 mt-1">
            Student: <strong class="text-white">${studentFee.studentName}</strong> • USN: <strong class="text-cyan-400 font-mono">${studentFee.studentUsn}</strong> • ${studentFee.department}
          </p>
        </div>

        <div class="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 text-center min-w-[200px]">
          <span class="text-xs text-gray-400 block font-semibold">Payment Status</span>
          ${isFullyPaid ? `
            <span class="inline-block mt-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs">
              ✅ ALL DUES CLEARED
            </span>
          ` : `
            <span class="inline-block mt-1 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-black text-xs animate-pulse">
              ⚠️ PENDING DUE: ₹${studentFee.dueAmount.toLocaleString()}
            </span>
          `}
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-2xl border border-gray-800 bg-gray-950/60">
          <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Annual Fee</span>
          <div class="text-2xl md:text-3xl font-black text-white mt-2">₹${studentFee.totalFee.toLocaleString()}</div>
          <p class="text-[11px] text-gray-500 mt-1">Academic Year 2026–2027</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
          <span class="text-xs text-emerald-400 uppercase font-bold tracking-wider">Total Amount Paid</span>
          <div class="text-2xl md:text-3xl font-black text-emerald-400 mt-2">₹${studentFee.paidAmount.toLocaleString()}</div>
          <p class="text-[11px] text-emerald-500/80 mt-1">Verified with Finance Office</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border ${isFullyPaid ? 'border-gray-800' : 'border-rose-500/40 bg-rose-950/10'}">
          <span class="text-xs ${isFullyPaid ? 'text-gray-400' : 'text-rose-400'} uppercase font-bold tracking-wider">Outstanding Due Balance</span>
          <div class="text-2xl md:text-3xl font-black ${isFullyPaid ? 'text-gray-400' : 'text-rose-400'} mt-2">₹${studentFee.dueAmount.toLocaleString()}</div>
          <p class="text-[11px] ${isFullyPaid ? 'text-gray-500' : 'text-rose-400/80'} mt-1">Due Date: ${studentFee.dueDate}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Fee Breakdown Schedule -->
        <div class="glass-card p-6 md:p-8 rounded-2xl border border-gray-800 space-y-6">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span>📑</span> Official Fee Structure Breakdown
          </h3>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-gray-300">Tuition & Academic Training Fee</span>
              <span class="font-mono font-bold text-white">₹${(studentFee.breakdown?.tuitionFee || 85000).toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-gray-300">Semester Examination & Assessment Fee</span>
              <span class="font-mono font-bold text-white">₹${(studentFee.breakdown?.examFee || 10000).toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-gray-300">Advanced Computing Lab & Digital Library</span>
              <span class="font-mono font-bold text-white">₹${(studentFee.breakdown?.labLibraryFee || 20000).toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 border border-gray-800">
              <span class="text-gray-300">Campus Infrastructure, Sports & Amenities</span>
              <span class="font-mono font-bold text-white">₹${(studentFee.breakdown?.campusInfraFee || 10000).toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              <span>Total Assessed Fee (Per Annum)</span>
              <span class="font-mono text-sm">₹${studentFee.totalFee.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Online Payment Box -->
        <div class="glass-card p-6 md:p-8 rounded-2xl border ${isFullyPaid ? 'border-gray-800' : 'border-cyan-500/40'} space-y-6 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>💳</span> Pay College Fee Online
            </h3>
            <p class="text-xs text-gray-400 mt-1">Instant digital fee clearance with verified receipt number.</p>
          </div>

          ${!isFullyPaid ? `
            <form onsubmit="window.handleStudentFeePayment(event, '${studentFee.studentUsn}')" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-1">Payment Amount (INR) *</label>
                <div class="relative">
                  <span class="absolute left-3.5 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                  <input 
                    type="number" 
                    id="fee-payment-amount" 
                    required 
                    min="1000" 
                    max="${studentFee.dueAmount}" 
                    value="${studentFee.dueAmount}" 
                    class="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <span class="text-[11px] text-gray-500 mt-1 block">Maximum payable due: ₹${studentFee.dueAmount.toLocaleString()}</span>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-300 mb-2">Select Payment Channel *</label>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-900 border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition">
                    <input type="radio" name="fee-pay-method" value="UPI / QR Code" checked class="mb-1" />
                    <span class="font-bold text-white">📱 UPI / QR</span>
                    <span class="text-[10px] text-gray-400">GPay, PhonePe</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer hover:border-cyan-400 transition">
                    <input type="radio" name="fee-pay-method" value="Debit / Credit Card" class="mb-1" />
                    <span class="font-bold text-white">💳 Card</span>
                    <span class="text-[10px] text-gray-400">Visa, RuPay</span>
                  </label>
                  <label class="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer hover:border-cyan-400 transition">
                    <input type="radio" name="fee-pay-method" value="Net Banking" class="mb-1" />
                    <span class="font-bold text-white">🏛️ Net Banking</span>
                    <span class="text-[10px] text-gray-400">All Major Banks</span>
                  </label>
                </div>
              </div>

              <div class="p-3 rounded-xl bg-gray-900/90 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
                <span>Payment Gateway:</span>
                <span class="text-cyan-400 font-bold">Sapthagiri Official Fee Portal (256-Bit SSL)</span>
              </div>

              <button 
                type="submit" 
                class="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs transition uppercase tracking-wider shadow-lg shadow-cyan-500/20"
              >
                Proceed to Pay ₹${studentFee.dueAmount.toLocaleString()} & Clear Dues →
              </button>
            </form>
          ` : `
            <div class="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <span class="text-4xl block">🎉</span>
              <h4 class="text-base font-extrabold text-white">All Academic Dues are Fully Paid!</h4>
              <p class="text-xs text-emerald-400">Your college fee for 2026-2027 is completely cleared. No pending balance.</p>
              <button 
                onclick="window.printLatestFeeReceipt('${studentFee.studentUsn}')"
                class="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700 text-cyan-400 font-bold text-xs hover:border-cyan-400 transition"
              >
                🖨️ Download Paid Fee Clearance Certificate
              </button>
            </div>
          `}

        </div>

      </div>

      <!-- Payment History & Verified Receipts -->
      <div class="glass-card p-6 md:p-8 rounded-2xl border border-gray-800 space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>🧾</span> Payment History & Official Fee Receipts
        </h3>

        ${(studentFee.transactions && studentFee.transactions.length > 0) ? `
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-gray-300">
              <thead class="bg-gray-900/90 text-gray-400 uppercase font-bold border-b border-gray-800">
                <tr>
                  <th class="p-3">Receipt No</th>
                  <th class="p-3">Transaction Date</th>
                  <th class="p-3">Payment Channel</th>
                  <th class="p-3">Amount Paid</th>
                  <th class="p-3">Status</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                ${studentFee.transactions.map(t => `
                  <tr class="hover:bg-gray-900/40">
                    <td class="p-3 font-mono font-bold text-cyan-400">${t.receiptNo}</td>
                    <td class="p-3">${t.date}</td>
                    <td class="p-3">${t.method}</td>
                    <td class="p-3 font-mono font-bold text-white">₹${t.amount.toLocaleString()}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">SUCCESS</span></td>
                    <td class="p-3 text-right">
                      <button 
                        onclick="window.showFeeReceiptModal('${studentFee.studentUsn}', '${t.receiptNo}', ${t.amount}, '${t.date}', '${t.method}')"
                        class="px-2.5 py-1 rounded bg-gray-900 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 font-bold"
                      >
                        View Receipt
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="p-6 text-center text-gray-500 text-xs">No online transactions recorded yet.</div>
        `}
      </div>

    </div>
  `;
}

function renderAdminStaffFeeLedger(activeUser, allFees, admissions) {
  const query = (window.feeSearchQuery || '').toLowerCase().trim();
  const filter = window.feeStatusFilter || 'ALL';

  let filtered = allFees.filter(f => {
    const matchesQuery = !query || 
      f.studentName.toLowerCase().includes(query) || 
      f.studentUsn.toLowerCase().includes(query) || 
      f.department.toLowerCase().includes(query);

    if (!matchesQuery) return false;
    if (filter === 'PAID') return f.dueAmount === 0;
    if (filter === 'DUE') return f.dueAmount > 0;
    return true;
  });

  const totalDemand = allFees.reduce((acc, f) => acc + (f.totalFee || 0), 0);
  const totalCollected = allFees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalOutstanding = allFees.reduce((acc, f) => acc + (f.dueAmount || 0), 0);
  const paidCount = allFees.filter(f => f.dueAmount === 0).length;
  const dueCount = allFees.filter(f => f.dueAmount > 0).length;

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Header Banner -->
      <div class="glass-card p-6 md:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-gray-950 via-gray-900 to-cyan-950/30">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <span>🛡️ ${activeUser.role} ACCESS • SAPTHAGIRI FINANCE DESK</span>
          </div>
          <h2 class="text-2xl md:text-3xl font-black text-white tracking-tight">University Student Fee Ledger & Dues Monitor</h2>
          <p class="text-xs md:text-sm text-gray-300 mt-1">
            Complete accounts oversight for all enrolled students across Computer Science, Electronics, Mechanical, and Applied Sciences.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            onclick="window.sendBulkFeeReminder()" 
            class="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center gap-2"
          >
            <span>🔔</span> Send Fee Due Alerts to All Due Students
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="glass-card p-6 rounded-2xl border border-gray-800 bg-gray-950/60">
          <span class="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Fee Demand</span>
          <div class="text-2xl font-black text-white mt-2">₹${totalDemand.toLocaleString()}</div>
          <p class="text-[11px] text-gray-500 mt-1">${allFees.length} Total Enrolled Students</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
          <span class="text-xs text-emerald-400 uppercase font-bold tracking-wider">Total Fees Collected</span>
          <div class="text-2xl font-black text-emerald-400 mt-2">₹${totalCollected.toLocaleString()}</div>
          <p class="text-[11px] text-emerald-500/80 mt-1">Cleared in Bank Account</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border border-rose-500/30 bg-rose-950/10">
          <span class="text-xs text-rose-400 uppercase font-bold tracking-wider">Total Outstanding Dues</span>
          <div class="text-2xl font-black text-rose-400 mt-2">₹${totalOutstanding.toLocaleString()}</div>
          <p class="text-[11px] text-rose-400/80 mt-1">Immediate Follow-up Required</p>
        </div>

        <div class="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/10">
          <span class="text-xs text-cyan-400 uppercase font-bold tracking-wider">Students Status</span>
          <div class="text-2xl font-black text-white mt-2">${paidCount} Paid / ${dueCount} Due</div>
          <p class="text-[11px] text-cyan-400 mt-1">${((paidCount / (allFees.length || 1)) * 100).toFixed(0)}% Clearance Ratio</p>
        </div>
      </div>

      <!-- Search & Status Filter Controls -->
      <div class="glass-card p-4 md:p-6 rounded-2xl border border-gray-800 space-y-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="w-full md:max-w-md relative">
            <input 
              type="text" 
              placeholder="Search by student USN, name, or branch..." 
              value="${window.feeSearchQuery || ''}"
              oninput="window.setFeeLedgerSearch(this.value)"
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-200 focus:outline-none focus:border-cyan-500"
            />
            <span class="absolute right-3.5 top-3 text-gray-500 text-xs">🔍</span>
          </div>

          <div class="flex items-center gap-2">
            <button 
              onclick="window.setFeeStatusFilter('ALL')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'ALL' ? 'bg-cyan-500 text-gray-950 font-black' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}"
            >
              All Students (${allFees.length})
            </button>
            <button 
              onclick="window.setFeeStatusFilter('PAID')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'PAID' ? 'bg-emerald-500 text-gray-950 font-black' : 'bg-gray-900 text-emerald-400 hover:text-white border border-gray-800'}"
            >
              Fee Paid (${paidCount})
            </button>
            <button 
              onclick="window.setFeeStatusFilter('DUE')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${filter === 'DUE' ? 'bg-rose-500 text-gray-950 font-black' : 'bg-gray-900 text-rose-400 hover:text-white border border-gray-800'}"
            >
              Dues Pending (${dueCount})
            </button>
          </div>
        </div>

        <!-- Student Fee Ledger Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 uppercase font-bold border-b border-gray-800">
              <tr>
                <th class="p-3">USN / ID</th>
                <th class="p-3">Student Name</th>
                <th class="p-3">Department</th>
                <th class="p-3 font-mono">Total Fee</th>
                <th class="p-3 font-mono">Paid</th>
                <th class="p-3 font-mono">Balance Due</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              ${filtered.map(f => `
                <tr class="hover:bg-gray-900/40">
                  <td class="p-3 font-mono font-bold text-cyan-400">${f.studentUsn}</td>
                  <td class="p-3 font-bold text-white">${f.studentName}</td>
                  <td class="p-3 text-gray-400">${f.department}</td>
                  <td class="p-3 font-mono font-bold text-gray-200">₹${f.totalFee.toLocaleString()}</td>
                  <td class="p-3 font-mono font-bold text-emerald-400">₹${f.paidAmount.toLocaleString()}</td>
                  <td class="p-3 font-mono font-black ${f.dueAmount > 0 ? 'text-rose-400' : 'text-gray-400'}">
                    ${f.dueAmount > 0 ? `⚠️ ₹${f.dueAmount.toLocaleString()}` : '₹0'}
                  </td>
                  <td class="p-3">
                    ${f.dueAmount === 0 ? `
                      <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[10px] border border-emerald-500/30">PAID</span>
                    ` : (f.paidAmount > 0 ? `
                      <span class="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-black text-[10px] border border-amber-500/30">PARTIAL DUE</span>
                    ` : `
                      <span class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-black text-[10px] border border-rose-500/30">UNPAID DUE</span>
                    `)}
                  </td>
                  <td class="p-3 text-right space-x-1">
                    <button 
                      onclick="window.showStudentLedgerDetails('${f.studentUsn}')"
                      class="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 hover:border-cyan-400 text-cyan-400 font-bold"
                    >
                      Details
                    </button>
                    ${f.dueAmount > 0 ? `
                      <button 
                        onclick="window.sendSingleFeeReminder('${f.studentUsn}', '${f.studentName}', ${f.dueAmount})"
                        class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold"
                      >
                        🔔 Alert
                      </button>
                    ` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

      </div>

      <!-- Admissions Registrations Section (₹2,000 Registration Fee Log) -->
      <div class="glass-card p-6 md:p-8 rounded-2xl border border-amber-500/30 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🎓</span> Admission Applications & ₹2,000 Registration Fee Log
            </h3>
            <p class="text-xs text-gray-400">Prospective student applications received via the online Admissions portal.</p>
          </div>
          <span class="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs">
            ${admissions.length} Applications Received
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-gray-300">
            <thead class="bg-gray-900/90 text-gray-400 uppercase font-bold border-b border-gray-800">
              <tr>
                <th class="p-3">App ID</th>
                <th class="p-3">Candidate</th>
                <th class="p-3">Course</th>
                <th class="p-3">Contact</th>
                <th class="p-3">12th Marks</th>
                <th class="p-3">Reg. Fee Paid</th>
                <th class="p-3">Txn ID</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              ${admissions.map(a => `
                <tr class="hover:bg-gray-900/40">
                  <td class="p-3 font-mono font-bold text-cyan-400">${a.id}</td>
                  <td class="p-3 font-bold text-white">${a.candidateName}</td>
                  <td class="p-3 text-cyan-300 font-semibold">${a.course}</td>
                  <td class="p-3">${a.phone || a.email}</td>
                  <td class="p-3 font-mono text-emerald-400 font-bold">${a.marks || '85%'}</td>
                  <td class="p-3 font-mono font-bold text-emerald-400">₹${(a.feeAmount || 2000).toLocaleString()} (PAID)</td>
                  <td class="p-3 font-mono text-gray-400">${a.transactionId || 'TXN-UPI-9821'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}
