export type UserRole = 'ADMIN' | 'RECEPTIONIST' | 'PROFESSIONAL' | 'PATIENT';

export interface User {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface Professional {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber?: string;

  specialties: Specialty[];
  coverages: Coverage[];
}

export interface CreateProfessionalDTO {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialtyIds: [];
  coverageIds: [];
}

export interface Patient {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  coverageId?: number | null;
}

export interface CreatePatientDTO {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  coverageId?: number | null;
}

export interface Specialty {
  id: number;
  name: string;
}

export interface Coverage {
  id: number;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}