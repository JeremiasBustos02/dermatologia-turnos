import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../../api/apiClient';

export interface CreateMedicalRecordDTO {
  patientId: number;
  professionalId: number;
  appointmentId?: number;
  reason?: string;
  evolution: string;
  prescription?: string;
}

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicalRecordDTO) => {
      const response = await apiClient.post('/medical-records', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalida la caché para que el listado de turnos se recargue si es necesario
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

export const useMedicalRecordsByPatient = (patientId?: number) => {
  return useQuery({
    queryKey: ['medical-records', 'patient', patientId],
    queryFn: async () => {
      const { data } = await apiClient.get('/medical-records', {
        params: { patientId, limit: 20 },
      });
      return data.data;
    },
    enabled: !!patientId,
  });
};