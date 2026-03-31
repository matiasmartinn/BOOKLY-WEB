import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentMetricsDto } from 'shared/models';
import { metricsService, type AppointmentMetricsQueryDto } from '../services';

const appointmentMetricsQueryKey = (query?: AppointmentMetricsQueryDto) =>
  ['metrics', 'appointments', query] as const;

export const useAppointmentMetrics = (query?: AppointmentMetricsQueryDto) =>
  useQuery<AppointmentMetricsDto, ProblemDetails>({
    queryKey: appointmentMetricsQueryKey(query),
    queryFn: () => metricsService.getAppointmentMetrics(query!),
    enabled:
      query != null &&
      Boolean(query.from) &&
      Boolean(query.to) &&
      (query.ownerId != null || query.serviceId != null),
  });
