import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAppointment, getAppointments } from "../services/appointments.api";
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
      // Invalida la caché para que el Dashboard se actualice solo
      queryClient.invalidateQueries({ queryKey: ['appointments'] }); 
    },
  });
};