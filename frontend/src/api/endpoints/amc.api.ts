import { apiClient } from '../index';
import { AMCPackage } from '../../domain/models';

export const AmcApi = {
  getPackages: (type?: 'home' | 'office' | 'commercial') => 
    apiClient.get<AMCPackage[]>('/amc/plans', { params: type ? { type } : undefined }),
    
  getPackageDetails: (packageId: string) => 
    apiClient.get<AMCPackage>(`/amc/plans/${packageId}`),
    
  subscribeToPackage: (packageId: string, addressId: string) => 
    apiClient.post<{ subscriptionId: string }>('/amc/subscribe', { plan_id: packageId, address_id: addressId })
};
