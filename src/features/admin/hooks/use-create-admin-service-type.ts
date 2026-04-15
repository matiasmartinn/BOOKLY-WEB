import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import {
  serviceTypeService,
  type CreateServiceTypeDto,
} from 'features/service-types/services';
import type { ServiceTypeDto } from 'shared/models';

import { invalidateAdminServiceTypeQueries } from './query-keys';

export const useCreateAdminServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, CreateServiceTypeDto>({
    mutationFn: serviceTypeService.create,
    onSuccess: () => {
      invalidateAdminServiceTypeQueries(queryClient);
    },
  });
};
