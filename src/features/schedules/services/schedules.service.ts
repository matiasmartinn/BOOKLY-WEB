import { apiClient } from 'app/api';
import type { BusinessDto, ScheduleDto } from 'shared/models';

export interface CreateServiceScheduleDto {
  startTime: string;
  endTime: string;
  capacity?: number;
  day: number;
}

export const schedulesService = {
  getByServiceId: (serviceId: number) =>
    apiClient.get<ScheduleDto[]>(`/services/${serviceId}/schedules`).then((r) => r.data),

  setSchedules: (serviceId: number, dto: CreateServiceScheduleDto[]) =>
    apiClient.put<BusinessDto>(`/services/${serviceId}/schedules`, dto).then((r) => r.data),
};
