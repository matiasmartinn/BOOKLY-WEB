import { useQuery } from '@tanstack/react-query';
import { unavailabilityService } from './unavailability.service';
import { unavailabilityListAdapter } from 'features/unavailability/unavailability.adapter';

export const useScheduleUnavailability = (serviceId: number) => {
  return useQuery({
    queryKey: ['schedule-unavailabilities', serviceId],
    queryFn: () => unavailabilityService.getByService(serviceId),
    retry: 2,
    select: (response) => unavailabilityListAdapter(response),
  });
};
