import { IHttpClient } from './client';
import { MockApiAdapter } from './mock/MockAdapter';
import { HttpApiAdapter } from './http/HttpAdapter';

// In Vite, environment variables are exposed on import.meta.env
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.visvasahome.com/v1';

export const apiClient: IHttpClient = USE_MOCK_API 
  ? new MockApiAdapter(300) // 300ms simulated latency
  : new HttpApiAdapter(API_BASE_URL);
