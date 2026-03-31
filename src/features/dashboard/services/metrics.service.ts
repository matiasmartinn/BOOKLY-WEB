import { apiClient } from 'app/api';
import type { AppointmentMetricsDto } from 'shared/models';

export interface AppointmentMetricsQueryDto {
  ownerId?: number;
  serviceId?: number;
  secretaryId?: number;
  from?: string;
  to?: string;
}

export const metricsService = {
  getAppointmentMetrics: (query: AppointmentMetricsQueryDto) =>
    apiClient
      .get<AppointmentMetricsDto>('/metrics/appointments', { params: query })
      .then((response) => response.data),
};
