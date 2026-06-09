import { apiClient } from '../../../api/apiClient';
import type { Patient, CreatePatientDTO } from '../../../types/index';

export type PatientFilters = {
  clinicId?: number;
};

export const getPatients = async (filters?: PatientFilters): Promise<Patient[]> => {
  const { data } = await apiClient.get('/users', {
    params: { ...filters, role: 'PATIENT' },
  });
  return data.data ?? data;
};

export const createPatient = async (patient: CreatePatientDTO): Promise<Patient> => {
  const { data } = await apiClient.post('/users', { ...patient, role: 'PATIENT' });
  return data.data ?? data;
};

export const updatePatient = async (id: number, patient: Partial<CreatePatientDTO>): Promise<Patient> => {
  const { data } = await apiClient.patch(`/users/${id}`, patient);
  return data.data ?? data;
};

export const deletePatient = async (id: number, clinicId?: number): Promise<void> => {
  await apiClient.delete(`/users/${id}`, { params: { clinicId } });
};