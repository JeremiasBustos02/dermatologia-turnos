import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coveragesService } from '../service/coverages.api';

export interface Coverage {
  id: number;
  name: string;
  description?: string;
}

export const useCoverages = () => {
  return useQuery<Coverage[]>({
    queryKey: ['coverages'],
    queryFn: coveragesService.getAll,
  });
};

export const useCreateCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coveragesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};

export const useDeleteCoverage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coveragesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
    },
  });
};