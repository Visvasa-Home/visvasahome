import { IHttpClient, RequestConfig } from '../client';
import { ApiResponse } from '../../domain/api.types';

// Simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiAdapter implements IHttpClient {
  private baseDelay: number;

  constructor(baseDelay = 500) {
    this.baseDelay = baseDelay;
  }

  private async simulateNetwork() {
    await delay(this.baseDelay + Math.random() * 300);
  }

  private mockResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: { timestamp: new Date().toISOString() }
    };
  }

  private mockError(code: string, message: string): ApiResponse<any> {
    return {
      success: false,
      error: { code, message },
      meta: { timestamp: new Date().toISOString() }
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    await this.simulateNetwork();
    
    // Simple mock router
    if (url.includes('/services')) {
      return this.mockResponse([] as unknown as T);
    }
    
    return this.mockError('NOT_FOUND', `Mock route for GET ${url} not found`);
  }

  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    await this.simulateNetwork();
    return this.mockResponse(data as T);
  }

  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    await this.simulateNetwork();
    return this.mockResponse(data as T);
  }

  async patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    await this.simulateNetwork();
    return this.mockResponse(data as T);
  }

  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    await this.simulateNetwork();
    return this.mockResponse({ deleted: true } as unknown as T);
  }
}
