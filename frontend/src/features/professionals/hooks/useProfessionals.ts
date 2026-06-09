import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessionals, createProfessional, deleteProfessional, updateProfessional } from '../services/professionals.api';
import type { CreateProfessionalDTO } from '../../../types/index';

const PROFESSIONALS_KEY = ['professionals'];

export const useProfessionals = (clinicId?: number) => {
  return useQuery({
    queryKey: [...PROFESSIONALS_KEY, { clinicId }],
    queryFn: () => getProfessionals({ clinicId }),
  });
};

export const useCreateProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};

export const useDeleteProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clinicId }: { id: number; clinicId?: number }) => deleteProfessional(id, clinicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};

export const useUpdateProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateProfessionalDTO }) => updateProfessional({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};