import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AdminOwnerListItemDto, AdminOwnersQueryDto, AdminPagedResultDto } from '../models';
import { adminService } from '../services';
import { adminOwnersQueryKey } from './query-keys';

export const useAdminOwners = (query?: AdminOwnersQueryDto) =>
  useQuery<AdminPagedResultDto<AdminOwnerListItemDto>, ProblemDetails>({
    queryKey: adminOwnersQueryKey(query),
    queryFn: () => adminService.getOwners(query),
  });
