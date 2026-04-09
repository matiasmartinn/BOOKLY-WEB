import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import type { AdminPagedResultDto, AdminServiceListItemDto, AdminServicesQueryDto } from '../models';
import { adminService } from '../services';

import { adminServicesQueryKey } from './query-keys';

export const useAdminServices = (query?: AdminServicesQueryDto) =>
  useQuery<AdminPagedResultDto<AdminServiceListItemDto>, ProblemDetails>({
    queryKey: adminServicesQueryKey(query),
    queryFn: () => adminService.getServices(query),
  });
