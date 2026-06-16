import { apiClient } from 'app/api';
import type { CreateServiceScheduleDto } from 'features/schedules/services/schedules.service';
import {
  normalizeServiceDto,
  normalizeServicePublicBookingDto,
  type ServiceApiDto,
  type ServicePublicBookingApiDto,
} from 'shared/models';

export interface CreateBusinessDto {
  name: string;
  ownerId: number;
  description?: string;
  phoneNumber?: string;
  placeName?: string;
  address?: string;
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
  phoneNumber?: string;
  placeName?: string;
  address?: string;
  durationMinutes?: number;
  capacity?: number;
  mode?: number;
  attendanceClosingMode?: number;
  price?: number | null;
}

export interface SetBusinessSecretariesDto {
  secretaryIds?: number[];
}

export const businessService = {
  getByOwner: (ownerId: number) =>
    apiClient
      .get<ServiceApiDto[]>('/services', { params: { ownerId } })
      .then((response) => response.data.map(normalizeServiceDto)),

  getById: (id: number) =>
    apiClient.get<ServiceApiDto>(`/services/${id}`).then((response) => normalizeServiceDto(response.data)),

  create: (payload: CreateBusinessDto) =>
    apiClient
      .post<ServiceApiDto>('/services', payload)
      .then((response) => normalizeServiceDto(response.data)),

  update: (id: number, payload: UpdateBusinessDto) =>
    apiClient
      .put<ServiceApiDto>(`/services/${id}`, payload)
      .then((response) => normalizeServiceDto(response.data)),

  getPublicBooking: (id: number) =>
    apiClient
      .get<ServicePublicBookingApiDto>(`/services/${id}/public-booking`)
      .then((response) => normalizeServicePublicBookingDto(response.data)),

  enablePublicBooking: (id: number) =>
    apiClient
      .post<ServicePublicBookingApiDto>(`/services/${id}/public-booking/enable`)
      .then((response) => normalizeServicePublicBookingDto(response.data)),

  disablePublicBooking: (id: number) =>
    apiClient
      .post<ServicePublicBookingApiDto>(`/services/${id}/public-booking/disable`)
      .then((response) => normalizeServicePublicBookingDto(response.data)),

  regeneratePublicBooking: (id: number) =>
    apiClient
      .post<ServicePublicBookingApiDto>(`/services/${id}/public-booking/regenerate`)
      .then((response) => normalizeServicePublicBookingDto(response.data)),

  delete: (id: number) => apiClient.delete<void>(`/services/${id}`).then((r) => r.data),

  activate: (id: number) => apiClient.patch<void>(`/services/${id}/activate`).then((r) => r.data),

  deactivate: (id: number) =>
    apiClient.patch<void>(`/services/${id}/deactivate`).then((r) => r.data),

  setSecretaries: (id: number, payload: SetBusinessSecretariesDto) =>
    apiClient
      .put<ServiceApiDto>(`/services/${id}/secretaries`, payload)
      .then((response) => normalizeServiceDto(response.data)),
};
