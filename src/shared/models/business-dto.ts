import type { ScheduleDto } from './schedule-dto';
import type { UnavailabilityDto } from './unavailability-dto';

export interface BusinessDto {
  id: number;
  name: string;
  ownerId: string;
  slug: string;
  description?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  isActive: boolean;
  price?: number | null;
  shedules?: ScheduleDto[] | null;
  unavailabilities?: UnavailabilityDto[] | null;
}
