import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import { normalizeBusinessLocalDateTime } from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService } from '../services';

import { invalidateAppointmentQueries } from './query-keys';

export interface RescheduleAppointmentValues {
  slot: string;
}

export const useRescheduleAppointment = (appointmentId: number) => {
  const queryClient = useQueryClient();
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMutation<AppointmentDto, ProblemDetails, RescheduleAppointmentValues>({
    mutationFn: (values) =>
      appointmentService.reschedule(appointmentId, {
        startDateTime: normalizeBusinessLocalDateTime(values.slot) ?? values.slot,
      }),
    onSuccess: () => {
      invalidateAppointmentQueries(queryClient, selectedService?.id, { availability: true });
    },
  });
};
