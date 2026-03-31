import { apiClient } from 'app/api';
import type { ClientAppointmentHistoryDto, ClientDetailDto, ClientListItemDto } from 'shared/models';

export const clientsService = {
  getByOwner: (ownerId: number, search?: string) =>
    apiClient
      .get<ClientListItemDto[]>('/clients', { params: { ownerId, search } })
      .then((response) => response.data),

  getDetail: (ownerId: number, email: string) =>
    apiClient
      .get<ClientDetailDto>('/clients/detail', { params: { ownerId, email } })
      .then((response) => response.data),

  getAppointmentHistory: (ownerId: number, email: string) =>
    apiClient
      .get<ClientAppointmentHistoryDto[]>('/clients/appointments', { params: { ownerId, email } })
      .then((response) => response.data),
};
