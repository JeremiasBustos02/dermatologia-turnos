import { apiClient } from '../../../api/apiClient';
import type { Professional, CreateProfessionalDTO } from '../../../types/index';

export const getProfessionals = async (): Promise<Professional[]> => {
  const { data } = await apiClient.get('/professionals');
  return data.data ?? data; 
};

export const createProfessional = async (professional: CreateProfessionalDTO): Promise<Professional> => {
  const { data } = await apiClient.post('/professionals', professional);
  return data.data ?? data;
};

export const deleteProfessional = async (id: number): Promise<void> => {
  await apiClient.delete(`/professionals/${id}`);
};

export const updateProfessional = async ({ id, data }: { id: number; data: Partial<CreateProfessionalDTO> }): Promise<Professional> => {
  const { data: responseData } = await apiClient.patch(`/professionals/${id}`, data);
  return responseData.data ?? responseData;
};