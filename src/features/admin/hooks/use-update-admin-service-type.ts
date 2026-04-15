import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import {
  serviceTypeService,
  type UpdateServiceTypeDto,
} from 'features/service-types/services';
import type { ServiceTypeDto } from 'shared/models';

import { invalidateAdminServiceTypeQueries } from './query-keys';

export const useUpdateAdminServiceType = (serviceTypeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, UpdateServiceTypeDto>({
    mutationFn: (dto) => serviceTypeService.update(serviceTypeId!, dto),
    onSuccess: () => {
      invalidateAdminServiceTypeQueries(queryClient);
    },
  });
};
