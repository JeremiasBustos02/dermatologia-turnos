import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtiesService } from '../service/specialties.api';
import type { Specialty } from '../../../types';

export const useSpecialties = () => {
  return useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: specialtiesService.getAll, 
  });
};

export const useCreateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specialtiesService.create, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};

export const useDeleteSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: specialtiesService.delete, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
  });
};