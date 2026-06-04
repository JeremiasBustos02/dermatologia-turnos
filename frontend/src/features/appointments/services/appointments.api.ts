import { apiClient } from '../../../api/apiClient';

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

export const getAvailableSlots = async (professionalId: number, date: string): Promise<string[]> => {
  const { data } = await apiClient.get('/appointments/available-slots', {
    params: { professionalId, date },
  });
  return data.data ?? data;
};

export const createAppointment = async (appointment: any) => {
  const { data } = await apiClient.post('/appointments', appointment);
  return data.data ?? data;
};