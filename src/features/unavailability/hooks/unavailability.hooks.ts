import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { appointmentQueryKeys } from 'features/appoiments/hooks/query-keys';
import { useBusinessStore } from 'store/use-business-store';

import { unavailabilityService, type CreateUnavailabilityDto } from '../services/unavailability.service';

// Una inhabilitacion puede afectar turnos de cualquier dia/vista, por eso se
// invalida el arbol completo de appointments (incluye disponibilidad por prefijo).
const invalidateAfterUnavailabilityChange = (queryClient: QueryClient, serviceId?: number) => {
  queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all() });
  queryClient.invalidateQueries({ queryKey: ['metrics', 'appointments'] });
  queryClient.invalidateQueries({ queryKey: ['schedule-unavailabilities', serviceId] });
};

export const useAddUnavailability = () => {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, CreateUnavailabilityDto>({
    mutationFn: (dto) => unavailabilityService.create(selectedService!.id, dto),
    onSuccess: () => {
      invalidateAfterUnavailabilityChange(queryClient, selectedService?.id);
    },
  });
};

export const useRemoveUnavailability = () => {
  const selectedService = useBusinessStore((state) => state.selectedService);
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (unavailabilityId) => unavailabilityService.remove(selectedService!.id, unavailabilityId),
    onSuccess: () => {
      invalidateAfterUnavailabilityChange(queryClient, selectedService?.id);
    },
  });
};
