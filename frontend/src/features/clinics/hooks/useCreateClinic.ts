import { useMutation } from '@tanstack/react-query';
import { createClinic, type CreateClinicPayload } from '../services/clinics.api';

export const useCreateClinic = () => {
  return useMutation({
    mutationFn: (payload: CreateClinicPayload) => createClinic(payload),
  });
};
