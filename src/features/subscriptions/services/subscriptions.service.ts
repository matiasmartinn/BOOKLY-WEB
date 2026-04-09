import { apiClient } from 'app/api';
import type { SubscriptionDto } from 'shared/models';

import {
  mapSubscriptionPlanOptionsFromApi,
  type SubscriptionPlanOptionApiDto,
} from '../adapter';
import type { ChangePlanDto, RenewSubscriptionDto } from '../schema';
export type { ChangePlanDto, RenewSubscriptionDto } from '../schema';

export const subscriptionsService = {
  getByOwnerId: (ownerId: number) =>
    apiClient
      .get<SubscriptionDto>(`/subscriptions/owner/${ownerId}`)
      .then((response) => response.data),

  getPlansByOwnerId: (ownerId: number) =>
    apiClient
      .get<SubscriptionPlanOptionApiDto[]>(`/subscriptions/owner/${ownerId}/plans`)
      .then((response) =>
        Array.isArray(response.data) ? mapSubscriptionPlanOptionsFromApi(response.data) : [],
      ),

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
