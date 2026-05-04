import { appointmentStatusIncludes } from 'features/dashboard/utils';
import {
  compareLocalDateTime,
  getCurrentBusinessDateTime,
  normalizeLocalDateTime,
} from 'shared/utils';

import type { AppointmentViewModel } from '../viewmodel';

export interface AppointmentActionPermissions {
  canEdit: boolean;
  canReschedule: boolean;
  canCancel: boolean;
  canMarkAttendance: boolean;
}

export const APPOINTMENT_NOT_STARTED_MESSAGE = 'El turno todavía no inició.';

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
  permissions: AppointmentActionPermissions,
  currentBusinessDateTime = getCurrentBusinessDateTime(),
) => {
  const canTransition = canTransitionFromStatus(appointment.status);
  const started = hasAppointmentStarted(appointment.startDateTime, currentBusinessDateTime);

  return {
    canEdit: permissions.canEdit,
    canReschedule: permissions.canReschedule && canTransition && !started,
    canCancel: permissions.canCancel && canTransition && !started,
    canShowMarkAsAttended: permissions.canMarkAttendance && canTransition,
    canShowMarkAsNoShow: permissions.canMarkAttendance && canTransition,
    canMarkAsAttended: permissions.canMarkAttendance && canTransition && started,
    canMarkAsNoShow: permissions.canMarkAttendance && canTransition && started,
    markAttendanceDisabledReason:
      permissions.canMarkAttendance && canTransition && !started
        ? APPOINTMENT_NOT_STARTED_MESSAGE
        : null,
  };
};
