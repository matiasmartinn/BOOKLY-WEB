import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type {
  AppointmentDto,
  AppointmentListItemDto,
  AppointmentStatusHistoryDto,
  AppointmentSummaryDto,
} from 'shared/models';
import { appointmentService, type AppointmentDayQueryDto, type AppointmentQueryDto } from '../services';

export const useAppointment = (appointmentId?: number) =>
  useQuery<AppointmentDto, ProblemDetails>({
    queryKey: ['appointments', 'detail', appointmentId],
    queryFn: () => appointmentService.getById(appointmentId!),
    enabled: appointmentId != null,
  });

export const useAppointmentSummary = (serviceId?: number, date?: string) =>
  useQuery<AppointmentSummaryDto[], ProblemDetails>({
    queryKey: ['appointments', 'summary', serviceId, date ?? ''],
    queryFn: () => appointmentService.getByServiceAndDate(serviceId!, date!),
    enabled: serviceId != null && Boolean(date),
  });

export const useAppointmentsByDay = (query?: AppointmentDayQueryDto) =>
  useQuery<AppointmentListItemDto[], ProblemDetails>({
    queryKey: ['appointments', 'day', query],
    queryFn: () => appointmentService.getByDay(query!),
    enabled: !!query?.date && (query.ownerId != null || query.serviceId != null),
  });

export const useSearchAppointments = (query?: AppointmentQueryDto) =>
  useQuery<AppointmentListItemDto[], ProblemDetails>({
    queryKey: ['appointments', 'search', query],
    queryFn: () => appointmentService.search(query!),
    enabled: query != null && (query.ownerId != null || query.serviceId != null),
  });

export const useAppointmentHistoryByService = (serviceId?: number) =>
  useQuery<AppointmentStatusHistoryDto[], ProblemDetails>({
    queryKey: ['appointments', 'history', 'service', serviceId],
    queryFn: () => appointmentService.getHistoryByService(serviceId!),
    enabled: serviceId != null,
  });

export const useAppointmentHistory = (appointmentId?: number) =>
  useQuery<AppointmentStatusHistoryDto[], ProblemDetails>({
    queryKey: ['appointments', 'history', appointmentId],
    queryFn: () => appointmentService.getHistory(appointmentId!),
    enabled: appointmentId != null,
  });
