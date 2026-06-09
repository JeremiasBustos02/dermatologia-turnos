import type { UserRole } from '../../types';

export interface User {
  userId: number;
  dni: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  clinicId: number;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}