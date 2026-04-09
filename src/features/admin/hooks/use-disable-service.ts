import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { adminService } from '../services';

import {
  adminDashboardQueryKey,
  adminServicesQueryKey,
} from './query-keys';

export const useDisableService = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (serviceId) => adminService.disableService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey() });
      queryClient.invalidateQueries({ queryKey: adminServicesQueryKey() });
    },
  });
};
