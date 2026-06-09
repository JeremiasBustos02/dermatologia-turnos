import { apiClient } from '../../../api/apiClient';
import type { Specialty } from '../../../types';

export const specialtiesService = {
  getAll: async (): Promise<Specialty[]> => {
    try {
      const { data } = await apiClient.get('/specialties');

      if (data && typeof data === 'object' && Array.isArray(data.data)) {
        return data.data;
      }

      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error al mapear las especialidades en el servicio:', error);
      return [];
    }
  },

  create: async (newSpecialty: Omit<Specialty, 'id'>): Promise<Specialty> => {
    const { data } = await apiClient.post('/specialties', newSpecialty);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/specialties/${id}`);
  }
};