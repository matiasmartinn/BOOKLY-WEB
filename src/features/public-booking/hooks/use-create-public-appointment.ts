import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models';

import { publicBookingService } from '../services';
import type { PublicCreateAppointmentDto } from '../types/public-booking';

import { publicBookingQueryKeys } from './query-keys';

export const useCreatePublicAppointment = (slug?: string, code?: string) => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, ProblemDetails, PublicCreateAppointmentDto>({
    mutationFn: (dto) => publicBookingService.createAppointment(slug!, code!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...publicBookingQueryKeys.access(slug, code), 'available-dates'],
      });

      queryClient.invalidateQueries({
        queryKey: [...publicBookingQueryKeys.access(slug, code), 'available-slots'],
      });
    },
  });
};
