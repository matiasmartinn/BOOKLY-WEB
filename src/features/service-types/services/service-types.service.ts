import { apiClient } from 'app/api';
import type { ServiceTypeDto } from 'shared/models';

export interface CreateServiceTypeDto {
  name: string;
  description?: string;
}

export interface UpdateServiceTypeDto {
  name?: string;
  description?: string;
}

export const serviceTypeService = {
  getAll: () => apiClient.get<ServiceTypeDto[]>('/service-types').then((response) => response.data),

  getById: (id: number) =>
    apiClient.get<ServiceTypeDto>(`/service-types/${id}`).then((response) => response.data),

  create: (dto: CreateServiceTypeDto) =>
    apiClient.post<ServiceTypeDto>('/service-types', dto).then((response) => response.data),

  update: (id: number, dto: UpdateServiceTypeDto) =>
    apiClient.put<ServiceTypeDto>(`/service-types/${id}`, dto).then((response) => response.data),

  delete: (id: number) =>
    apiClient.delete<void>(`/service-types/${id}`).then((response) => response.data),
};
