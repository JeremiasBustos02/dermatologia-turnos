import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coveragesService } from '../service/coverages.api';
import type { Coverage } from '../../../types';

export const useCoverages = (clinicId?: number) => {
  return useQuery<Coverage[]>({
    queryKey: ['coverages', { clinicId }],
    queryFn: () => coveragesService.getAll(clinicId),
  });
};

export const useCreateCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string; clinicId: number }) => coveragesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};

export const useDeleteCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clinicId }: { id: number; clinicId?: number }) => coveragesService.delete(id, clinicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};