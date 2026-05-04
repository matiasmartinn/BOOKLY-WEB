import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService } from '../services';

export interface CancelAppointmentValues {
  reason?: string;
}

export const useCancelAppointment = (appointmentId: number) => {
  const queryClient = useQueryClient();
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMutation<void, ProblemDetails, CancelAppointmentValues | undefined>({
    mutationFn: (values) =>
      appointmentService.cancel(appointmentId, {
        reason: values?.reason?.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', selectedService?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['appointments', 'history', 'service', selectedService?.id],
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
