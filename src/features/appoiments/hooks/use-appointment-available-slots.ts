import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService } from '../services';

import { appointmentQueryKeys } from './query-keys';

export const useAppointmentAvailableSlots = (selectedDate: string | null) => {
  const selectedService = useBusinessStore((state) => state.selectedService);

  return useQuery<string[], ProblemDetails>({
    queryKey: appointmentQueryKeys.availableSlots(selectedService?.id, selectedDate),
    queryFn: () => appointmentService.getAvailableSlots(selectedService!.id, selectedDate!),
    enabled: !!selectedService && !!selectedDate,
    staleTime: 0,
  });
};
