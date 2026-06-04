import type { Patient, Professional } from '../../../types/index';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Coverage {
  id: number;
  name: string;
}

export interface Appointment {
  id: number;
  dateTime: string;
  status: AppointmentStatus;
  notes?: string;
  patient: Patient;
  professional: Professional;
  coverage: Coverage;
}