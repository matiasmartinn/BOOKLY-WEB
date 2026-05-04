import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { getMonthDateOnlyRange } from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import { appointmentService } from '../services';

export const useAppointmentAvailableDates = (visibleDate: string | null) => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const { from, to } = getMonthDateOnlyRange(visibleDate);

  return useQuery<string[], ProblemDetails>({
    queryKey: ['appointments', 'available-dates', selectedService?.id, from, to],
    queryFn: () => appointmentService.getAvailableDates(selectedService!.id, from, to),
    enabled: !!selectedService,
  });
};
