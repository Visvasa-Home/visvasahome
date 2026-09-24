import { apiClient } from '../index';
import { Service, Category } from '../../domain/models';

export const ServicesApi = {
  getCategories: () => 
    apiClient.get<Category[]>('/catalog/categories'),
    
  getServicesByCategory: (categoryId: string) => 
    apiClient.get<Service[]>(`/catalog/services`, { params: { categoryId } }),
    
  getServiceDetails: (serviceId: string) => 
    apiClient.get<Service>(`/catalog/services/${serviceId}`),
    
  searchServices: (query: string) => 
    apiClient.get<Service[]>(`/catalog/services/search`, { params: { q: query } })
};
