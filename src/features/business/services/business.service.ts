import { apiClient } from 'app/api';
import type { CreateServiceScheduleDto } from 'features/schedules/services/schedules.service';
import type { BusinessDto, ServicePublicBookingDto } from 'shared/models';

export interface CreateBusinessDto {
  name: string;
  ownerId: number;
  description?: string;
  placeName?: string;
  address?: string;
  googleMapsUrl?: string;
  slug?: string;
  serviceTypeId: number;
  durationMinutes: number;
  capacity: number;
  price?: number;
  schedules: CreateServiceScheduleDto[];
}

export interface UpdateBusinessDto {
  name?: string;
  slug?: string;
  description?: string;
  placeName?: string;
  address?: string;
  googleMapsUrl?: string;
  serviceTypeId?: number;
  durationMinutes?: number;
  capacity?: number;
  mode?: number;
  price?: number;
}

export interface SetBusinessSecretariesDto {
  secretaryIds?: number[];
}

export const businessService = {
  getByOwner: (ownerId: number) =>
    apiClient.get<BusinessDto[]>('/services', { params: { ownerId } }).then((r) => r.data),

  getById: (id: number) => apiClient.get<BusinessDto>(`/services/${id}`).then((r) => r.data),

  create: (payload: CreateBusinessDto) =>
    apiClient.post<BusinessDto>('/services', payload).then((r) => r.data),

  update: (id: number, payload: UpdateBusinessDto) =>
    apiClient.put<BusinessDto>(`/services/${id}`, payload).then((r) => r.data),

  getPublicBooking: (id: number) =>
    apiClient.get<ServicePublicBookingDto>(`/services/${id}/public-booking`).then((r) => r.data),

  enablePublicBooking: (id: number) =>
    apiClient.post<ServicePublicBookingDto>(`/services/${id}/public-booking/enable`).then((r) => r.data),

  disablePublicBooking: (id: number) =>
    apiClient.post<ServicePublicBookingDto>(`/services/${id}/public-booking/disable`).then((r) => r.data),

  regeneratePublicBooking: (id: number) =>
    apiClient.post<ServicePublicBookingDto>(`/services/${id}/public-booking/regenerate`).then((r) => r.data),

  delete: (id: number) => apiClient.delete<void>(`/services/${id}`).then((r) => r.data),

  activate: (id: number) => apiClient.patch<void>(`/services/${id}/activate`).then((r) => r.data),

  deactivate: (id: number) =>
    apiClient.patch<void>(`/services/${id}/deactivate`).then((r) => r.data),

  setSecretaries: (id: number, payload: SetBusinessSecretariesDto) =>
    apiClient.put<BusinessDto>(`/services/${id}/secretaries`, payload).then((r) => r.data),
};
