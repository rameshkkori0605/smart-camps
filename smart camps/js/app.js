/**
 * SMART CAMPUS - Main Application Orchestrator
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { DB } from './db.js';
import { Store } from './store.js';
import { Security } from './security.js';
import { CONFIG } from './config.js';

import { initSpaceCursor } from './cursor-effect.js';
import { init3DCampus } from './3d-campus.js';

import { renderHeader } from './components/header.js';
import { renderWelcomePage } from './components/welcome.js';
import { renderDashboard } from './components/dashboard.js';
import { renderAnnouncements } from './components/announcements.js';
import { renderEvents } from './components/events.js';
import { renderMap } from './components/map.js';
import { renderComplaints } from './components/complaints.js';
import { renderEmergency } from './components/emergency.js';
import { renderServices } from './components/services.js';
import { renderFeedback } from './components/feedback.js';
import { renderAdminAnalytics } from './components/admin-analytics.js';
import { renderTechPortal } from './components/tech-portal.js';
import { renderSearch } from './components/search.js';
import { renderAdmissionsBanner } from './components/admissions.js';
import { renderAboutUsSection } from './components/about-us.js';
import { renderFeesSystem } from './components/fees.js';

import { openLoginModal, openStudentRegistrationModal } from './components/login-modal.js';
import { runSystemTests } from './tests/suite.test.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
  }

  init() {
    DB.init();
    initSpaceCursor();

    this.db = DB;
    this.store = Store;
    window.app = this;
    window.DB = DB;
    window.Store = Store;
    window.appDB = DB;
    window.appStore = Store;
    window.openLoginModal = openLoginModal;
    window.openStudentRegistrationModal = openStudentRegistrationModal;

    this.setupGlobalHandlers();

    Store.subscribe(() => this.render());
    this.render();
  }

  render() {
    const state = Store.getState();
    const currentTab = state.currentTab;

    let contentHTML = '';

    const activeUser = Store.getState().activeUser || DB.getActiveUser();
    const isAuthenticated = activeUser && activeUser.isLoggedIn === true && activeUser.role !== 'GUEST';

    if (state.globalSearchQuery && currentTab !== 'search') {
      contentHTML = renderSearch();
    } else {
      switch (currentTab) {
        case 'welcome':
          contentHTML = isAuthenticated ? renderDashboard() : renderWelcomePage();
          break;
        case 'dashboard':
          contentHTML = renderDashboard();
          break;
        case 'announcements':
          contentHTML = renderAnnouncements();
          break;
        case 'events':
          contentHTML = renderEvents();
          break;
        case 'fees':
          contentHTML = renderFeesSystem();
          break;
        case 'map':
          contentHTML = renderMap();
          break;
        case 'complaints':
          contentHTML = renderComplaints();
          break;
        case 'emergency':
          contentHTML = renderEmergency();
          break;
        case 'services':
          contentHTML = renderServices();
          break;
        case 'feedback':
          contentHTML = renderFeedback();
          break;
        case 'tech':
          contentHTML = renderTechPortal();
          break;
        case 'admin':
          contentHTML = renderAdminAnalytics();
          break;
        case 'search':
          contentHTML = renderSearch();
          break;
        default:
          contentHTML = isAuthenticated ? renderDashboard() : renderWelcomePage();
      }
    }

    this.appElement.innerHTML = `
      ${renderHeader()}
      <main id="main-content" class="max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-10" tabIndex="-1">
        ${contentHTML}
        ${!isAuthenticated ? `
          <div class="mt-12 space-y-12">
            ${renderAdmissionsBanner()}
            ${renderAboutUsSection()}
          </div>
        ` : ''}
      </main>
      <footer class="max-w-7xl mx-auto px-4 lg:px-8 py-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p>© 2026 SAPTHAGIRI NPS UNIVERSITY, BENGALURU • Smart Campus Platform</p>
        <div class="flex items-center gap-4">
          <button onclick="window.openLoginModal()" class="text-amber-400 font-bold hover:underline">
            🔑 Login (SNPSUADMIN)
          </button>
          <button onclick="window.runAutomatedTestsModal()" class="text-cyan-400 font-semibold hover:underline flex items-center gap-1">
            <span>🧪</span> Run System Test Suite
          </button>
          <a href="test.html" target="_blank" class="text-gray-400 hover:text-white">Standalone Test Runner →</a>
        </div>
      </footer>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          Store.setSearchQuery(e.target.value);
        }, 200);
      });
    }
  }

  setupGlobalHandlers() {
    // Admission Registration Modal with ₹2,000 Payment Option (Requirement 1)
    window.openAdmissionFormModal = () => {
      const existing = document.getElementById('admission-modal-root');
      if (existing) existing.remove();

      const modalHTML = `
        <div id="admission-modal-root" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div class="glass-card max-w-2xl w-full p-6 md:p-8 rounded-3xl border border-amber-500/50 relative space-y-6 shadow-2xl bg-gray-950/95 my-8">
            <button onclick="document.getElementById('admission-modal-root').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>

            <div class="text-center space-y-2 border-b border-gray-800 pb-4">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                <span>🎓 ADMISSIONS OPEN 2026–2027</span>
              </div>
              <h3 class="text-2xl font-black text-white">SAPTHAGIRI NPS UNIVERSITY</h3>
              <p class="text-xs text-gray-400">Official Online Admission Registration & Candidate Counseling Application</p>
            </div>

            <form onsubmit="window.handleAdmissionRegistrationSubmit(event)" class="space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">Candidate Full Name *</label>
                  <input type="text" id="adm-name" required placeholder="e.g. Rahul Sharma" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">Email Address *</label>
                  <input type="email" id="adm-email" required placeholder="e.g. rahul.s@gmail.com" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">Mobile / WhatsApp Number *</label>
                  <input type="tel" id="adm-phone" required placeholder="e.g. +91 98765 43210" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">10+2 / PUC Marks / Percentage *</label>
                  <input type="text" id="adm-marks" required placeholder="e.g. 91.5% or 480/500" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">Select Desired Academic Program *</label>
                  <select id="adm-course" required class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500">
                    <option value="B.Tech Computer Science & AI">B.Tech Computer Science & AI (4 Years)</option>
                    <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engg (4 Years)</option>
                    <option value="B.Tech Electronics & Communication">B.Tech Electronics & Comm. (4 Years)</option>
                    <option value="B.Tech Mechanical & Robotics">B.Tech Mechanical & Robotics (4 Years)</option>
                    <option value="MBA (Tech & Business Analytics)">MBA Tech & Business Analytics (2 Years)</option>
                    <option value="MCA (Master of Computer Applications)">MCA Cloud & AI Applications (2 Years)</option>
                    <option value="M.Tech VLSI & Embedded Systems">M.Tech VLSI & Embedded Systems (2 Years)</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-gray-300 mb-1">Parent / Guardian Name *</label>
                  <input type="text" id="adm-guardian" required placeholder="e.g. Suresh Sharma" class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-amber-500" />
                </div>
              </div>

              <!-- Mandatory ₹2,000 Payment Section -->
              <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">💳</span>
                    <div>
                      <h4 class="font-extrabold text-white text-sm">Admission Registration Fee</h4>
                      <p class="text-[11px] text-gray-300">Entrance Verification, Seat Priority & Counseling Kit</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-400 block line-through">₹3,500</span>
                    <span class="text-xl font-black text-amber-400">₹2,000</span>
                  </div>
                </div>

                <div class="pt-2 border-t border-amber-500/20">
                  <label class="block font-semibold text-gray-300 mb-2">Select Payment Channel *</label>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <label class="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-900 border border-amber-500/40 cursor-pointer">
                      <input type="radio" name="adm-payment-mode" value="UPI / QR Code (GPay, PhonePe)" checked class="mb-1" />
                      <span class="font-bold text-white">📱 UPI / QR</span>
                      <span class="text-[10px] text-gray-400">Instant</span>
                    </label>
                    <label class="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer">
                      <input type="radio" name="adm-payment-mode" value="Debit / Credit Card" class="mb-1" />
                      <span class="font-bold text-white">💳 Card</span>
                      <span class="text-[10px] text-gray-400">Visa / RuPay</span>
                    </label>
                    <label class="flex flex-col items-center justify-center p-2.5 rounded-xl bg-gray-900 border border-gray-700 cursor-pointer">
                      <input type="radio" name="adm-payment-mode" value="Net Banking" class="mb-1" />
                      <span class="font-bold text-white">🏛️ Net Banking</span>
                      <span class="text-[10px] text-gray-400">Major Banks</span>
                    </label>
                  </div>
                </div>

                <div class="text-[11px] text-gray-400 flex items-center justify-between">
                  <span>Merchant UPI ID: <strong class="text-amber-400 font-mono">sapthagiri.admissions@icici</strong></span>
                  <span class="text-emerald-400 font-bold">🔒 256-Bit SSL Secured</span>
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-xs transition uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                Pay ₹2,000 & Submit Admission Registration →
              </button>
            </form>
          </div>
        </div>
      `;

      const container = document.createElement('div');
      container.innerHTML = modalHTML;
      document.body.appendChild(container);
    };

    window.handleAdmissionRegistrationSubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('adm-name').value;
      const email = document.getElementById('adm-email').value;
      const phone = document.getElementById('adm-phone').value;
      const marks = document.getElementById('adm-marks').value;
      const course = document.getElementById('adm-course').value;
      const guardian = document.getElementById('adm-guardian').value;
      const mode = document.querySelector('input[name="adm-payment-mode"]:checked')?.value || 'UPI / QR Code';

      const admId = `SNPSU-ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const txnId = `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp = {
        id: admId,
        candidateName: Security.sanitizeHTML(name),
        email: Security.sanitizeHTML(email),
        phone: Security.sanitizeHTML(phone),
        marks: Security.sanitizeHTML(marks),
        course: course,
        guardianName: Security.sanitizeHTML(guardian),
        feeAmount: 2000,
        paymentStatus: 'PAID',
        paymentMethod: mode,
        transactionId: txnId,
        appliedAt: new Date().toISOString()
      };

      const admissions = DB.get('ADMISSIONS') || [];
      DB.set('ADMISSIONS', [newApp, ...admissions]);

      const root = document.getElementById('admission-modal-root');
      if (root) root.remove();

      window.showAdmissionSlipModal(newApp);
    };

    window.showAdmissionSlipModal = (app) => {
      const existing = document.getElementById('admission-slip-root');
      if (existing) existing.remove();

      const slipHTML = `
        <div id="admission-slip-root" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div class="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl border border-emerald-500/50 relative space-y-6 shadow-2xl bg-gray-950/95 my-8">
            <button onclick="document.getElementById('admission-slip-root').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>

            <div class="text-center space-y-2 border-b border-gray-800 pb-4">
              <span class="text-4xl block">🎉</span>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                <span>✅ ₹2,000 PAYMENT CONFIRMED</span>
              </div>
              <h3 class="text-xl font-black text-white">SAPTHAGIRI NPS UNIVERSITY</h3>
              <p class="text-xs text-gray-400">Official Admission Registration Slip (Academic Year 2026–2027)</p>
            </div>

            <div class="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2.5 text-xs">
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Application Number:</span>
                <span class="font-mono font-black text-cyan-400">${app.id}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Candidate Name:</span>
                <span class="font-bold text-white">${app.candidateName}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Selected Program:</span>
                <span class="font-bold text-amber-400">${app.course}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Registration Fee Paid:</span>
                <span class="font-mono font-black text-emerald-400">₹2,000.00 (PAID)</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Transaction ID:</span>
                <span class="font-mono text-gray-300">${app.transactionId}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Channel:</span>
                <span class="text-gray-300">${app.paymentMethod}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300">
              📌 <strong>Next Steps:</strong> Your application has been logged into the Sapthagiri Admissions Registry. Our counseling officer will reach out to you at <strong>${app.phone}</strong> for document verification.
            </div>

            <div class="flex gap-3">
              <button onclick="window.print()" class="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs transition uppercase">
                🖨️ Print Admission Slip
              </button>
              <button onclick="document.getElementById('admission-slip-root').remove()" class="px-5 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 font-bold text-xs hover:text-white">
                Done
              </button>
            </div>
          </div>
        </div>
      `;

      const container = document.createElement('div');
      container.innerHTML = slipHTML;
      document.body.appendChild(container);
    };

    window.handleUpdateAdmissionStatus = (appId, newStatus) => {
      const admissions = DB.get('ADMISSIONS') || [];
      const index = admissions.findIndex(a => a.id === appId);
      if (index === -1) {
        alert('Admission record not found.');
        return;
      }
      const updated = { ...admissions[index], status: newStatus, reviewedAt: new Date().toISOString() };
      admissions[index] = updated;
      DB.set('ADMISSIONS', admissions);
      alert(`✅ Application ${appId} status updated to: ${newStatus.replace('_', ' ')}!`);
      Store.notify();
    };

    // Student College Fee Payment Handler (Requirement 2)
    window.handleStudentFeePayment = (e, studentUsn) => {
      if (e && e.preventDefault) e.preventDefault();
      const activeUser = DB.getActiveUser();
      const targetUsn = studentUsn || activeUser.id || activeUser.loginId || '1SG23CS045';
      const amountInput = document.getElementById('fee-payment-amount');
      const amount = parseInt(amountInput ? amountInput.value : '50000', 10);
      const methodRadio = document.querySelector('input[name="fee-pay-method"]:checked');
      const method = methodRadio ? methodRadio.value : 'UPI / QR Code';

      if (!amount || amount <= 0) {
        alert('Please enter a valid payment amount.');
        return;
      }

      const allFees = DB.get('FEES') || [];
      const studentIndex = allFees.findIndex(f => f.studentUsn === targetUsn);

      if (studentIndex === -1) {
        alert('Student fee account not found.');
        return;
      }

      const record = { ...allFees[studentIndex] };
      const newPaid = record.paidAmount + amount;
      const newDue = Math.max(0, record.totalFee - newPaid);
      const newStatus = newDue === 0 ? 'PAID' : 'PARTIAL_DUE';
      const receiptNo = `SNPSU-REC-2026-${Math.floor(100 + Math.random() * 900)}`;
      const dateStr = new Date().toISOString().split('T')[0];

      const newTxn = {
        id: `FTXN-${Date.now()}`,
        amount,
        date: dateStr,
        method,
        receiptNo
      };

      record.paidAmount = newPaid;
      record.dueAmount = newDue;
      record.status = newStatus;
      record.transactions = [newTxn, ...(record.transactions || [])];

      allFees[studentIndex] = record;
      DB.set('FEES', allFees);

      window.showFeeReceiptModal(studentUsn, receiptNo, amount, dateStr, method);
      Store.notify();
    };

    window.showFeeReceiptModal = (studentUsn, receiptNo, amount, dateStr, method) => {
      const existing = document.getElementById('fee-receipt-modal-root');
      if (existing) existing.remove();

      const allFees = DB.get('FEES') || [];
      const record = allFees.find(f => f.studentUsn === studentUsn) || {};

      const receiptHTML = `
        <div id="fee-receipt-modal-root" class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div class="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl border border-cyan-500/50 relative space-y-6 shadow-2xl bg-gray-950/95 my-8">
            <button onclick="document.getElementById('fee-receipt-modal-root').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-white font-bold text-xl">✕</button>

            <div class="text-center space-y-1 border-b border-gray-800 pb-4">
              <span class="text-3xl block">🏛️</span>
              <h3 class="text-xl font-black text-white">SAPTHAGIRI NPS UNIVERSITY</h3>
              <p class="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">OFFICIAL COLLEGE FEE RECEIPT</p>
              <p class="text-[10px] text-gray-400">Hesaraghatta Main Road, Bengaluru – 560057</p>
            </div>

            <div class="p-4 rounded-2xl bg-gray-900 border border-gray-800 space-y-2.5 text-xs">
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Receipt No:</span>
                <span class="font-mono font-bold text-cyan-400">${receiptNo}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Student Name:</span>
                <span class="font-bold text-white">${record.studentName || 'Student'}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Student USN:</span>
                <span class="font-mono font-bold text-gray-200">${studentUsn}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Department:</span>
                <span class="text-gray-300">${record.department || 'Engineering'}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Amount Paid:</span>
                <span class="font-mono font-black text-emerald-400 text-sm">₹${amount.toLocaleString()}</span>
              </div>
              <div class="flex justify-between border-b border-gray-800 pb-2">
                <span class="text-gray-400">Remaining Balance Due:</span>
                <span class="font-mono font-bold ${record.dueAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}">₹${(record.dueAmount || 0).toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Payment Date & Mode:</span>
                <span class="text-gray-300">${dateStr} • ${method}</span>
              </div>
            </div>

            <div class="flex gap-3">
              <button onclick="window.print()" class="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-black text-xs uppercase">
                🖨️ Print Receipt
              </button>
              <button onclick="document.getElementById('fee-receipt-modal-root').remove()" class="px-5 py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 font-bold text-xs hover:text-white">
                Close
              </button>
            </div>
          </div>
        </div>
      `;

      const container = document.createElement('div');
      container.innerHTML = receiptHTML;
      document.body.appendChild(container);
    };

    window.printLatestFeeReceipt = (usn) => {
      const allFees = DB.get('FEES') || [];
      const record = allFees.find(f => f.studentUsn === usn);
      const latestTxn = record?.transactions?.[0] || { receiptNo: 'SNPSU-REC-2026-001', amount: record?.paidAmount || 125000, date: '2026-10-08', method: 'Online Payment' };
      window.showFeeReceiptModal(usn, latestTxn.receiptNo, latestTxn.amount, latestTxn.date, latestTxn.method);
    };

    window.setFeeLedgerSearch = (query) => {
      window.feeSearchQuery = query;
      Store.notify();
    };

    window.setFeeStatusFilter = (filter) => {
      window.feeStatusFilter = filter;
      Store.notify();
    };

    window.showStudentLedgerDetails = (usn) => {
      const allFees = DB.get('FEES') || [];
      const record = allFees.find(f => f.studentUsn === usn);
      if (!record) return;

      const details = `📋 Student Fee Ledger Details:\n\nUSN: ${record.studentUsn}\nName: ${record.studentName}\nDepartment: ${record.department}\nTotal Fee: ₹${record.totalFee.toLocaleString()}\nPaid: ₹${record.paidAmount.toLocaleString()}\nOutstanding Due: ₹${record.dueAmount.toLocaleString()}\nStatus: ${record.status}\nDue Date: ${record.dueDate}`;
      alert(details);
    };

    window.sendSingleFeeReminder = (usn, name, dueAmount) => {
      alert(`🔔 Fee Due Notice Dispatched!\n\nOfficial payment reminder for outstanding balance of ₹${dueAmount.toLocaleString()} has been sent to student ${name} (${usn}) via University SMS and Email.`);
    };

    window.sendBulkFeeReminder = () => {
      const allFees = DB.get('FEES') || [];
      const dueStudents = allFees.filter(f => f.dueAmount > 0);
      alert(`🔔 Bulk Fee Due Alerts Dispatched!\n\nOfficial fee payment reminder notifications successfully sent to all ${dueStudents.length} students with outstanding balances.`);
    };

    // Add Event System for Admin, Staff, and Tech Team (Requirement 1)
    window.openAddEventModal = () => {
      const activeUser = DB.getActiveUser();
      if (activeUser.role === CONFIG.ROLES.STUDENT) {
        alert('Access Denied: Students cannot create events. Only Admin, Faculty Staff, and Tech Team can create events.');
        return;
      }

      const name = prompt('Enter Event Name:');
      if (!name) return;
      const category = prompt('Enter Category (Technical / Placement / Cultural / Sports):', 'Technical');
      const date = prompt('Enter Event Date (e.g. 2026-10-25):', '2026-10-25');
      const time = prompt('Enter Event Time:', '10:00 AM - 04:00 PM');
      const location = prompt('Enter Location:', 'Sapthagiri Main Auditorium');
      const description = prompt('Enter Description:');

      const newEvt = {
        id: `evt-${Date.now()}`,
        name: Security.sanitizeHTML(name),
        category: category || 'Technical',
        date: date || '2026-10-25',
        time: time || '10:00 AM',
        location: Security.sanitizeHTML(location || 'Campus'),
        description: Security.sanitizeHTML(description || ''),
        organizer: activeUser.name,
        capacity: 200,
        registrations: 0
      };

      const events = DB.get('EVENTS');
      DB.set('EVENTS', [newEvt, ...events]);
      alert('🎉 New Event Created and Published!');
      Store.notify();
    };

    // Tech Portal Issue Folder Filter Handler (Requirement 4)
    window.setTechIssueFolder = (folderName) => {
      window.techPortalActiveFolder = folderName;
      Store.notify();
    };

    // Welcome Page Embedded Login Handlers (Requirement 5)
    window.welcomeCurrentPreset = { id: '1SG23CS045', pass: 'student2026' };

    window.switchWelcomeLoginTab = (role) => {
      const hints = {
        STUDENT: { hint: 'ID: <strong>1SG23CS045</strong> | Pass: <strong>student2026</strong>', id: '1SG23CS045', pass: 'student2026' },
        STAFF: { hint: 'ID: <strong>STAFF201</strong> | Pass: <strong>staff2026</strong>', id: 'STAFF201', pass: 'staff2026' },
        TECH_TEAM: { hint: 'ID: <strong>TECH101</strong> | Pass: <strong>tech2026</strong>', id: 'TECH101', pass: 'tech2026' },
        ADMIN: { hint: 'Admin ID: <strong>SNPSUADMIN</strong> | Pass: <strong>SNPSU2026</strong>', id: 'SNPSUADMIN', pass: 'SNPSU2026' }
      };

      ['student', 'staff', 'tech', 'admin'].forEach(t => {
        const btn = document.getElementById(`welcome-tab-${t}`);
        if (btn) btn.className = 'py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition border border-transparent font-bold';
      });

      const activeMap = { STUDENT: 'student', STAFF: 'staff', TECH_TEAM: 'tech', ADMIN: 'admin' };
      const activeBtn = document.getElementById(`welcome-tab-${activeMap[role]}`);
      if (activeBtn) activeBtn.className = 'py-2.5 rounded-xl font-black bg-cyan-500 text-gray-950 border border-cyan-300 shadow-md shadow-cyan-500/30 transition';

      const hintEl = document.getElementById('welcome-preset-hint');
      if (hintEl) hintEl.innerHTML = hints[role].hint;

      const idEl = document.getElementById('welcome-login-id');
      const passEl = document.getElementById('welcome-login-pass');
      if (idEl) idEl.value = hints[role].id;
      if (passEl) passEl.value = hints[role].pass;

      window.welcomeCurrentPreset = hints[role];
    };

    window.handleUserLogout = () => {
      DB.logout();
      Store.setActiveUser(DB.getActiveUser());
      Store.setTab('welcome');
      alert('✅ You have logged out successfully.');
    };

    window.fillWelcomePreset = () => {
      const preset = window.welcomeCurrentPreset || { id: '1SG23CS045', pass: 'student2026' };
      const idEl = document.getElementById('welcome-login-id');
      const passEl = document.getElementById('welcome-login-pass');
      if (idEl) idEl.value = preset.id;
      if (passEl) passEl.value = preset.pass;
    };

    window.handleWelcomeLogin = (e) => {
      e.preventDefault();
      const loginId = document.getElementById('welcome-login-id').value;
      const password = document.getElementById('welcome-login-pass').value;

      const auth = DB.login(loginId, password);
      if (auth.success) {
        Store.setActiveUser(auth.user);
        Store.setTab('dashboard');
        alert(`✅ Welcome to SAPTHAGIRI NPS UNIVERSITY, ${auth.user.name} (${auth.user.role})!`);
      } else {
        alert(`Login Error: ${auth.error}`);
      }
    };

    // Admin Action: Create New Announcement
    window.openNewAnnouncementModal = () => {
      const activeUser = DB.getActiveUser();
      try {
        Security.authorize(activeUser.role, [CONFIG.ROLES.ADMIN]);
      } catch (err) {
        alert(err.message);
        return;
      }

      const title = prompt('Enter Announcement Title:');
      if (!title) return;
      const category = prompt('Enter Category (Academic / Events / Examination / Placement / Emergency / General):', 'General');
      const content = prompt('Enter Announcement Content:');
      if (!content) return;

      const newAnc = {
        id: `anc-${Date.now()}`,
        title: Security.sanitizeHTML(title),
        category: category || 'General',
        content: Security.sanitizeHTML(content),
        author: activeUser.name,
        date: new Date().toISOString().split('T')[0],
        isImportant: true
      };

      const list = DB.get('ANNOUNCEMENTS');
      DB.set('ANNOUNCEMENTS', [newAnc, ...list]);
      alert('📢 Announcement published successfully to Sapthagiri platform!');
      Store.notify();
    };

    window.deleteAnnouncement = (id) => {
      const activeUser = DB.getActiveUser();
      try {
        Security.authorize(activeUser.role, [CONFIG.ROLES.ADMIN]);
      } catch (err) {
        alert(err.message);
        return;
      }

      if (!confirm('Are you sure you want to delete this announcement?')) return;

      const list = DB.get('ANNOUNCEMENTS');
      const filtered = list.filter(a => a.id !== id);
      DB.set('ANNOUNCEMENTS', filtered);
      alert('Announcement deleted.');
      Store.notify();
    };

    window.handleAdminAddUser = (e) => {
      e.preventDefault();
      const activeUser = DB.getActiveUser();
      try {
        Security.authorize(activeUser.role, [CONFIG.ROLES.ADMIN]);
      } catch (err) {
        alert(err.message);
        return;
      }

      const role = document.getElementById('admin-add-role').value;
      const id = document.getElementById('admin-add-id').value;
      const name = document.getElementById('admin-add-name').value;
      const email = document.getElementById('admin-add-email').value;
      const password = document.getElementById('admin-add-password').value;
      const dept = document.getElementById('admin-add-dept').value;

      DB.addUser({
        id,
        loginId: id,
        password,
        name: Security.sanitizeHTML(name),
        email: Security.sanitizeHTML(email),
        role,
        department: Security.sanitizeHTML(dept)
      });

      alert(`✅ New ${role} member "${name}" added successfully to Sapthagiri NPS University database!`);
      e.target.reset();
      Store.notify();
    };

    window.handleApproveStudentRegistration = (regId) => {
      const activeUser = DB.getActiveUser();
      const success = DB.approveStudentRegistration(regId, activeUser);
      if (success) {
        alert('✅ Student Registration Approved! Student account provisioned in University Database.');
        Store.notify();
      }
    };

    window.registerForEvent = (eventId) => {
      const activeUser = DB.getActiveUser();
      const registrations = DB.get('REGISTRATIONS');
      
      const alreadyRegistered = registrations.some(r => r.userId === activeUser.id && r.eventId === eventId);
      if (alreadyRegistered) {
        alert('Notice: You are already registered for this campus event.');
        return;
      }

      const newReg = {
        id: `reg-${Date.now()}`,
        userId: activeUser.id,
        eventId,
        registeredAt: new Date().toISOString()
      };

      DB.set('REGISTRATIONS', [...registrations, newReg]);

      const events = DB.get('EVENTS');
      const updatedEvents = events.map(e => e.id === eventId ? { ...e, registrations: e.registrations + 1 } : e);
      DB.set('EVENTS', updatedEvents);

      alert('🎉 Registration Confirmed! Your pass has been saved to your student profile.');
      Store.notify();
    };

    window.handleComplaintSubmit = (e) => {
      e.preventDefault();
      const activeUser = DB.getActiveUser();

      const title = document.getElementById('complaint-title').value;
      const category = document.getElementById('complaint-category').value;
      const location = document.getElementById('complaint-location').value;
      const priority = document.getElementById('complaint-priority').value;
      const desc = document.getElementById('complaint-desc').value;
      const fileInput = document.getElementById('complaint-file');

      if (fileInput && fileInput.files.length > 0) {
        const fileValidation = Security.validateFileUpload(fileInput.files[0]);
        if (!fileValidation.valid) {
          alert(`Security Warning: ${fileValidation.error}`);
          return;
        }
      }

      const complaintID = DB.generateComplaintID();

      const newComplaint = {
        id: complaintID,
        title: Security.sanitizeHTML(title),
        category,
        location: Security.sanitizeHTML(location),
        priority,
        description: Security.sanitizeHTML(desc),
        status: 'Submitted',
        reportedBy: activeUser.id,
        reporterName: activeUser.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNote: ''
      };

      const complaints = DB.get('COMPLAINTS');
      DB.set('COMPLAINTS', [newComplaint, ...complaints]);

      alert(`✅ Issue Submitted Successfully!\nYour Reference ID is: ${complaintID}\nYou can track status in real-time.`);
      e.target.reset();
      Store.notify();
    };

    window.updateComplaintStatus = (complaintID, newStatus) => {
      const activeUser = DB.getActiveUser();
      try {
        Security.authorize(activeUser.role, [CONFIG.ROLES.ADMIN, CONFIG.ROLES.TECH_TEAM]);
      } catch (err) {
        alert(err.message);
        return;
      }

      const note = prompt(`Enter resolution note or update for issue ${complaintID}:`, `Status changed to ${newStatus}`);
      if (note === null) return;

      const complaints = DB.get('COMPLAINTS');
      const updated = complaints.map(c => {
        if (c.id === complaintID) {
          return {
            ...c,
            status: newStatus,
            adminNote: Security.sanitizeHTML(note),
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      });

      DB.set('COMPLAINTS', updated);
      alert(`Status updated for ${complaintID} to "${newStatus}".`);
      Store.notify();
    };

    window.handleFeedbackSubmit = (e) => {
      e.preventDefault();
      const activeUser = DB.getActiveUser();

      const serviceName = document.getElementById('feedback-service').value;
      const rating = parseInt(document.getElementById('feedback-rating').value, 10);
      const comment = document.getElementById('feedback-text').value;

      const newFeedback = {
        id: `fb-${Date.now()}`,
        serviceName,
        rating,
        comment: Security.sanitizeHTML(comment),
        submittedBy: activeUser.name,
        date: new Date().toISOString().split('T')[0]
      };

      const list = DB.get('FEEDBACK');
      DB.set('FEEDBACK', [newFeedback, ...list]);

      alert('🌟 Thank you! Your feedback has been recorded.');
      e.target.reset();
      Store.notify();
    };

    window.setAnnouncementCategory = (cat) => {
      Store.setState({ activeAnnouncementCategory: cat });
    };

    window.triggerSOSAlert = () => {
      alert('🚨 SOS EMERGENCY BROADCAST DISPATCHED!\nSapthagiri NPS University Security Command & Medical First-Responders have been notified with your location.');
    };

    window.runAutomatedTestsModal = () => {
      const results = runSystemTests();
      const passCount = results.filter(r => r.status === 'PASSED').length;
      const totalCount = results.length;

      const reportHTML = `
        <div class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div class="glass-card max-w-2xl w-full p-6 md:p-8 rounded-2xl border border-cyan-500/40 space-y-4 max-h-[85vh] overflow-y-auto">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white flex items-center gap-2">
                <span>🧪</span> Sapthagiri Automated Test Suite Results
              </h3>
              <button onclick="document.getElementById('test-modal-root').remove()" class="text-gray-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div class="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-300">Test Execution Summary:</span>
              <span class="text-sm font-bold ${passCount === totalCount ? 'text-emerald-400' : 'text-rose-400'}">
                ${passCount} / ${totalCount} PASSED (${Math.round((passCount/totalCount)*100)}%)
              </span>
            </div>

            <div class="space-y-2">
              ${results.map(r => `
                <div class="p-3 rounded-lg bg-gray-950 border ${r.status === 'PASSED' ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'} flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span class="font-bold block text-white">${r.name}</span>
                    <span class="text-gray-400">${r.details}</span>
                  </div>
                  <span class="font-bold px-2 py-0.5 rounded bg-gray-900 border border-current shrink-0">${r.status}</span>
                </div>
              `).join('')}
            </div>

            <div class="pt-2 flex justify-end">
              <button onclick="document.getElementById('test-modal-root').remove()" class="px-5 py-2 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs">Close Test Suite</button>
            </div>
          </div>
        </div>
      `;

      let root = document.getElementById('test-modal-root');
      if (!root) {
        root = document.createElement('div');
        root.id = 'test-modal-root';
        document.body.appendChild(root);
      }
      root.innerHTML = reportHTML;
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  window.app = app;
  app.init();
});
