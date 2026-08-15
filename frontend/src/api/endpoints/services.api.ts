import { apiClient } from '../index';
import { Service, Category } from '../../domain/models';

export const ServicesApi = {
  getCategories: () => 
    apiClient.get<Category[]>('/categories'),
    
  getServicesByCategory: (categoryId: string) => 
    apiClient.get<Service[]>(`/services`, { params: { categoryId } }),
    
  getServiceDetails: (serviceId: string) => 
    apiClient.get<Service>(`/services/${serviceId}`),
    
  searchServices: (query: string) => 
    apiClient.get<Service[]>(`/services/search`, { params: { q: query } })
};
