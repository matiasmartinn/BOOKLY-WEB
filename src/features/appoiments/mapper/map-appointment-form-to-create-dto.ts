import { extractDateOnly, normalizeLocalDateTime } from 'shared/utils';

import type { AppointmentFormValues } from '../schema';
import type { CreateAppointmentDto } from '../services';
import type { AppointmentViewModel } from '../viewmodel';


export const createDefaultAppointmentFormValues = (): Partial<AppointmentFormValues> => ({
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
  date: null,
  slot: '',
  additionalFields: {},
});

export const mapAppointmentViewModelToFormValues = (
  appointment: AppointmentViewModel,
): AppointmentFormValues => {
  return {
    clientName: appointment.clientName,
    clientPhone: appointment.clientPhone,
    clientEmail: appointment.clientEmail ?? '',
    clientNotes: appointment.clientNotes ?? '',
    date: extractDateOnly(appointment.startDateTime),
    slot: normalizeLocalDateTime(appointment.startDateTime) ?? appointment.startDateTime,
    additionalFields: {},
  };
};

export const mapAppointmentFormToCreateDto = (
  values: AppointmentFormValues,
  serviceId: number,
): CreateAppointmentDto => ({
  serviceId,
  clientName: values.clientName.trim(),
  clientPhone: values.clientPhone.trim(),
  clientEmail: values.clientEmail.trim(),
  clientNotes: values.clientNotes?.trim() || undefined,
  startDateTime: normalizeLocalDateTime(values.slot) ?? values.slot,
});
