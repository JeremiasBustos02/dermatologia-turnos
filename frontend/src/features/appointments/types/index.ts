import type { Patient, Professional, Coverage } from '../../../types/index';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: number;
  dateTime: string;
  status: AppointmentStatus;
  notes?: string;
  patient: Patient;
  professional: Professional;
  coverage: Coverage;
}