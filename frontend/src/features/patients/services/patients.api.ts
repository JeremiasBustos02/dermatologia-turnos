import { apiClient } from '../../../api/apiClient';
import type { Patient, CreatePatientDTO } from '../../../types/index';

export const getPatients = async (): Promise<Patient[]> => {
  const { data } = await apiClient.get('/users?role=PATIENT');
  return data.data ?? data;
};

export const createPatient = async (patient: CreatePatientDTO): Promise<Patient> => {
  const { data } = await apiClient.post('/patients', patient);
  return data.data ?? data;
};

export const updatePatient = async (id: number, patient: Partial<CreatePatientDTO>): Promise<Patient> => {
  const { data } = await apiClient.patch(`/patients/${id}`, patient);
  return data.data ?? data;
};

export const deletePatient = async (id: number): Promise<void> => {
  await apiClient.delete(`/patients/${id}`);
};