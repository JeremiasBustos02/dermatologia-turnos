import { create } from 'zustand';
import { type User, type AuthState } from './auth.types';
import type { UserRole } from '../../types';

interface AuthActions {
  setSession: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (value: boolean) => void;
  setMockRole: (role: UserRole) => void;
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

  setMockRole: (role) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, role }
        : {
            userId: 0,
            dni: 'mock',
            role,
            firstName: 'Mock',
            lastName: 'User',
            clinicId: 1,
          },
    })),

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