import { apiClient } from '../index';
import { AMCPackage } from '../../domain/models';

export const AmcApi = {
  getPackages: (type?: 'home' | 'office' | 'commercial') => 
    apiClient.get<AMCPackage[]>('/amc/packages', { params: type ? { type } : undefined }),
    
  getPackageDetails: (packageId: string) => 
    apiClient.get<AMCPackage>(`/amc/packages/${packageId}`),
    
  subscribeToPackage: (packageId: string, addressId: string) => 
    apiClient.post<{ subscriptionId: string }>('/amc/subscribe', { packageId, addressId })
};
