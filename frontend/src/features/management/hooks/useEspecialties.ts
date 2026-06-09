import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtiesService } from '../service/specialties.api';
import type { Specialty } from '../../../types';

export const useSpecialties = () => {
  return useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: () => specialtiesService.getAll(), 
  });
};

export const useCreateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string }) => specialtiesService.create(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};

export const useDeleteSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => specialtiesService.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};