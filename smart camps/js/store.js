/**
 * SMART CAMPUS - State Store & Reactive Event Bus
 */

import { DB } from './db.js';

class StateStore {
  constructor() {
    this.state = {
      activeUser: DB.getActiveUser(),
      currentTab: 'welcome',
      globalSearchQuery: '',
      activeComplaintFilter: 'ALL',
      activeAnnouncementCategory: 'ALL',
      activeEventCategory: 'ALL',
      isModalOpen: false,
      modalContent: null
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (newState.activeUser) {
      DB.setActiveUser(newState.activeUser);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Quick state mutators
  setTab(tabName) {
    const activeUser = DB.getActiveUser();
    const isAuthenticated = activeUser && activeUser.isLoggedIn === true && activeUser.role !== 'GUEST';

    if (!isAuthenticated && tabName !== 'welcome') {
      alert('🔒 Access Restricted!\n\nPlease log in first using your User ID and Password on the Welcome Page to access Dashboard, Announcements, Events, Emergency SOS, and Campus Services.');
      this.setState({ currentTab: 'welcome' });
      if (typeof window.openLoginModal === 'function') {
        window.openLoginModal();
      }
      return;
    }

    if (isAuthenticated && tabName === 'welcome') {
      this.setState({ currentTab: 'dashboard' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.setState({ currentTab: tabName });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setActiveUser(user) {
    this.setState({ activeUser: user });
  }

  setSearchQuery(query) {
    this.setState({ globalSearchQuery: query });
  }
}

export const Store = new StateStore();
