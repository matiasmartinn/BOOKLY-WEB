import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { serviceTypeService } from 'features/service-types/services';
import type { ServiceTypeDto } from 'shared/models';

import { adminServiceTypesQueryKey } from './query-keys';

export const useAdminServiceTypes = () =>
  useQuery<ServiceTypeDto[], ProblemDetails>({
    queryKey: adminServiceTypesQueryKey(),
    queryFn: serviceTypeService.getAll,
  });
