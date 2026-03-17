import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { ScheduleDto } from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';
import { schedulesService, type CreateServiceScheduleDto } from '../services/schedules.service';

export const useSchedules = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useQuery<ScheduleDto[], ProblemDetails>({
    queryKey: ['schedules', selectedService?.id],
    queryFn: () => schedulesService.getByServiceId(selectedService!.id),
    enabled: !!selectedService,
  });
};

export const useSaveSchedules = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const queryClient = useQueryClient();

  return useMutation<ScheduleDto[], ProblemDetails, CreateServiceScheduleDto[]>({
    mutationFn: (dto) => schedulesService.setSchedules(selectedService!.id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', selectedService?.id] });
    },
  });
};
