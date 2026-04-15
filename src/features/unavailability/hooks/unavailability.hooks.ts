import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { useBusinessStore } from 'store/use-buisness-store';

import { unavailabilityService, type CreateUnavailabilityDto } from '../services/unavailability.service';

export const useAddUnavailability = () => {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, CreateUnavailabilityDto>({
    mutationFn: (dto) => unavailabilityService.create(selectedService!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['metrics', 'appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['schedule-unavailabilities', selectedService?.id],
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

export const useRemoveUnavailability = () => {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (unavailabilityId) => unavailabilityService.remove(selectedService!.id, unavailabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['metrics', 'appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['schedule-unavailabilities', selectedService?.id],
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
