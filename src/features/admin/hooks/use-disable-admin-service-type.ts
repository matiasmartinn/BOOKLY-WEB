import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { serviceTypeService } from 'features/service-types/services';

import { invalidateAdminServiceTypeQueries } from './query-keys';

export const useDisableAdminServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (serviceTypeId) => serviceTypeService.delete(serviceTypeId),
    onSuccess: () => {
      invalidateAdminServiceTypeQueries(queryClient);
    },
  });
};
