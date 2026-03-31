import { apiClient } from 'app/api';
import { useAuthStore } from 'store/use-auth-store';
import type {
  AppointmentDto,
  AppointmentListItemDto,
  AppointmentStatusHistoryDto,
  AppointmentSummaryDto,
} from 'shared/models';

export interface CreateAppointmentFieldValueDto {
  fieldDefinitionId: number;
  value: string;
}

export interface CreateAppointmentDto {
  serviceId: number;
  userId?: number | null;
  assignedSecretaryId?: number | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  clientNotes?: string;
  fieldValues?: CreateAppointmentFieldValueDto[];
}

export interface UpdateAppointmentDto {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientNotes?: string;
}

export interface RescheduleAppointmentDto {
  startDateTime: string;
}

export interface CancelAppointmentDto {
  userId?: number | null;
  reason?: string;
}

export interface AppointmentDayQueryDto {
  date: string;
  ownerId?: number;
  serviceId?: number;
}

export interface AppointmentQueryDto {
  ownerId?: number;
  serviceId?: number;
  from?: string;
  to?: string;
  status?: string;
  clientSearch?: string;
  clientEmail?: string;
}

const buildActorPayload = () => ({
  userId: useAuthStore.getState().user?.id ?? null,
});

export const appointmentService = {
  getById: (appointmentId: number) =>
    apiClient.get<AppointmentDto>(`/appointments/${appointmentId}`).then((r) => r.data),

  getByService: (serviceId: number) =>
    apiClient.get<AppointmentDto[]>('/appointments', { params: { serviceId } }).then((r) => r.data),

  getByServiceAndDate: (serviceId: number, date: string) =>
    apiClient.get<AppointmentSummaryDto[]>('/appointments/summary', { params: { serviceId, date } }).then((r) => r.data),

  getByDay: (query: AppointmentDayQueryDto) =>
    apiClient.get<AppointmentListItemDto[]>('/appointments/day', { params: query }).then((r) => r.data),

  search: (query: AppointmentQueryDto) =>
    apiClient.get<AppointmentListItemDto[]>('/appointments/search', { params: query }).then((r) => r.data),

  getHistoryByService: (serviceId: number) =>
    apiClient
      .get<AppointmentStatusHistoryDto[]>('/appointments/history', { params: { serviceId } })
      .then((r) => r.data),

  getHistory: (appointmentId: number) =>
    apiClient
      .get<AppointmentStatusHistoryDto[]>(`/appointments/${appointmentId}/history`)
      .then((r) => r.data),

  getAvailableDates: (serviceId: number, from: string, to: string) =>
    apiClient
      .get<string[]>(`/services/${serviceId}/availability/dates`, { params: { from, to } })
      .then((r) => r.data),

  getAvailableSlots: (serviceId: number, date: string) =>
    apiClient
      .get<string[]>(`/services/${serviceId}/availability/slots`, {
        params: { date },
      })
      .then((r) => r.data),

  create: (dto: CreateAppointmentDto) =>
    apiClient.post<AppointmentDto>('/appointments', { ...dto, ...buildActorPayload() }).then((r) => r.data),

  update: (id: number, dto: UpdateAppointmentDto) =>
    apiClient.put<AppointmentDto>(`/appointments/${id}`, dto).then((r) => r.data),

  reschedule: (id: number, dto: RescheduleAppointmentDto) =>
    apiClient.patch<AppointmentDto>(`/appointments/${id}/reschedule`, dto).then((r) => r.data),

  cancel: (id: number, dto: CancelAppointmentDto) =>
    apiClient.patch<void>(`/appointments/${id}/cancel`, { ...dto, ...buildActorPayload() }).then((r) => r.data),

  markAsAttended: (id: number) =>
    apiClient
      .patch<void>(`/appointments/${id}/attended`, null, { params: buildActorPayload() })
      .then((r) => r.data),

  markAsNoShow: (id: number) =>
    apiClient
      .patch<void>(`/appointments/${id}/no-show`, null, { params: buildActorPayload() })
      .then((r) => r.data),
};
