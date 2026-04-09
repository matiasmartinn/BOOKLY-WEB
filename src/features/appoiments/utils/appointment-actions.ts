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
    canMarkAsAttended: permissions.canMarkAttendance && canTransition,
    canMarkAsNoShow: permissions.canMarkAttendance && canTransition,
  };
};
