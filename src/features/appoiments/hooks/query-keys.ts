import type { QueryClient } from '@tanstack/react-query';

import type { AppointmentDayQueryDto, AppointmentQueryDto } from '../services';

export const appointmentQueryKeys = {
  all: () => ['appointments'] as const,
  byService: (serviceId?: number) => ['appointments', serviceId] as const,
  detailRoot: () => ['appointments', 'detail'] as const,
  detail: (appointmentId?: number) =>
    [...appointmentQueryKeys.detailRoot(), appointmentId] as const,
  summaryRoot: () => ['appointments', 'summary'] as const,
  summary: (serviceId?: number, date?: string) =>
    [...appointmentQueryKeys.summaryRoot(), serviceId, date ?? ''] as const,
  dayRoot: () => ['appointments', 'day'] as const,
  day: (query?: AppointmentDayQueryDto) => [...appointmentQueryKeys.dayRoot(), query] as const,
  searchRoot: () => ['appointments', 'search'] as const,
  search: (query?: AppointmentQueryDto) =>
    [...appointmentQueryKeys.searchRoot(), query] as const,
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

  // Las keys de agenda/summary/search llevan el serviceId dentro de un objeto o en
  // una posicion no prefijable, asi que esas subraices se invalidan completas.
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.dayRoot() });
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.summaryRoot() });
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.searchRoot() });
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.detailRoot() });

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
