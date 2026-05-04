import type { DynamicFieldDefinitionDto } from 'shared/models';

export interface PublicServiceBookingDto {
  serviceId: number;
  slug: string;
  name: string;
  ownerName?: string | null;
  description?: string | null;
  phoneNumber?: string | null;
  placeName?: string | null;
  address?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  capacity: number;
  mode: string;
  price?: number | null;
  allowsExtraFields: boolean;
  fieldDefinitions: DynamicFieldDefinitionDto[];
}

export interface PublicCreateAppointmentDto {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  clientNotes?: string;
  fieldValues?: PublicCreateAppointmentFieldValueDto[];
}

export interface PublicCreateAppointmentFieldValueDto {
  fieldDefinitionId: number;
  value: string;
}

export type PublicBookingTerminalState =
  | 'invalid-access'
  | 'service-inactive'
  | 'public-booking-disabled';

export interface PublicBookingProblemState {
  kind: PublicBookingTerminalState;
  title: string;
  description: string;
  supportingText?: string;
}
