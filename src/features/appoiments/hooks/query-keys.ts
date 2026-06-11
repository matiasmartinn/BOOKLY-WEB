import type { QueryClient } from '@tanstack/react-query';

import type { AppointmentDayQueryDto, AppointmentQueryDto } from '../services';

export const appointmentQueryKeys = {
  all: () => ['appointments'] as const,
  byService: (serviceId?: number) => ['appointments', serviceId] as const,
  detail: (appointmentId?: number) => ['appointments', 'detail', appointmentId] as const,
  summary: (serviceId?: number, date?: string) =>
    ['appointments', 'summary', serviceId, date ?? ''] as const,
  day: (query?: AppointmentDayQueryDto) => ['appointments', 'day', query] as const,
  search: (query?: AppointmentQueryDto) => ['appointments', 'search', query] as const,
  historyByService: (serviceId?: number) =>
    ['appointments', 'history', 'service', serviceId] as const,
  availableDatesByService: (serviceId?: number) =>
    ['appointments', 'available-dates', serviceId] as const,
  availableDates: (serviceId?: number, from?: string, to?: string) =>
    [...appointmentQueryKeys.availableDatesByService(serviceId), from, to] as const,
  availableSlotsByService: (serviceId?: number) =>
    ['appointments', 'available-slots', serviceId] as const,
  availableSlots: (serviceId?: number, date?: string | null) =>
    [...appointmentQueryKeys.availableSlotsByService(serviceId), date] as const,
};

interface InvalidateAppointmentQueriesOptions {
  history?: boolean;
  availability?: boolean;
}

export const invalidateAppointmentQueries = (
  queryClient: QueryClient,
  serviceId?: number,
  options?: InvalidateAppointmentQueriesOptions,
) => {
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.byService(serviceId) });

  if (options?.history) {
    queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.historyByService(serviceId) });
  }

  if (options?.availability) {
    queryClient.invalidateQueries({
      queryKey: appointmentQueryKeys.availableDatesByService(serviceId),
    });
    queryClient.invalidateQueries({
      queryKey: appointmentQueryKeys.availableSlotsByService(serviceId),
    });
  }
};
