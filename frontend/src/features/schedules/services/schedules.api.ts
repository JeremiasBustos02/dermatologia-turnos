import { apiClient } from '../../../api/apiClient';
import type { Schedule, CreateScheduleDTO } from '../types';

export const getProfessionalSchedules = async (professionalId: number, clinicId?: number): Promise<Schedule[]> => {
  const { data } = await apiClient.get('/schedules', { params: { professionalId, clinicId } });
  return data.data ?? data;
};

export const createSchedule = async (schedule: CreateScheduleDTO): Promise<Schedule> => {
  const { data } = await apiClient.post('/schedules', schedule);
  return data.data ?? data;
};

export const deleteSchedule = async (id: number, clinicId?: number): Promise<void> => {
  await apiClient.delete(`/schedules/${id}`, { params: { clinicId } });
};