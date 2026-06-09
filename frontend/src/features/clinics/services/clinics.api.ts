import { apiClient } from '../../../api/apiClient';

export interface CreateClinicPayload {
  clinicName: string;
  adminFirstName: string;
  adminLastName: string;
  adminDni: string;
  adminEmail: string;
  adminPassword: string;
}

export const createClinic = async (payload: CreateClinicPayload) => {
  const { data } = await apiClient.post('/clinics', payload);
  return data;
};
