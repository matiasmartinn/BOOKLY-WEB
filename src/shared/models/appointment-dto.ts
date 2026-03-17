export interface AppointmentDto {
  id: number;
  serviceId: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  durationMinutes: number;
  startDateTime: string;
  endDateTime: string;
  status: string;
  clientNotes?: string | null;
  createdOn: string;
}
