import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { adminService } from '../services';

import {
  adminDashboardQueryKey,
  adminOwnersQueryKey,
  adminServicesQueryKey,
} from './query-keys';

export const useDisableOwner = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (ownerId) => adminService.disableOwner(ownerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey() });
      queryClient.invalidateQueries({ queryKey: adminOwnersQueryKey() });
      queryClient.invalidateQueries({ queryKey: adminServicesQueryKey() });
    },
  });
};
