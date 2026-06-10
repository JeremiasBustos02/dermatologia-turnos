export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'RECEPTIONIST' | 'PROFESSIONAL' | 'PATIENT';

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
  dni: string;

  specialties: Specialty[];
  coverages: Coverage[];
}

export interface CreateProfessionalDTO {
  dni: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  specialtyIds: number[];
  coverageIds: number[];
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
  clinicId: number;
}

export interface Specialty {
  id: number;
  name: string;
  description?: string;
}

export interface Coverage {
  id: number;
  name: string;
  description?: string;
}

export interface MyProfile {
  userId: number;
  dni: string;
  firstName: string;
  lastName: string;
  email: string | null;
  role: UserRole;
  clinicId: number | null;
  clinic: { id: number; name: string } | null;
  coverage: { id: number; name: string } | null;
  professionalProfile: {
    licenseNumber: string | null;
    specialties: Specialty[];
  } | null;
}

export interface UpdateMyProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  licenseNumber?: string;
  specialtyIds?: number[];
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}