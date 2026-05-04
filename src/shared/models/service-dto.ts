import type { DynamicFieldDefinitionDto } from './dynamic-field-dto';
import type { ScheduleDto } from './schedule-dto';
import type { PublicBookingAccessFields } from './public-booking-access';
import {
  resolvePublicBookingCode,
  resolvePublicBookingCodeUpdatedAt,
} from './public-booking-access';

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
  phoneNumber?: string | null;
  placeName?: string | null;
  address?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  capacity: number;
  mode: string;
  isActive: boolean;
  price?: number | null;
  isPublicBookingEnabled: boolean;
  publicBookingCode: string;
  publicBookingCodeUpdatedAt?: string | null;
  allowsExtraFields: boolean;
  fieldDefinitions: DynamicFieldDefinitionDto[];
  secretaryIds: Array<number | null>;
  secretaryPermissions: ServiceSecretaryPermissionsDto[];
  schedules: Array<ScheduleDto | null>;
}

export interface ServiceApiDto
  extends Omit<ServiceDto, 'publicBookingCode' | 'publicBookingCodeUpdatedAt'>,
    PublicBookingAccessFields {}

export const normalizeServiceDto = (service: ServiceApiDto): ServiceDto => ({
  ...service,
  publicBookingCode: resolvePublicBookingCode(service),
  publicBookingCodeUpdatedAt: resolvePublicBookingCodeUpdatedAt(service),
});
