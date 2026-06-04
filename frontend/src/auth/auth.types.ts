export type UserRole = 'ADMIN' | 'PATIENT' | 'RECEPTIONIST';

export interface User {
  userId: number;
  dni: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}