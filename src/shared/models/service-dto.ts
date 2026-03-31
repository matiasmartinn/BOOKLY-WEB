import type { ScheduleDto } from './schedule-dto';

export interface ServiceDto {
  id: number;
  name: string;
  ownerId: number;
  slug: string;
  description?: string | null;
  placeName?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  capacity: number;
  mode: string;
  isActive: boolean;
  price?: number | null;
  secretaryIds: Array<number | null>;
  schedules: Array<ScheduleDto | null>;
}
