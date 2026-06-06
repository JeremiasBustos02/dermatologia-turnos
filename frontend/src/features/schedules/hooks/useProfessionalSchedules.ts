import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/apiClient';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ScheduleItem {
  id?: number;
  professionalId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
}

export const useProfessionalSchedules = (professionalId: number) => {
  return useQuery<ScheduleItem[]>({
    queryKey: ['schedules', professionalId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/schedules?professionalId=${professionalId}`);
      return data?.data || [];
    },
    enabled: !!professionalId,
  });
};

export const useSaveProfessionalSchedules = (professionalId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (schedules: Omit<ScheduleItem, 'id'>[]) => {
      const { data } = await apiClient.post(`/schedules/professional/${professionalId}`, {
        schedules,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', professionalId] });
    },
  });
};