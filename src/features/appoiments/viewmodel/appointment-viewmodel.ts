export interface AppointmentDynamicColumnViewModel {
  key: string;
  label: string;
}

export interface AppointmentExtraFieldViewModel extends AppointmentDynamicColumnViewModel {
  value: string;
}

export interface AppointmentViewModel {
  id: number;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  status: string;
  clientNotes: string | null;
  createdOn: string;
  dateLabel: string;
  timeLabel: string;
  extraFields: AppointmentExtraFieldViewModel[];
}
