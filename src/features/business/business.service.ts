import { apiClient } from 'app/api';
import type { BusinessModel } from 'shared/models';
import type { CreateBusinessFormValues } from './business-wizard/schema';

interface CreateServicePayload extends CreateBusinessFormValues {
  ownerId: number;
}

export const businessService = {
  getByOwner: (ownerId: number) =>
    apiClient.get<BusinessModel[]>('/services', { params: { ownerId } }).then((r) => r.data),

  getById: (id: number) => apiClient.get<BusinessModel>(`/services/${id}`).then((r) => r.data),

  create: (payload: CreateServicePayload) =>
    apiClient.post<BusinessModel>('/services', payload).then((r) => r.data),
};
