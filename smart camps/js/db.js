/**
 * SMART CAMPUS - Database & Persistent State Engine
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 * Bulletproof defensive data access & fail-safe initialization.
 */

import { CONFIG } from './config.js';

const STORAGE_KEYS = {
  USERS: 'snpsu_users_v2',
  STUDENT_REGISTRATIONS: 'snpsu_student_registrations_v2',
  ANNOUNCEMENTS: 'snpsu_announcements_v2',
  EVENTS: 'snpsu_events_v2',
  REGISTRATIONS: 'snpsu_event_registrations_v2',
  COMPLAINTS: 'snpsu_complaints_v2',
  LOCATIONS: 'snpsu_locations_v2',
  SERVICES: 'snpsu_services_v2',
  FEEDBACK: 'snpsu_feedback_v2',
  ACTIVE_USER: 'snpsu_active_user_v2',
  ADMISSIONS: 'snpsu_admissions_v3',
  FEES: 'snpsu_fees_v3'
};

// Initial Seed Demo Data for Sapthagiri NPS University
const SEED_DATA = {
  USERS: [
    {
      id: CONFIG.DEFAULT_ADMIN.ID,
      loginId: CONFIG.DEFAULT_ADMIN.ID,
      password: CONFIG.DEFAULT_ADMIN.PASSWORD,
      name: 'Sapthagiri University Admin',
      email: CONFIG.DEFAULT_ADMIN.EMAIL,
      role: CONFIG.ROLES.ADMIN,
      department: 'Central Administration'
    },
    {
      id: 'TECH-101',
      loginId: 'TECH101',
      password: 'tech2026',
      name: 'Campus Tech Support Team',
      email: 'techteam@sapthagiri.edu.in',
      role: CONFIG.ROLES.TECH_TEAM,
      department: 'IT & Technical Infrastructure'
    },
    {
      id: 'STAFF-201',
      loginId: 'STAFF201',
      password: 'staff2026',
      name: 'Dr. Ramesh K',
      email: 'ramesh.cs@sapthagiri.edu.in',
      role: CONFIG.ROLES.STAFF,
      department: 'Computer Science & Engineering'
    },
    {
      id: '1SG23CS045',
      loginId: '1SG23CS045',
      password: 'student2026',
      name: 'Alex Johnson',
      email: 'alex.j@student.sapthagiri.edu.in',
      role: CONFIG.ROLES.STUDENT,
      department: 'Computer Science (3rd Sem)'
    }
  ],

  STUDENT_REGISTRATIONS: [
    {
      id: 'SREG-2026-001',
      studentUsn: '1SG24CS012',
      studentName: 'Priya Sharma',
      email: 'priya.s@student.sapthagiri.edu.in',
      department: 'Information Science',
      status: 'PENDING_APPROVAL',
      submittedAt: '2026-10-08T10:15:00Z',
      approvedBy: ''
    },
    {
      id: 'SREG-2026-002',
      studentUsn: '1SG24EC088',
      studentName: 'Karthik V',
      email: 'karthik.v@student.sapthagiri.edu.in',
      department: 'Electronics & Communication',
      status: 'APPROVED',
      submittedAt: '2026-10-07T14:20:00Z',
      approvedBy: 'TECH-101'
    }
  ],

  ANNOUNCEMENTS: [
    {
      id: 'anc-1',
      title: 'Sapthagiri NPS University Semester Examination Schedule',
      category: 'Examination',
      content: 'The Spring 2026 final timetable for Sapthagiri NPS University engineering & management courses has been published.',
      author: 'Controller of Examinations',
      date: '2026-10-06',
      isImportant: true
    },
    {
      id: 'anc-2',
      title: 'Annual Campus Placement Drive 2026',
      category: 'Placement',
      content: 'Tier-1 tech companies are visiting Sapthagiri NPS University Bengaluru campus next week. Eligible students must submit resumes.',
      author: 'Training & Placement Cell',
      date: '2026-10-07',
      isImportant: true
    },
    {
      id: 'anc-3',
      title: 'IT & Wi-Fi Network Infrastructure Upgrade',
      category: 'Emergency',
      content: 'The Tech Team is upgrading campus Wi-Fi access points across Block B and Central Library tonight from 11 PM to 2 AM.',
      author: 'Tech Department',
      date: '2026-10-08',
      isImportant: true
    }
  ],

  EVENTS: [
    {
      id: 'evt-1',
      name: 'Sapthagiri AI & Cloud Hackathon 2026',
      category: 'Technical',
      date: '2026-10-15',
      time: '09:00 AM - 06:00 PM',
      location: 'Sapthagiri Main Auditorium & Innovation Lab',
      description: 'Build real-world smart campus automation solutions using IoT, Cloud, and AI.',
      organizer: 'Computer Science Department & Tech Team',
      capacity: 250,
      registrations: 60
    },
    {
      id: 'evt-2',
      name: 'Sapthagiri Placement Training & Mock Interviews',
      category: 'Placement',
      date: '2026-10-18',
      time: '02:00 PM - 05:00 PM',
      location: 'Seminar Hall 1',
      description: 'Technical interview prep and resume polishing session for Sapthagiri students.',
      organizer: 'Placement Cell',
      capacity: 150,
      registrations: 95
    }
  ],

  REGISTRATIONS: [],

  COMPLAINTS: [
    {
      id: 'SC-2026-00124',
      title: 'Projector HDMI Audio Issue in Room 302',
      category: 'Classroom',
      location: 'Block A - Classroom 302',
      description: 'Overhead projector in CS Department loses signal during lectures.',
      priority: CONFIG.COMPLAINT_PRIORITY.HIGH,
      status: CONFIG.COMPLAINT_STATUS.IN_PROGRESS,
      reportedBy: '1SG23CS045',
      reporterName: 'Alex Johnson',
      createdAt: '2026-10-07T09:15:00Z',
      updatedAt: '2026-10-08T11:00:00Z',
      adminNote: 'Tech Team assigned to check cable connection.'
    }
  ],

  LOCATIONS: [
    { id: 'loc-1', name: 'Sapthagiri Main Gate Security', category: 'Entrance', code: 'MG-01', lat: 13.0827, lng: 77.5411, description: 'Main entry point to Sapthagiri NPS University Campus with 24/7 security.' },
    { id: 'loc-2', name: 'Administrative Building', category: 'Admin', code: 'AD-01', lat: 13.0830, lng: 77.5415, description: 'Vice-Chancellor Office, Registrar, Admissions, and Finance Desk.' },
    { id: 'loc-3', name: 'Central Digital Library', category: 'Academic', code: 'LIB-01', lat: 13.0835, lng: 77.5420, description: 'Multi-story library equipped with high-speed internet study pods and digital archives.' },
    { id: 'loc-4', name: 'Tech Department Command Center', category: 'Technology', code: 'TECH-01', lat: 13.0828, lng: 77.5418, description: 'Campus IT infrastructure, server rooms, and student tech registration support desk.' },
    { id: 'loc-5', name: 'Sapthagiri University Auditorium', category: 'Event', code: 'AUD-01', lat: 13.0840, lng: 77.5405, description: 'State-of-the-art 1200-seater auditorium for hackathons, cultural events, and seminars.' }
  ],

  SERVICES: [
    { id: 'srv-1', name: 'Central Digital Library', category: 'Academic', location: 'Library Building', contact: '+91 80 2837 2800', hours: '08:00 AM - 10:00 PM', description: 'Book lending, IEEE digital journal access, and quiet study zones.' },
    { id: 'srv-2', name: 'Campus Tech & Wi-Fi Support Desk', category: 'Technology', location: 'Tech Block Room 104', contact: 'techteam@sapthagiri.edu.in', hours: '09:00 AM - 06:00 PM', description: 'Student Wi-Fi credentials, portal reset, laptop assistance, and registration.' },
    { id: 'srv-3', name: 'Sapthagiri Health & Medical Center', category: 'Healthcare', location: 'Medical Wing', contact: '+91 80 2837 9999', hours: '24 / 7 Emergency', description: 'On-campus doctor consultation, emergency first aid, and ambulance.' }
  ],

  FEEDBACK: [
    { id: 'fb-1', serviceName: 'Campus Tech & Wi-Fi Support Desk', rating: 5, comment: 'Tech team resolved my portal registration issue quickly!', submittedBy: 'Alex Johnson', date: '2026-10-07' }
  ],

  ADMISSIONS: [
    {
      id: 'SNPSU-ADM-2026-001',
      candidateName: 'Rohan Sharma',
      email: 'rohan.sharma@gmail.com',
      phone: '+91 98765 43210',
      course: 'B.Tech Computer Science & AI',
      marks: '92.4%',
      guardianName: 'Suresh Sharma',
      feeAmount: 2000,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI / Google Pay',
      transactionId: 'TXN-UPI-983141',
      appliedAt: '2026-10-08T11:20:00Z'
    },
    {
      id: 'SNPSU-ADM-2026-002',
      candidateName: 'Pooja Hegde',
      email: 'pooja.h@yahoo.com',
      phone: '+91 98451 22334',
      course: 'MBA (Tech & Business Analytics)',
      marks: '88.6%',
      guardianName: 'Manjunath Hegde',
      feeAmount: 2000,
      paymentStatus: 'PAID',
      paymentMethod: 'Debit Card (HDFC)',
      transactionId: 'TXN-CARD-441209',
      appliedAt: '2026-10-08T14:45:00Z'
    }
  ],

  FEES: [
    {
      studentUsn: '1SG23CS045',
      studentName: 'Alex Johnson',
      email: 'alex.j@student.sapthagiri.edu.in',
      department: 'Computer Science & Engineering',
      semester: '3rd Semester',
      academicYear: '2026-2027',
      totalFee: 125000,
      paidAmount: 75000,
      dueAmount: 50000,
      dueDate: '2026-11-15',
      status: 'PARTIAL_DUE',
      breakdown: {
        tuitionFee: 85000,
        examFee: 10000,
        labLibraryFee: 20000,
        campusInfraFee: 10000
      },
      transactions: [
        { id: 'FTXN-001', amount: 75000, date: '2026-08-10', method: 'Online Net Banking', receiptNo: 'SNPSU-REC-2026-014' }
      ]
    },
    {
      studentUsn: '1SG24CS012',
      studentName: 'Priya Sharma',
      email: 'priya.s@student.sapthagiri.edu.in',
      department: 'Information Science',
      semester: '1st Semester',
      academicYear: '2026-2027',
      totalFee: 125000,
      paidAmount: 125000,
      dueAmount: 0,
      dueDate: '2026-11-15',
      status: 'PAID',
      breakdown: {
        tuitionFee: 85000,
        examFee: 10000,
        labLibraryFee: 20000,
        campusInfraFee: 10000
      },
      transactions: [
        { id: 'FTXN-002', amount: 125000, date: '2026-07-28', method: 'UPI / PhonePe', receiptNo: 'SNPSU-REC-2026-008' }
      ]
    },
    {
      studentUsn: '1SG24EC088',
      studentName: 'Karthik V',
      email: 'karthik.v@student.sapthagiri.edu.in',
      department: 'Electronics & Communication',
      semester: '1st Semester',
      academicYear: '2026-2027',
      totalFee: 115000,
      paidAmount: 0,
      dueAmount: 115000,
      dueDate: '2026-11-10',
      status: 'UNPAID_DUE',
      breakdown: {
        tuitionFee: 80000,
        examFee: 10000,
        labLibraryFee: 15000,
        campusInfraFee: 10000
      },
      transactions: []
    },
    {
      studentUsn: '1SG23IS022',
      studentName: 'Ananya Rao',
      email: 'ananya.r@student.sapthagiri.edu.in',
      department: 'Information Science',
      semester: '3rd Semester',
      academicYear: '2026-2027',
      totalFee: 120000,
      paidAmount: 120000,
      dueAmount: 0,
      dueDate: '2026-11-15',
      status: 'PAID',
      breakdown: {
        tuitionFee: 80000,
        examFee: 10000,
        labLibraryFee: 20000,
        campusInfraFee: 10000
      },
      transactions: [
        { id: 'FTXN-003', amount: 120000, date: '2026-08-02', method: 'Debit Card (HDFC)', receiptNo: 'SNPSU-REC-2026-011' }
      ]
    },
    {
      studentUsn: '1SG24ME035',
      studentName: 'Sneha Patil',
      email: 'sneha.p@student.sapthagiri.edu.in',
      department: 'Mechanical Engineering',
      semester: '1st Semester',
      academicYear: '2026-2027',
      totalFee: 110000,
      paidAmount: 60000,
      dueAmount: 50000,
      dueDate: '2026-11-12',
      status: 'PARTIAL_DUE',
      breakdown: {
        tuitionFee: 75000,
        examFee: 10000,
        labLibraryFee: 15000,
        campusInfraFee: 10000
      },
      transactions: [
        { id: 'FTXN-004', amount: 60000, date: '2026-08-15', method: 'UPI / Google Pay', receiptNo: 'SNPSU-REC-2026-018' }
      ]
    },
    {
      studentUsn: '1SG23CV019',
      studentName: 'Manoj Kumar',
      email: 'manoj.k@student.sapthagiri.edu.in',
      department: 'Civil Engineering',
      semester: '3rd Semester',
      academicYear: '2026-2027',
      totalFee: 105000,
      paidAmount: 0,
      dueAmount: 105000,
      dueDate: '2026-11-05',
      status: 'UNPAID_DUE',
      breakdown: {
        tuitionFee: 70000,
        examFee: 10000,
        labLibraryFee: 15000,
        campusInfraFee: 10000
      },
      transactions: []
    }
  ]
};

