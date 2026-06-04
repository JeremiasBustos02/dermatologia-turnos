import { apiClient } from '../api/apiClient';
import { type User } from '../auth/auth.types';

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get('/auth/me');
  return data;
}

export async function refreshToken(refreshToken: string) {
  const { data } = await apiClient.post('/auth/refresh', {
    refreshToken,
  });

  return data;
}