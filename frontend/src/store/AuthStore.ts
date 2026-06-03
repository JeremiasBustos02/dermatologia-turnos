import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),

  setAuth: (token: string, user: any) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.clear();
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));