import type { ScheduleDto } from './schedule-dto';

export enum SecretaryPermission {
  ViewAppointments = 1,
  CreateAppointments = 2,
  EditAppointments = 3,
  CancelAppointments = 4,
  RescheduleAppointments = 5,
  MarkAttendance = 6,
  ManageSchedules = 7,
}

export interface ServiceSecretaryPermissionsDto {
  secretaryId: number;
  permissions: SecretaryPermission[];
}

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
  isPublicBookingEnabled: boolean;
  publicBookingToken: string;
  publicBookingTokenUpdateAt?: string | null;
  secretaryIds: Array<number | null>;
  secretaryPermissions: ServiceSecretaryPermissionsDto[];
  schedules: Array<ScheduleDto | null>;
}
