import { apiClient } from 'app/api';
import type { UnavailabilityDto } from 'shared/models';

export interface CreateUnavailabilityDto {
  startDate: string;
  endDate: string;
  startTime?: string | null;
  endTime?: string | null;
  reason?: string | null;
}

export const unavailabilityService = {
  getByService: (serviceId: number) =>
    apiClient.get<UnavailabilityDto[]>(`/services/${serviceId}/unavailabilities`).then((r) => r.data),

  create: (serviceId: number, dto: CreateUnavailabilityDto) =>
    apiClient.post<void>(`/services/${serviceId}/unavailabilities`, dto).then((r) => r.data),

  remove: (serviceId: number, unavailabilityId: number) =>
    apiClient
      .delete<void>(`/services/${serviceId}/unavailabilities/${unavailabilityId}`)
      .then((r) => r.data),
};
