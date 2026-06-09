import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/apiClient';
import { getProfessionalSchedules } from '../services/schedules.api';

export const useProfessionalSchedules = (professionalId: number, clinicId?: number) => {
    return useQuery({
        queryKey: ['schedules', professionalId, clinicId],
        queryFn: () => getProfessionalSchedules(professionalId, clinicId),
        enabled: !!professionalId,
    });
};

export const useSaveProfessionalSchedules = (professionalId: number, clinicId?: number) => {
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
                clinicId,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules', professionalId] });
        },
    });
};