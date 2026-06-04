import axios from 'axios';
import { useAuthStore } from '../auth/auth.store';

let isRefreshing = false;
let queue: any[] = [];

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (original._retry) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken }
      );

      localStorage.setItem('accessToken', data.accessToken);
      useAuthStore.getState().setToken(data.accessToken);

      queue.forEach((cb) => cb(data.accessToken));
      queue = [];

      return apiClient(original);
    } catch (err) {
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);