import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type {
  AppointmentDto,
  AppointmentListItemDto,
  AppointmentStatusHistoryDto,
  AppointmentSummaryDto,
} from 'shared/models';

import { appointmentService, type AppointmentDayQueryDto, type AppointmentQueryDto } from '../services';

import { appointmentQueryKeys } from './query-keys';

// La operacion de turnos prioriza datos frescos: se anula el staleTime global.
const FRESH = { staleTime: 0 } as const;

export const useAppointment = (appointmentId?: number) =>
  useQuery<AppointmentDto, ProblemDetails>({
    queryKey: appointmentQueryKeys.detail(appointmentId),
    queryFn: () => appointmentService.getById(appointmentId!),
    enabled: appointmentId != null,
    ...FRESH,
  });

export const useAppointmentSummary = (serviceId?: number, date?: string) =>
  useQuery<AppointmentSummaryDto[], ProblemDetails>({
    queryKey: appointmentQueryKeys.summary(serviceId, date),
    queryFn: () => appointmentService.getByServiceAndDate(serviceId!, date!),
    enabled: serviceId != null && Boolean(date),
    ...FRESH,
  });

export const useAppointmentsByDay = (query?: AppointmentDayQueryDto) =>
  useQuery<AppointmentListItemDto[], ProblemDetails>({
    queryKey: appointmentQueryKeys.day(query),
    queryFn: () => appointmentService.getByDay(query!),
    enabled: !!query?.date && (query.ownerId != null || query.serviceId != null),
    ...FRESH,
  });

export const useSearchAppointments = (query?: AppointmentQueryDto) =>
  useQuery<AppointmentListItemDto[], ProblemDetails>({
    queryKey: appointmentQueryKeys.search(query),
    queryFn: () => appointmentService.search(query!),
    enabled: query != null && (query.ownerId != null || query.serviceId != null),
    ...FRESH,
  });

export const useAppointmentHistoryByService = (serviceId?: number) =>
  useQuery<AppointmentStatusHistoryDto[], ProblemDetails>({
    queryKey: appointmentQueryKeys.historyByService(serviceId),
    queryFn: () => appointmentService.getHistoryByService(serviceId!),
    enabled: serviceId != null,
    ...FRESH,
  });
