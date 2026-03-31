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

export interface AddServiceTypeFieldDto {
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

export interface AddServiceTypeFieldOptionDto {
  value: string;
  label: string;
  sortOrder: number;
}

export interface UpdateServiceTypeFieldOptionDto {
  label?: string;
  sortOrder?: number;
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

  addField: (id: number, dto: AddServiceTypeFieldDto) =>
    apiClient
      .post<ServiceTypeDto>(`/service-types/${id}/fields`, dto)
      .then((response) => response.data),

  updateField: (id: number, fieldId: number, dto: UpdateServiceTypeFieldDto) =>
    apiClient
      .put<ServiceTypeDto>(`/service-types/${id}/fields/${fieldId}`, dto)
      .then((response) => response.data),

  activateField: (id: number, fieldId: number) =>
    apiClient
      .patch<void>(`/service-types/${id}/fields/${fieldId}/activate`)
      .then((response) => response.data),

  deactivateField: (id: number, fieldId: number) =>
    apiClient
      .patch<void>(`/service-types/${id}/fields/${fieldId}/deactivate`)
      .then((response) => response.data),

  addOption: (id: number, fieldId: number, dto: AddServiceTypeFieldOptionDto) =>
    apiClient
      .post<ServiceTypeDto>(`/service-types/${id}/fields/${fieldId}/options`, dto)
      .then((response) => response.data),

  updateOption: (
    id: number,
    fieldId: number,
    optionId: number,
    dto: UpdateServiceTypeFieldOptionDto,
  ) =>
    apiClient
      .put<ServiceTypeDto>(`/service-types/${id}/fields/${fieldId}/options/${optionId}`, dto)
      .then((response) => response.data),

  removeOption: (id: number, fieldId: number, optionId: number) =>
    apiClient
      .delete<void>(`/service-types/${id}/fields/${fieldId}/options/${optionId}`)
      .then((response) => response.data),

  activateOption: (id: number, fieldId: number, optionId: number) =>
    apiClient
      .patch<void>(`/service-types/${id}/fields/${fieldId}/options/${optionId}/activate`)
      .then((response) => response.data),

  deactivateOption: (id: number, fieldId: number, optionId: number) =>
    apiClient
      .patch<void>(`/service-types/${id}/fields/${fieldId}/options/${optionId}/deactivate`)
      .then((response) => response.data),
};
