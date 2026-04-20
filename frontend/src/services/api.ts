import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const message = this.getErrorMessage(error);
        
        // Log to monitoring service (Sentry, etc)
        console.error('API Error:', {
          url: error.config?.url,
          status: error.response?.status,
          message,
        });

        // Specific error handling
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        if (error.response?.status === 403) {
          // Forbidden
          return Promise.reject(new Error('No tienes permiso para realizar esta acción'));
        }

        if (error.response?.status === 429) {
          // Rate limited
          return Promise.reject(new Error('Demasiadas solicitudes. Intenta más tarde.'));
        }

        return Promise.reject(new Error(message));
      }
    );
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    if (typeof error.response?.data === 'string') {
      return error.response.data;
    }
    if (error.message) {
      return error.message;
    }
    return 'Ha ocurrido un error inesperado';
  }

  // Generic GET
  async get<T>(url: string, params?: Record<string, unknown>): Promise<PaginatedResponse<T> | T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  // Generic POST
  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  // Generic PUT
  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  // Generic PATCH
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }

  // Generic DELETE
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  // Upload file (FormData)
  async upload<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // GET with caching (simple in-memory)
  private cache = new Map<string, { data: unknown; expiry: number }>();

  async getCached<T>(url: string, ttlSeconds: number = 300): Promise<T> {
    const cached = this.cache.get(url);
    const now = Date.now();

    if (cached && cached.expiry > now) {
      return cached.data as T;
    }

    const data = await this.get<T>(url);
    this.cache.set(url, {
      data,
      expiry: now + ttlSeconds * 1000,
    });

    return data;
  }

  // Invalidate cache for URL
  invalidateCache(url: string): void {
    this.cache.delete(url);
  }

  // Clear all cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const api = new ApiService();

// Export axios instance for direct use if needed
export { axios } from 'axios';

export default api;
