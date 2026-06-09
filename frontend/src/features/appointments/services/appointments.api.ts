import { apiClient } from '../../../api/apiClient';

export type AppointmentFilters = {
  dateFrom?: string;
  dateTo?: string;
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
  notes?: string;
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

export const getProfessionalSchedules = async (professionalId: number) => {
  const { data } = await apiClient.get('/schedules', {
    params: { professionalId },
  });
  return data.data ?? data;
};

export const updateAppointmentStatus = async ({ id, status }: { id: number, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' }) => {
  let endpoint = `/appointments/${id}`; 
  
  if (status === 'COMPLETED') {
    endpoint = `/appointments/${id}/complete`;
  } else if (status === 'CANCELLED') {
    endpoint = `/appointments/${id}/cancel`;
  } else if (status === 'CONFIRMED') {
    endpoint = `/appointments/${id}/confirm`;
  }

  const { data } = await apiClient.patch(endpoint);
  
  return data.data ?? data;
};