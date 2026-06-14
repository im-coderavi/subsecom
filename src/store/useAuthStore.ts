import { create } from 'zustand';

interface User {
  email: string;
  name: string;
  id: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

function loadPersistedAuth(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem('ainest_token');
    const user = JSON.parse(localStorage.getItem('ainest_user') || 'null');
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

const { user: persistedUser, token: persistedToken } = loadPersistedAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: persistedUser,
  token: persistedToken,
  isAuthenticated: !!(persistedUser && persistedToken),

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('ainest_token', data.token);
    localStorage.setItem('ainest_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    localStorage.setItem('ainest_token', data.token);
    localStorage.setItem('ainest_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ainest_token');
    localStorage.removeItem('ainest_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
