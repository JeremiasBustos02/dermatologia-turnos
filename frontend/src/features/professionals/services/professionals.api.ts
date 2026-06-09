import { apiClient } from '../../../api/apiClient';
import type { Professional, CreateProfessionalDTO } from '../../../types/index';

export type ProfessionalFilters = {
  clinicId?: number;
};

export const getProfessionals = async (filters?: ProfessionalFilters): Promise<Professional[]> => {
  const { data } = await apiClient.get('/professionals', { params: filters ?? {} });
  return data.data ?? data;
};

export const createProfessional = async (professional: CreateProfessionalDTO): Promise<Professional> => {
  const { data } = await apiClient.post('/professionals', professional);
  return data.data ?? data;
};

export const deleteProfessional = async (id: number, clinicId?: number): Promise<void> => {
  await apiClient.delete(`/professionals/${id}`, { params: { clinicId } });
};

export const updateProfessional = async ({ id, data }: { id: number; data: Partial<CreateProfessionalDTO> }): Promise<Professional> => {
  const { data: responseData } = await apiClient.patch(`/professionals/${id}`, data);
  return responseData.data ?? responseData;
};