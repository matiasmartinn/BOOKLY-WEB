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
}

export interface PublicCreateAppointmentDto {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  clientNotes?: string;
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
