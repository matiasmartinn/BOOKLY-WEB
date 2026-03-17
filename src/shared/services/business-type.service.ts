import { apiClient } from 'app/api';

export interface BusinessTypeModel {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export const businessTypeService = {
  getAll: () => apiClient.get<BusinessTypeModel[]>('/ServiceType').then((r) => r.data),
};
