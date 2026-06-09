import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coveragesService } from '../service/coverages.api';
import type { Coverage } from '../../../types';

export const useCoverages = () => {
  return useQuery<Coverage[]>({
    queryKey: ['coverages'],
    queryFn: () => coveragesService.getAll(),
  });
};

export const useCreateCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description: string }) => coveragesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};

export const useDeleteCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => coveragesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};