export const DB = {
  init() {
    try {
      Object.keys(STORAGE_KEYS).forEach(key => {
        const storageKey = STORAGE_KEYS[key];
        if (!localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, JSON.stringify(SEED_DATA[key] || []));
        }
      });

      if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(SEED_DATA.USERS[0]));
      }
    } catch (err) {
      console.error('Storage Initialization Error:', err);
    }
  },

  get(key) {
    try {
      const storageKey = STORAGE_KEYS[key.toUpperCase()];
      if (!storageKey) return [];
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : (SEED_DATA[key.toUpperCase()] || []);
    } catch (err) {
      console.error(`DB Get Error for ${key}:`, err);
      return SEED_DATA[key.toUpperCase()] || [];
    }
  },

  set(key, data) {
    try {
      const storageKey = STORAGE_KEYS[key.toUpperCase()];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(data));
      }
    } catch (err) {
      console.error(`DB Set Error for ${key}:`, err);
    }
  },

  getActiveUser() {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (user) {
        const parsed = JSON.parse(user);
        if (parsed && parsed.id && parsed.role && parsed.isLoggedIn) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('DB getActiveUser error:', err);
    }
    return {
      id: 'GUEST',
      loginId: 'GUEST',
      name: 'Guest Visitor',
      email: '',
      role: 'GUEST',
      isLoggedIn: false
    };
  },

  isLoggedIn() {
    const user = this.getActiveUser();
    return user && user.isLoggedIn === true && user.role !== 'GUEST';
  },

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    } catch (err) {
      console.error('DB logout error:', err);
    }
  },

  setActiveUser(user) {
    if (user && user.id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    }
  },

  login(loginId, password) {
    if (!loginId || !password) {
      return { success: false, error: 'Please enter both User ID and Password.' };
    }

    const users = this.get('USERS');
    const cleanId = String(loginId).trim().toLowerCase();
    const cleanPass = String(password).trim();

    const user = users.find(u => 
      (String(u.loginId || '').toLowerCase() === cleanId || 
       String(u.id || '').toLowerCase() === cleanId || 
       String(u.email || '').toLowerCase() === cleanId) && 
      String(u.password || '') === cleanPass
    );

    if (user) {
      const loggedInUser = { ...user, isLoggedIn: true };
      this.setActiveUser(loggedInUser);
      return { success: true, user: loggedInUser };
    }
    return { success: false, error: 'Invalid User ID or Password. Please try again.' };
  },

  addUser(userData) {
    const users = this.get('USERS');
    const newUser = {
      id: userData.id || `USR-${Date.now()}`,
      loginId: userData.loginId || userData.id,
      password: userData.password || 'sapthagiri2026',
      name: userData.name || 'User',
      email: userData.email || '',
      role: userData.role || CONFIG.ROLES.STUDENT,
      department: userData.department || 'General'
    };

    this.set('USERS', [...users, newUser]);
    return newUser;
  },

  approveStudentRegistration(regId, techUser) {
    const regList = this.get('STUDENT_REGISTRATIONS');
    const targetReg = regList.find(r => r.id === regId);

    if (targetReg) {
      const updatedRegList = regList.map(r => r.id === regId ? { ...r, status: 'APPROVED', approvedBy: techUser?.name || 'Tech Team' } : r);
      this.set('STUDENT_REGISTRATIONS', updatedRegList);

      this.addUser({
        id: targetReg.studentUsn,
        loginId: targetReg.studentUsn,
        password: 'student2026',
        name: targetReg.studentName,
        email: targetReg.email,
        role: CONFIG.ROLES.STUDENT,
        department: targetReg.department
      });

      return true;
    }
    return false;
  },

  generateComplaintID() {
    const complaints = this.get('COMPLAINTS');
    const year = new Date().getFullYear();
    const count = complaints.length + 126;
    const padded = String(count).padStart(5, '0');
    return `SC-${year}-${padded}`;
  }
};
