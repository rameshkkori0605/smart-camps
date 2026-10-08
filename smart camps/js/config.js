/**
 * SMART CAMPUS - System Configuration & Environment Constants
 * SAPTHAGIRI NPS UNIVERSITY, BENGALURU
 */

export const CONFIG = {
  APP_NAME: "SAPTHAGIRI NPS UNIVERSITY",
  TAGLINE: "One Smart Platform for a Better Campus.",
  LOCATION_LABEL: "Bengaluru, Karnataka",
  VERSION: "2.0.0",
  
  // Google Maps configuration
  GOOGLE_MAPS_API_KEY: window.ENV?.GOOGLE_MAPS_API_KEY || "",
  ENABLE_MAPS_FALLBACK: true,

  // File upload security restrictions (Strict <10MB Limit)
  MAX_UPLOAD_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB maximum
  MAX_UPLOAD_SIZE_LABEL: "10 MB",
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"],

  // User Roles
  ROLES: {
    STUDENT: "STUDENT",
    STAFF: "STAFF",       // Faculty / Staff
    TECH_TEAM: "TECH_TEAM", // Tech Department
    ADMIN: "ADMIN"
  },

  // Admin Preset Credentials
  DEFAULT_ADMIN: {
    ID: "SNPSUADMIN",
    PASSWORD: "SNPSU2026",
    NAME: "Sapthagiri Central Admin",
    EMAIL: "admin@sapthagiri.edu.in"
  },

  // Complaint Statuses
  COMPLAINT_STATUS: {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved"
  },

  // Complaint Priorities
  COMPLAINT_PRIORITY: {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    EMERGENCY: "Emergency"
  },

  // Announcement Categories
  ANNOUNCEMENT_CATEGORIES: [
    "Academic",
    "Events",
    "Examination",
    "Placement",
    "Emergency",
    "General"
  ]
};
