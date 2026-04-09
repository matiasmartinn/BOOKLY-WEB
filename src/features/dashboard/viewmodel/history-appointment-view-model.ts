export interface HistoryAppointmentViewModel {
  id: number;
  serviceId: number;
  serviceName: string;
  assignedSecretaryId: number | null;
  createdByUserId: number | null;
  createdByUserDisplayName: string | null;
  createdByUserRole: string | null;
  createdByLabel: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  startDateTime: string;
  endDateTime: string;
  createdOn: string;
  status: string;
  detail: string;
}
