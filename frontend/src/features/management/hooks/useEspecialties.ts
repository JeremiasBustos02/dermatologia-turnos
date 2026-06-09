import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtiesService } from '../service/specialties.api';
import type { Specialty } from '../../../types';

export const useSpecialties = (clinicId?: number) => {
  return useQuery<Specialty[]>({
    queryKey: ['specialties', { clinicId }],
    queryFn: () => specialtiesService.getAll(clinicId), 
  });
};

export const useCreateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string; clinicId: number }) => specialtiesService.create(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};

export const useDeleteSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clinicId }: { id: number; clinicId?: number }) => specialtiesService.delete(id, clinicId), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};