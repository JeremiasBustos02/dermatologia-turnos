import { create } from 'zustand';
import { type User , type AuthState } from './auth.types';

interface AuthActions {
  setSession: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setSession: (token, user) => {
    localStorage.setItem('accessToken', token);

    set({
      accessToken: token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setToken: (token) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token });
  },

  setLoading: (value) => set({ isLoading: value }),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));