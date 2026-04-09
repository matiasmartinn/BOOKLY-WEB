import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import { normalizeLocalDateTime } from 'shared/utils';
import { useBusinessStore } from 'store/use-buisness-store';

import { appointmentService } from '../services';

export interface RescheduleAppointmentValues {
  slot: string;
}

export const useRescheduleAppointment = (appointmentId: number) => {
  const queryClient = useQueryClient();
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMutation<AppointmentDto, ProblemDetails, RescheduleAppointmentValues>({
    mutationFn: (values) =>
      appointmentService.reschedule(appointmentId, {
        startDateTime: normalizeLocalDateTime(values.slot) ?? values.slot,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', selectedService?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['appointments', 'available-dates', selectedService?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['appointments', 'available-slots', selectedService?.id],
      });
    },
  });
};
