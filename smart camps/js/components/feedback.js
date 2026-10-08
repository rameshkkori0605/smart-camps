/**
 * SMART CAMPUS - Feedback System Component
 * Student review submission & Admin feedback analytics.
 */

import { DB } from '../db.js';
import { CONFIG } from '../config.js';
import { Security } from '../security.js';

export function renderFeedback() {
  const activeUser = DB.getActiveUser();
  const isAdmin = activeUser.role === CONFIG.ROLES.ADMIN;
  const feedbackList = DB.get('FEEDBACK');
  const services = DB.get('SERVICES');

  const totalReviews = feedbackList.length;
  const avgRating = totalReviews > 0 
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return `
    <div class="space-y-8 animate-fadeIn">
      
      <!-- Header -->
      <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <span>⭐</span> Student Feedback & Satisfaction System
          </h2>
          <p class="text-xs text-gray-400">Share your experiences with library, canteen, hostel, and campus infrastructure.</p>
        </div>

        <div class="bg-gray-900 px-4 py-2 rounded-xl border border-gray-800 text-right">
          <p class="text-xs text-gray-400 font-medium">Overall Satisfaction</p>
          <div class="text-xl font-extrabold text-amber-400 flex items-center gap-1 justify-end">
            <span>⭐ ${avgRating}</span>
            <span class="text-xs text-gray-500 font-normal">/ 5.0 (${totalReviews} reviews)</span>
          </div>
        </div>
      </div>

      <!-- Submit Feedback Form -->
      <div class="glass-card p-6 md:p-8 rounded-2xl border border-cyan-500/30">
        <h3 class="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span>✍️</span> Submit Feedback for Campus Service
        </h3>
        <p class="text-xs text-gray-400 mb-6">Your ratings help administration improve campus quality and facilities.</p>

        <form onsubmit="window.handleFeedbackSubmit(event)" class="space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="feedback-service" class="block text-xs font-semibold text-gray-300 mb-1">Select Campus Service *</label>
              <select 
                id="feedback-service" 
                required 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              >
                ${services.map(s => `
                  <option value="${s.name}">${s.name}</option>
                `).join('')}
              </select>
            </div>

            <div>
              <label for="feedback-rating" class="block text-xs font-semibold text-gray-300 mb-1">Satisfaction Rating *</label>
              <select 
                id="feedback-rating" 
                required 
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                <option value="2">⭐⭐ 2 Stars - Needs Improvement</option>
                <option value="1">⭐ 1 Star - Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label for="feedback-text" class="block text-xs font-semibold text-gray-300 mb-1">Comments & Suggestions *</label>
            <textarea 
              id="feedback-text" 
              rows="3" 
              required 
              placeholder="What went well or what can be improved?" 
              class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <div class="pt-2 flex justify-end">
            <button 
              type="submit" 
              class="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              Submit Feedback Review
            </button>
          </div>

        </form>
      </div>

      <!-- Recent Reviews List -->
      <div class="space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <span>💬</span> Recent Feedback Reviews
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${feedbackList.map(f => `
            <div class="glass-card p-4 rounded-xl border border-gray-800 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">${f.serviceName}</span>
                <span class="text-xs text-amber-400 font-bold">{"⭐".repeat(f.rating)}</span>
              </div>
              <p class="text-xs text-gray-300 italic">"${Security.sanitizeHTML(f.comment)}"</p>
              <div class="text-[11px] text-gray-500 pt-2 border-t border-gray-800/80 flex items-center justify-between">
                <span>By: ${f.submittedBy}</span>
                <span>${f.date}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
