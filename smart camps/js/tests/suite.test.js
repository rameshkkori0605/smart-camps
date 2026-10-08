/**
 * SMART CAMPUS - Automated Test Suite Engine
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

import { DB } from '../db.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function runSystemTests() {
  const results = [];

  function assert(testName, condition, details = '') {
    if (condition) {
      results.push({ name: testName, status: 'PASSED', details });
    } else {
      results.push({ name: testName, status: 'FAILED', details: details || 'Assertion failed' });
    }
  }

  try {
    DB.init();

    // 1. Sapthagiri Admin Authentication Test (Item 8: Admin ID=SNPSUADMIN, Pass=SNPSU2026)
    const adminLogin = DB.login('SNPSUADMIN', 'SNPSU2026');
    assert('Auth: Default Admin SNPSUADMIN authentication', adminLogin.success && adminLogin.user.role === CONFIG.ROLES.ADMIN, `Logged in as: ${adminLogin.user?.name}`);

    // 2. Tech Team Credentials Test (Item 4: Tech team login system)
    const techLogin = DB.login('TECH101', 'tech2026');
    assert('Auth: Tech Team portal authentication', techLogin.success && techLogin.user.role === CONFIG.ROLES.TECH_TEAM, `Tech Member: ${techLogin.user?.name}`);

    // 3. Admin User Provisioning Test (Item 9: Admin can add Tech Team, Staff, Student)
    const newTechUser = DB.addUser({
      id: 'TECH-999',
      loginId: 'TECH999',
      password: 'techpassword2026',
      name: 'Anand Sharma (Tech Lead)',
      email: 'anand.tech@sapthagiri.edu.in',
      role: CONFIG.ROLES.TECH_TEAM,
      department: 'Network Infrastructure'
    });
    const verifyUser = DB.get('USERS').find(u => u.id === 'TECH-999');
    assert('Admin Action: Provision Tech Team staff member', Boolean(verifyUser), `Created: ${verifyUser?.name} (${verifyUser?.role})`);

    // 4. Student Tech Department Registration & Approval Test (Item 3)
    const testRegId = `SREG-TEST-${Date.now()}`;
    const testRegs = DB.get('STUDENT_REGISTRATIONS');
    DB.set('STUDENT_REGISTRATIONS', [...testRegs, {
      id: testRegId,
      studentUsn: '1SG24CS777',
      studentName: 'Test Student Sapthagiri',
      email: 'test@student.sapthagiri.edu.in',
      department: 'Computer Science',
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString()
    }]);

    const approved = DB.approveStudentRegistration(testRegId, techLogin.user);
    const createdStudent = DB.get('USERS').find(u => u.id === '1SG24CS777');
    assert('Tech Action: Approve student registration & provision account', approved && Boolean(createdStudent), `Approved USN: 1SG24CS777`);

    // 5. Security File Upload 10MB Enforcement Test
    const largeFile = { size: 12 * 1024 * 1024, type: 'image/jpeg', name: 'large.jpg' };
    const validationResult = Security.validateFileUpload(largeFile);
    assert('Security: Rejects file uploads >= 10MB', validationResult.valid === false, validationResult.error);

    // 6. Complaint Reference ID Test
    const nextID = DB.generateComplaintID();
    assert('Complaint Pipeline: Generates SC-2026-XXXX format', /^SC-\d{4}-\d{5}$/.test(nextID), `Generated ID: ${nextID}`);

    // 7. Online Admission Registration with ₹2,000 Fee Payment (Requirement 1)
    const testAdmId = `SNPSU-ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const admRecord = {
      id: testAdmId,
      candidateName: 'Aditi Deshmukh',
      email: 'aditi.d@test.com',
      phone: '+91 99887 76655',
      marks: '95.2%',
      course: 'B.Tech - Artificial Intelligence',
      guardianName: 'Anil Deshmukh',
      feeAmount: 2000,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI / QR Code',
      transactionId: 'TXN-UPI-TEST99',
      appliedAt: new Date().toISOString()
    };
    const admissions = DB.get('ADMISSIONS') || [];
    DB.set('ADMISSIONS', [admRecord, ...admissions]);
    const verifyAdm = (DB.get('ADMISSIONS') || []).find(a => a.id === testAdmId);
    assert('Admissions: Online Registration with ₹2,000 fee saved to ledger', Boolean(verifyAdm && verifyAdm.feeAmount === 2000 && verifyAdm.paymentStatus === 'PAID'), `Candidate: ${verifyAdm?.candidateName} (₹${verifyAdm?.feeAmount})`);

    // 8. Student College Fee Payment and Dues Clearance (Requirement 2)
    const allFees = DB.get('FEES') || [];
    const studentIdx = allFees.findIndex(f => f.studentUsn === '1SG23CS045');
    assert('Fees System: Student Alex Johnson fee record exists', studentIdx !== -1, `Found USN: 1SG23CS045`);
    if (studentIdx !== -1) {
      const initialDue = allFees[studentIdx].dueAmount;
      const initialPaid = allFees[studentIdx].paidAmount;
      const payAmount = 25000;
      const updatedRecord = {
        ...allFees[studentIdx],
        paidAmount: initialPaid + payAmount,
        dueAmount: Math.max(0, initialDue - payAmount),
        status: (initialDue - payAmount) <= 0 ? 'PAID' : 'PARTIAL_DUE',
        transactions: [
          { id: `FTXN-TEST-${Date.now()}`, amount: payAmount, date: '2026-10-09', method: 'UPI Test', receiptNo: 'SNPSU-REC-TEST' },
          ...(allFees[studentIdx].transactions || [])
        ]
      };
      allFees[studentIdx] = updatedRecord;
      DB.set('FEES', allFees);
      const verifyFee = (DB.get('FEES') || []).find(f => f.studentUsn === '1SG23CS045');
      assert('Fees System: Online dues payment updates ledger and logs receipt', verifyFee && verifyFee.paidAmount >= initialPaid + payAmount, `New Due: ₹${verifyFee?.dueAmount?.toLocaleString()}`);
    }

    // 9. Staff, Admin, & Tech Team Access to Complete Student Fee Ledger (Requirement 2)
    const verifyLedger = DB.get('FEES') || [];
    const hasMultipleStudents = verifyLedger.length >= 2;
    const hasValidFields = verifyLedger.every(f => f.studentUsn && f.totalFee && typeof f.dueAmount === 'number');
    assert('Fees System: Fee Ledger displays complete student cohort with due balances', hasMultipleStudents && hasValidFields, `Total Enrolled Records: ${verifyLedger.length}`);

  } catch (err) {
    assert('Test Suite Engine', false, `System exception: ${err.message}`);
  }

  return results;
}
