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

export interface CreateServiceTypeFieldDto {
  key: string;
  label: string;
  description?: string;
  fieldType: number;
  isRequired: boolean;
  sortOrder: number;
}

export interface UpdateServiceTypeFieldDto {
  label?: string;
  description?: string;
  isRequired?: boolean;
  sortOrder?: number;
  fieldType?: number;
}

export const serviceTypeService = {
  getAll: () => apiClient.get<ServiceTypeDto[]>('/service-types').then((response) => response.data),

  getById: (id: number) =>
    apiClient.get<ServiceTypeDto>(`/service-types/${id}`).then((response) => response.data),

  getByIdWithFields: (id: number) =>
    apiClient.get<ServiceTypeDto>(`/service-types/${id}/fields`).then((response) => response.data),

  create: (dto: CreateServiceTypeDto) =>
    apiClient.post<ServiceTypeDto>('/service-types', dto).then((response) => response.data),

  update: (id: number, dto: UpdateServiceTypeDto) =>
    apiClient.put<ServiceTypeDto>(`/service-types/${id}`, dto).then((response) => response.data),

  delete: (id: number) =>
    apiClient.delete<void>(`/service-types/${id}`).then((response) => response.data),

  createField: (serviceTypeId: number, dto: CreateServiceTypeFieldDto) =>
    apiClient
      .post<ServiceTypeDto>(`/service-types/${serviceTypeId}/fields`, dto)
      .then((response) => response.data),

  updateField: (serviceTypeId: number, fieldId: number, dto: UpdateServiceTypeFieldDto) =>
    apiClient
      .put<ServiceTypeDto>(`/service-types/${serviceTypeId}/fields/${fieldId}`, dto)
      .then((response) => response.data),

  deactivateField: (serviceTypeId: number, fieldId: number) =>
    apiClient
      .patch<void>(`/service-types/${serviceTypeId}/fields/${fieldId}/deactivate`)
      .then((response) => response.data),
};
