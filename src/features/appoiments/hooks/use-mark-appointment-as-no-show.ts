import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService } from '../services';

import { invalidateAppointmentQueries } from './query-keys';

export const useMarkAppointmentAsNoShow = (appointmentId: number) => {
  const queryClient = useQueryClient();
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMutation<void, ProblemDetails>({
    mutationFn: () => appointmentService.markAsNoShow(appointmentId),
    onSuccess: () => {
      invalidateAppointmentQueries(queryClient, selectedService?.id, { history: true });
    },
  });
};
