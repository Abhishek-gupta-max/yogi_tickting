import type { InternalAxiosRequestConfig } from 'axios';
import axiosInstance from '@/lib/axios';
import { AUTH_CONFIG } from '@/config/auth.config';
import { API_ENDPOINTS } from '@/config/api.config';
import { AuthenticationError } from '@/types/api.types';
import { useAuthStore } from '@/store/auth.store';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

// Request: attach access token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers[AUTH_CONFIG.tokenHeader] = `${AUTH_CONFIG.tokenPrefix} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response: handle 401 with token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post<{ data: { accessToken: string } }>(
          API_ENDPOINTS.auth.refresh
        );

        const newToken = response.data.data.accessToken;
        useAuthStore.getState().setTokens(newToken);

        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(new AuthenticationError());
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
