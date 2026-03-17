import { apiClient } from 'app/api';
import type { UnavailabilityDto } from 'shared/models';

export const unavailabilityService = {
  getByService: (serviceId: number) =>
    apiClient.get<UnavailabilityDto[]>(`/Services/${serviceId}/unavailability`).then((r) => r.data),
};
