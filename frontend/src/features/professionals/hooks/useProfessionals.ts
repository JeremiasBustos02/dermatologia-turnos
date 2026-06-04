import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessionals, createProfessional, deleteProfessional, updateProfessional } from '../services/professionals.api';
import type { CreateProfessionalDTO } from '../../../types/index';

const PROFESSIONALS_KEY = ['professionals'];

export const useProfessionals = () => {
  return useQuery({
    queryKey: PROFESSIONALS_KEY,
    queryFn: getProfessionals,
  });
};

export const useCreateProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProfessional: CreateProfessionalDTO) => createProfessional(newProfessional),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};

export const useDeleteProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProfessional(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};

export const useUpdateProfessional = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY });
    },
  });
};
