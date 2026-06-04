import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfessionals, createProfessional, deleteProfessional } from '../services/professionals.api';
import type { CreateProfessionalDTO } from '../../../types/index';

// Hook para LEER (Read)
export const useProfessionals = () => {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: getProfessionals,
  });
};

// Hook para CREAR (Create)
export const useCreateProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newProfessional: CreateProfessionalDTO) => createProfessional(newProfessional),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
};

// Hook para ELIMINAR (Delete)
export const useDeleteProfessional = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteProfessional(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
};