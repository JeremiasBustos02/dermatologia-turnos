import { apiClient } from '../api/apiClient';
import { useAuthStore } from './auth.store';

export async function initAuth() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    useAuthStore.getState().setLoading(false);
    return;
  }

  try {
    const { data } = await apiClient.get('/auth/me');

    useAuthStore.getState().setSession(token, data);
  } catch {
    useAuthStore.getState().logout();
  } finally {
    useAuthStore.getState().setLoading(false);
  }
}