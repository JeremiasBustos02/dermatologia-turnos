import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/apiClient';
import { getProfessionalSchedules } from '../services/schedules.api';

export const useProfessionalSchedules = (professionalId: number) => {
    return useQuery({
        queryKey: ['schedules', professionalId],
        queryFn: () => getProfessionalSchedules(professionalId),
        enabled: !!professionalId,
    });
};

export const useSaveProfessionalSchedules = (professionalId: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (schedules: {
            professionalId: number;
            dayOfWeek: string;
            startTime: string;
            endTime: string;
            appointmentDuration: number;
        }[]) => {
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