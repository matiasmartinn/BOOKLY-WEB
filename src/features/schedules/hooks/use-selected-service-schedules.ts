import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { ScheduleDto } from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';
import { schedulesService } from '../services/schedules.service';

export const useSelectedServiceSchedules = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useQuery<ScheduleDto[], ProblemDetails>({
    queryKey: ['schedules', selectedService?.id],
    queryFn: () => schedulesService.getByServiceId(selectedService!.id),
    enabled: !!selectedService,
  });
};
