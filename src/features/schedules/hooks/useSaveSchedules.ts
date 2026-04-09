import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto } from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';

import { schedulesService, type CreateServiceScheduleDto } from '../services/schedules.service';

export const useSaveSchedules = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const updateService = useBusinessStore((s) => s.updateService);
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, CreateServiceScheduleDto[]>({
    mutationFn: (dto) => schedulesService.setSchedules(selectedService!.id, dto),
    onSuccess: (service) => {
      updateService(service);
      queryClient.invalidateQueries({ queryKey: ['schedules', selectedService?.id] });
      queryClient.invalidateQueries({ queryKey: ['services', 'detail', selectedService?.id] });
    },
  });
};
