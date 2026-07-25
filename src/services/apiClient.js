import { storage } from './storage';
import { MOCK_MOVIES } from '../data/mockMovies';

const SERVER_API_BASE = '/api';

export const apiClient = {
  // --- AUTHENTICATION ---
  getUser: () => {
    try {
      const stored = localStorage.getItem('moviemate_v2_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setUser: (user) => {
    if (user) {
      localStorage.setItem('moviemate_v2_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('moviemate_v2_user');
    }
  },

  login: async (email, password, isAdmin = false) => {
    try {
      const res = await fetch(`${SERVER_API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, admin_login: isAdmin })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          apiClient.setUser(data.user);
          return { success: true, user: data.user };
        }
      }
    } catch (err) {
      console.warn('Backend server unavailable, attempting local login fallback:', err);
    }

    // Local Auth Fallback
    if (email.toLowerCase() === 'admin@moviemate.com' && (password === 'admin123' || password === 'admin')) {
      const adminUser = { id: 1, name: 'Administrator', email: 'admin@moviemate.com', role: 'admin' };
      apiClient.setUser(adminUser);
      return { success: true, user: adminUser };
    }

    if (email.toLowerCase() === 'user@moviemate.com' || email.includes('@')) {
      const testUser = { 
        id: Date.now(), 
        name: email.split('@')[0].toUpperCase(), 
        email, 
        role: isAdmin ? 'admin' : 'user' 
      };
      apiClient.setUser(testUser);
      return { success: true, user: testUser };
    }

    return { success: false, error: 'Invalid email or password.' };
  },

  register: async (name, email, password) => {
    try {
      const res = await fetch(`${SERVER_API_BASE}/auth.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          apiClient.setUser(data.user);
          return { success: true, user: data.user };
        }
      }
    } catch (err) {
      console.warn('Backend server unavailable, registering locally:', err);
    }

    // Local Registration Fallback
    const newUser = { id: Date.now(), name, email, role: 'user' };
    apiClient.setUser(newUser);
    return { success: true, user: newUser };
  },

  logout: async () => {
    try {
      await fetch(`${SERVER_API_BASE}/auth.php?action=logout`);
    } catch (e) {
      // Ignore
    }
    apiClient.setUser(null);
  }
};
