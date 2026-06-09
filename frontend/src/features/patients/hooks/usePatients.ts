import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/patients.api';
import type { CreatePatientDTO } from '../../../types/index';

export const usePatients = (clinicId?: number) => {
  return useQuery({
    queryKey: ['patients', { clinicId }],
    queryFn: () => getPatients({ clinicId }),
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPatient: CreatePatientDTO) => createPatient(newPatient),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePatientDTO> }) => updatePatient(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clinicId }: { id: number; clinicId?: number }) => deletePatient(id, clinicId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });
};