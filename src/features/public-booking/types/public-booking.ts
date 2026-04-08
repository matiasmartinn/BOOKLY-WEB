export enum PublicServiceFieldType {
  Text = 1,
  MultilineText = 2,
  Number = 3,
  Date = 4,
  Select = 5,
  Checkbox = 6,
}

export interface PublicServiceFieldOptionDto {
  id: number;
  value: string;
  label: string;
  sortOrder: number;
}

export interface PublicServiceFieldDto {
  id: number;
  key: string;
  label: string;
  description?: string | null;
  fieldType: PublicServiceFieldType;
  isRequired: boolean;
  sortOrder: number;
  options: PublicServiceFieldOptionDto[];
}

export interface PublicServiceBookingDto {
  serviceId: number;
  slug: string;
  name: string;
  ownerName?: string | null;
  description?: string | null;
  placeName?: string | null;
  address?: string | null;
  googleMapsUrl?: string | null;
  serviceTypeId: number;
  durationMinutes: number;
  capacity: number;
  mode: string;
  price?: number | null;
  fieldDefinitions: PublicServiceFieldDto[];
}

export interface PublicCreateAppointmentFieldValueDto {
  fieldDefinitionId: number;
  value: string;
}

export interface PublicCreateAppointmentDto {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  clientNotes?: string;
  fieldValues?: PublicCreateAppointmentFieldValueDto[];
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
