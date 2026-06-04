import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessionalSchedules, createSchedule, deleteSchedule } from '../services/schedules.api';
import type { CreateScheduleDTO } from '../types';

export const useProfessionalSchedules = (professionalId: number) => {
    return useQuery({
        queryKey: ['schedules', professionalId],
        queryFn: () => getProfessionalSchedules(professionalId),
        enabled: !!professionalId,
    });
};

export const useCreateSchedule = (professionalId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newSchedule: CreateScheduleDTO) => createSchedule(newSchedule),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules', professionalId] }),
    });
};

export const useDeleteSchedule = (professionalId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteSchedule(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedules', professionalId] }),
    });
};