/**
 * SMART CAMPUS - Security & Validation Layer
 * Enforces XSS Sanitization, File Upload Security (<10MB), and Role Authorization.
 */

import { CONFIG } from './config.js';

export const Security = {
  /**
   * Sanitizes string inputs to prevent Cross-Site Scripting (XSS) attacks.
   * @param {string} input 
   * @returns {string} Sanitized text
   */
  sanitizeHTML(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Validates uploaded files to ensure they do not exceed 10MB and have allowed MIME types.
   * @param {File} file 
   * @returns {{ valid: boolean, error?: string, sizeMB: string }}
   */
  validateFileUpload(file) {
    if (!file) return { valid: true };

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);

    // Strict 10MB file limit check
    if (file.size > CONFIG.MAX_UPLOAD_SIZE_BYTES) {
      return {
        valid: false,
        sizeMB,
        error: `File size (${sizeMB} MB) exceeds the maximum limit of ${CONFIG.MAX_UPLOAD_SIZE_LABEL}. Please upload a smaller file.`
      };
    }

    // MIME type check
    if (CONFIG.ALLOWED_IMAGE_TYPES.length > 0 && !CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        sizeMB,
        error: `File type '${file.type || 'unknown'}' is not supported. Please upload a valid image (JPG, PNG, WEBP, GIF) or PDF.`
      };
    }

    return { valid: true, sizeMB };
  },

  /**
   * Enforces role authorization check for sensitive backend / admin actions.
   * @param {string} userRole 
   * @param {string[]} requiredRoles 
   * @throws {Error} If user is unauthorized
   */
  authorize(userRole, requiredRoles = [CONFIG.ROLES.ADMIN]) {
    if (!requiredRoles.includes(userRole)) {
      const err = new Error(`Access Denied: Action requires ${requiredRoles.join(' or ')} permission.`);
      err.code = 403;
      throw err;
    }
    return true;
  },

  /**
   * Safe error logger that prevents exposing sensitive stack traces to users.
   * @param {Error|unknown} err 
   * @returns {string} User-friendly error message
   */
  formatUserError(err) {
    console.error('[Smart Campus Security Log]:', err);
    if (err && typeof err === 'object' && 'message' in err) {
      return err.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }
};
