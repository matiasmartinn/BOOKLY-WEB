import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService, type CreateAppointmentDto } from '../services';

export const useCreateAppointment = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, ProblemDetails, CreateAppointmentDto>({
    mutationFn: (dto) => appointmentService.create(dto),
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
