import axiosInstance from '@/lib/axios';
import type { AxiosRequestConfig, AxiosProgressEvent } from 'axios';
import type { ApiResponse, PaginatedResponse } from '@/types/global.types';

// ============================================================
// ENTERPRISE API CLIENT
// Provides typed, consistent interface over Axios
// ============================================================

class ApiClient {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, body, config);
    return response.data.data;
  }

  async put<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<ApiResponse<T>>(url, body, config);
    return response.data.data;
  }

  async patch<T, D = unknown>(url: string, body?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, body, config);
    return response.data.data;
  }

  async delete<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
    const response = await axiosInstance.get<PaginatedResponse<T>>(url, config);
    return response.data;
  }

  async upload<T>(
    url: string,
    formData: FormData,
    options?: { onProgress?: (percent: number) => void; config?: AxiosRequestConfig }
  ): Promise<T> {
    const response = await axiosInstance.post<ApiResponse<T>>(url, formData, {
      ...options?.config,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event: AxiosProgressEvent) => {
        if (event.total && options?.onProgress) {
          options.onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
    return response.data.data;
  }

  async download(url: string, filename: string, config?: AxiosRequestConfig): Promise<void> {
    const response = await axiosInstance.get(url, {
      ...config,
      responseType: 'blob',
    });
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }
}

export const apiClient = new ApiClient();
export default apiClient;
