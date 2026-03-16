import { apiClient } from 'app/api';
import type { UnavailabilityModel } from 'shared/models';

export const unavailabilityService = {
  getByService: (serviceId: number) =>
    apiClient
      .get<UnavailabilityModel[]>(`/Services/${serviceId}/unavailabilities`)
      .then((r) => r.data),
};
