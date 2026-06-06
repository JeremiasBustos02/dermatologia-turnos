import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specialtiesService } from '../service/specialties.api';

export interface Specialty {
  id: number;
  name: string;
  description?: string;
}

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