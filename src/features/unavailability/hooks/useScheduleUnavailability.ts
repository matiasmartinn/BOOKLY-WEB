import { useQuery } from '@tanstack/react-query';
import { useBusinessStore } from 'store/use-buisness-store';

import { mapUnavailabilityListToViewModel } from '../adapter/unavailability.adapter';
import { unavailabilityService } from '../services/unavailability.service';

export const useScheduleUnavailability = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  return useQuery({
    queryKey: ['schedule-unavailabilities', selectedService?.id],
    queryFn: () => unavailabilityService.getByService(selectedService!.id),
    enabled: !!selectedService,
    select: (response) => mapUnavailabilityListToViewModel(response),
  });
};
