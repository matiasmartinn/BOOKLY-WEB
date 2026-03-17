import { apiClient } from 'app/api';
import type { AppointmentFormValues } from '../schema';
import type { AppointmentDto } from 'shared/models/appointment-dto';

export interface CreateAppointmentDto extends Omit<AppointmentFormValues, 'startDateTime'> {
  serviceId: number;
  startDateTime: string;
}

export const appointmentService = {
  getAppointmentsByService: (serviceId: number) =>
    apiClient.get<AppointmentDto[]>(`/appointments/${serviceId}`).then((r) => r.data),

  create: (dto: CreateAppointmentDto) =>
    apiClient.post<AppointmentDto>('/appointments', dto).then((r) => r.data),
};
