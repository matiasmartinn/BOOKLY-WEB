import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import { useBusinessStore } from 'store/use-buisness-store';

import { appointmentService } from '../services';

export interface UpdateAppointmentValues {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

export const useUpdateAppointment = (appointmentId: number) => {
  const queryClient = useQueryClient();
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMutation<AppointmentDto, ProblemDetails, UpdateAppointmentValues>({
    mutationFn: (values) =>
      appointmentService.update(appointmentId, {
        clientName: values.clientName.trim(),
        clientPhone: values.clientPhone.trim(),
        clientEmail: values.clientEmail.trim(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', selectedService?.id],
      });
    },
  });
};
