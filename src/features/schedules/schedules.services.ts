import { apiClient } from 'app/api';
import type { ScheduleModel } from 'shared/models';

export interface CreateServiceScheduleDto {
  startTime: Date;
  endtime: Date;
  capacity: number;
  day: number;
}

export const schedulesService = {
  setSchedules: (dto: CreateServiceScheduleDto) =>
    apiClient.put<ScheduleModel[]>('/Services/SetSchedules', dto).then((r) => r.data),
  getSchedules: (servicesId: number) =>
    apiClient.get<ScheduleModel[]>(`/Services/${servicesId}/schedules`).then((r) => r.data),
};
