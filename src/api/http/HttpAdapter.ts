import { IHttpClient, RequestConfig } from '../client';
import { ApiResponse } from '../../domain/api.types';

export class HttpApiAdapter implements IHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: {
            code: response.status.toString(),
            message: data.message || 'An error occurred',
            details: data
          },
          meta: { timestamp: new Date().toISOString() }
        };
      }

      return {
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
        meta: { timestamp: new Date().toISOString() }
      };
    }
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const queryString = config?.params 
      ? '?' + new URLSearchParams(config.params as Record<string, string>).toString() 
      : '';
    return this.request<T>(`${url}${queryString}`, { method: 'GET', ...config });
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      method: 'POST', 
      body: JSON.stringify(data),
      ...config 
    });
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      method: 'PUT', 
      body: JSON.stringify(data),
      ...config 
    });
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { 
      method: 'PATCH', 
      body: JSON.stringify(data),
      ...config 
    });
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', ...config });
  }
}
