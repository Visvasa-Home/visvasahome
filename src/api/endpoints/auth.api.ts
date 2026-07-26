import { apiClient } from '../index';
import { User } from '../../domain/models';

interface LoginCredentials {
  phone: string;
  otp: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const AuthApi = {
  sendOtp: (phone: string) => 
    apiClient.post<{ success: boolean }>('/auth/send-otp', { phone }),
    
  verifyOtp: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/verify', credentials),
    
  logout: () => 
    apiClient.post<{ success: boolean }>('/auth/logout'),
    
  getCurrentUser: () => 
    apiClient.get<User>('/auth/me')
};
