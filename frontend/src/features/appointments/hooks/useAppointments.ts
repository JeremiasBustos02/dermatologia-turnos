import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment, getAppointments, updateAppointmentStatus } from "../services/appointments.api";
import type { AppointmentFilters } from "../services/appointments.api";
import { getAvailableSlots } from '../services/appointments.api';

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => getAppointments(filters),
  });
};

export const useAvailableSlots = (professionalId: number, date: string, clinicId?: number) => {
  return useQuery({
    queryKey: ['availableSlots', professionalId, date, clinicId],
    queryFn: () => getAvailableSlots(professionalId, date, clinicId),
    enabled: !!professionalId && !!date, 
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] }); 
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      console.error("Detalle del error al actualizar:", error.response?.data || error.message);
      alert(`Error del servidor: ${error.response?.data?.message || 'Revisa la consola'}`);
    }
  });
};

export { useProfessionalSchedules } from '../../schedules/hooks/useSchedules';