import { apiClient } from 'app/api';
import type { SubscriptionDto, SubscriptionPlanOptionDto } from 'shared/models';

export interface RenewSubscriptionDto {
  ownerId: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ChangePlanDto {
  ownerId: number;
  targetPlan?: string | null;
  planName?: string | number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export const subscriptionsService = {
  getByOwnerId: (ownerId: number) =>
    apiClient
      .get<SubscriptionDto>(`/subscriptions/owner/${ownerId}`)
      .then((response) => response.data),

  getPlansByOwnerId: (ownerId: number) =>
    apiClient
      .get<SubscriptionPlanOptionDto[]>(`/subscriptions/owner/${ownerId}/plans`)
      .then((response) => (Array.isArray(response.data) ? response.data : [])),

  cancel: (ownerId: number) =>
    apiClient
      .post<SubscriptionDto>(`/subscriptions/owner/${ownerId}/cancel`)
      .then((response) => response.data),

  renew: (dto: RenewSubscriptionDto) =>
    apiClient.post<SubscriptionDto>('/subscriptions/renew', dto).then((response) => response.data),

  changePlan: (dto: ChangePlanDto) =>
    apiClient
      .post<SubscriptionDto>('/subscriptions/change-plan', dto)
      .then((response) => response.data),
};
