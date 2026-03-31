export interface AppointmentFieldValueDto {
  fieldDefinitionId: number;
  value: string;
}

export interface AppointmentDto {
  id: number;
  serviceId: number;
  assignedSecretaryId?: number | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  status: string;
  clientNotes?: string | null;
  cancelReason?: string | null;
  createdOn: string;
  fieldValues: AppointmentFieldValueDto[];
}

export interface AppointmentListItemDto {
  id: number;
  serviceId: number;
  serviceName: string;
  assignedSecretaryId?: number | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  status: string;
  clientNotes?: string | null;
  cancelReason?: string | null;
  createdOn: string;
}

export interface AppointmentSummaryDto {
  id: number;
  startDateTime: string;
  endDateTime: string;
  clientName: string;
  status: string;
  assignedSecretaryId?: number | null;
}

export interface AppointmentStatusHistoryDto {
  id: number;
  appointmentId: number;
  userId?: number | null;
  userDisplayName?: string | null;
  oldStatus?: string | null;
  newStatus: string;
  reason?: string | null;
  occurredOn: string;
}
