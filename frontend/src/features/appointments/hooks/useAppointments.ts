import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment, getAppointments, getProfessionalSchedules, updateAppointmentStatus } from "../services/appointments.api";
import type { AppointmentFilters } from "../services/appointments.api";
import { getAvailableSlots } from '../services/appointments.api';

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => getAppointments(filters),
  });
};

export const useAvailableSlots = (professionalId: number, date: string) => {
  return useQuery({
    queryKey: ['availableSlots', professionalId, date],
    queryFn: () => getAvailableSlots(professionalId, date),
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

export const useProfessionalSchedules = (professionalId: number) => {
  return useQuery({
    queryKey: ['schedules', professionalId],
    queryFn: () => getProfessionalSchedules(professionalId),
    enabled: !!professionalId,
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