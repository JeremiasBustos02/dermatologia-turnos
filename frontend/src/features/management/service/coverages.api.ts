import { apiClient } from '../../../api/apiClient';
import { type Coverage } from '../hooks/useCoverages';

export const coveragesService = {
  getAll: async (): Promise<Coverage[]> => {
    try {
      const { data } = await apiClient.get('/coverages');

      if (data && typeof data === 'object' && Array.isArray(data.data)) {
        return data.data;
      }

      if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error al mapear las coberturas en el servicio:', error);
      return [];
    }
  },

  create: async (newCoverage: Omit<Coverage, 'id'>): Promise<Coverage> => {
    const { data } = await apiClient.post('/coverages', newCoverage);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/coverages/${id}`);
  }
};