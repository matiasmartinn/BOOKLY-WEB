import { apiClient } from 'app/api';
import type { SecretaryDto, UserDto } from 'shared/models';

export interface CreateSecretaryDto {
  firstName: string;
  lastName: string;
  email: string;
  serviceId: number;
}

export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
}

export const usersService = {
  getById: (id: number) => apiClient.get<UserDto>(`/users/${id}`).then((response) => response.data),

  createSecretary: (ownerId: number, dto: CreateSecretaryDto) =>
    apiClient
      .post<UserDto>(`/users/owners/${ownerId}/secretaries`, dto)
      .then((response) => response.data),

  getSecretariesByOwner: (ownerId: number) =>
    apiClient
      .get<SecretaryDto[]>(`/users/owners/${ownerId}/secretaries`)
      .then((response) => response.data),

  activateSecretary: (id: number) =>
    apiClient.patch<void>(`/users/secretaries/${id}/activate`).then((response) => response.data),

  deactivateSecretary: (id: number) =>
    apiClient.patch<void>(`/users/secretaries/${id}/deactivate`).then((response) => response.data),

  update: (id: number, dto: UpdateUserDto) =>
    apiClient.put<UserDto>(`/users/${id}`, dto).then((response) => response.data),

  delete: (id: number) =>
    apiClient.delete<void>(`/users/${id}`).then((response) => response.data),
};
