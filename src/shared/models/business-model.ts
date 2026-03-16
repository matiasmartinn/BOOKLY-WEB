import type { ScheduleModel } from './schedule-model';
import type { UnavailabilityModel } from './unavailability-model';

export interface BusinessModel {
  id: number;
  name: string;
  ownerId: string;
  slug: string;
  description?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  isActive: boolean;
  price?: number | null;
  shedules?: ScheduleModel[] | null;
  unavailabilities?: UnavailabilityModel[] | null;
}
