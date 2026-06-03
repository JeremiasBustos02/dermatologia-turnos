import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '../api/appointments.api';
import type { AppointmentFilters } from '../api/appointments.api';

export const useAppointments = (filters?: AppointmentFilters) => {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: () => getAppointments(filters),
  });
};