import type { AppointmentViewModel } from '../viewmodel';
import { appointmentStatusIncludes } from 'features/dashboard/utils';
import {
  compareLocalDateTime,
  getCurrentBusinessDateTime,
  normalizeLocalDateTime,
} from 'shared/utils';

const canTransitionFromStatus = (status: string) =>
  appointmentStatusIncludes(
    status,
    'PENDING',
    'CREATED',
    'RESCHEDULE',
    'REPROGRAM',
  );

const hasAppointmentStarted = (
  startDateTime: string,
  currentBusinessDateTime = getCurrentBusinessDateTime(),
) => {
  const normalizedStartDateTime = normalizeLocalDateTime(startDateTime);

  if (!normalizedStartDateTime) {
    return false;
  }

  return compareLocalDateTime(normalizedStartDateTime, currentBusinessDateTime) <= 0;
};

export const getAppointmentActionVisibility = (
  appointment: AppointmentViewModel,
  currentBusinessDateTime = getCurrentBusinessDateTime(),
) => {
  const canTransition = canTransitionFromStatus(appointment.status);
  const started = hasAppointmentStarted(appointment.startDateTime, currentBusinessDateTime);

  return {
    canEdit: true,
    canReschedule: canTransition && !started,
    canCancel: canTransition && !started,
    canMarkAsAttended: canTransition,
    canMarkAsNoShow: canTransition,
  };
};
