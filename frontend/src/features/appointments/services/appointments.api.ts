import { apiClient } from '../../../api/apiClient';

export type AppointmentFilters = {
  dateFrom?: string;
  dateTo?: string;
  patientId?: number;
  professionalId?: number;
  coverageId?: number;
  notes?: string;
  clinicId?: number;
};

export const getAppointments = async (filters?: AppointmentFilters) => {
  const { data } = await apiClient.get('/appointments', {
    params: filters ?? {},
  });

  return data.data ?? data;
};

export const getAvailableSlots = async (professionalId: number, date: string, clinicId?: number): Promise<string[]> => {
  const { data } = await apiClient.get('/appointments/available-slots', {
    params: { professionalId, date, clinicId },
  });
  return data.data ?? data;
};

export const createAppointment = async (appointment: any) => {
  const { data } = await apiClient.post('/appointments', appointment);
  return data.data ?? data;
};

export const getProfessionalSchedules = async (professionalId: number, clinicId?: number) => {
  const { data } = await apiClient.get('/schedules', {
    params: { professionalId, clinicId },
  });
  return data.data ?? data;
};

export const updateAppointmentStatus = async ({ id, status, clinicId }: { id: number, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED', clinicId?: number }) => {
  let endpoint = `/appointments/${id}`; 
  
  if (status === 'COMPLETED') {
    endpoint = `/appointments/${id}/complete`;
  } else if (status === 'CANCELLED') {
    endpoint = `/appointments/${id}/cancel`;
  } else if (status === 'CONFIRMED') {
    endpoint = `/appointments/${id}/confirm`;
  }

  const { data } = await apiClient.patch(endpoint, null, { params: { clinicId } });
  
  return data.data ?? data;
};