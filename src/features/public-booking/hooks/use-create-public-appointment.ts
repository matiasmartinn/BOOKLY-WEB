import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AppointmentDto } from 'shared/models';

import { publicBookingService } from '../services';
import type { PublicCreateAppointmentDto } from '../types/public-booking';

import { publicBookingQueryKeys } from './query-keys';

export const useCreatePublicAppointment = (slug?: string, token?: string) => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, ProblemDetails, PublicCreateAppointmentDto>({
    mutationFn: (dto) => publicBookingService.createAppointment(slug!, token!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...publicBookingQueryKeys.access(slug, token), 'available-dates'],
      });

      queryClient.invalidateQueries({
        queryKey: [...publicBookingQueryKeys.access(slug, token), 'available-slots'],
      });
    },
  });
};
