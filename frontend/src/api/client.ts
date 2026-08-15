import { ApiResponse } from '../domain/api.types';

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean>;
  body?: unknown;
}

export interface IHttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}
