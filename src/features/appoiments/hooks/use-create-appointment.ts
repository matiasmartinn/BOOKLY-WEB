import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessStore } from 'store/use-buisness-store';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import type { ProblemDetails } from 'app/api';
import { normalizeLocalDateTime } from 'shared/utils';
import type { AppointmentFormValues } from '../schema';
import { appointmentService } from '../services';

export const useCreateAppointment = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, ProblemDetails, AppointmentFormValues>({
    mutationFn: (values) =>
      appointmentService.create({
        serviceId: selectedService!.id,
        clientName: values.clientName.trim(),
        clientPhone: values.clientPhone.trim(),
        clientEmail: values.clientEmail.trim(),
        clientNotes: values.clientNotes?.trim() || undefined,
        startDateTime: normalizeLocalDateTime(values.slot) ?? values.slot,
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
