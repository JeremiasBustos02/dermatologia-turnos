import { apiClient } from '../../../config/axios';

export type AppointmentFilters = {
  dateFrom?: string;
  dateTo?: string;
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
};

export const getAppointments = async (filters?: AppointmentFilters) => {
  const { data } = await apiClient.get('/appointments', {
    params: filters ?? {},
  });

  return data.data ?? data;
};