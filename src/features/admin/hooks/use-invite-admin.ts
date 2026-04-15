import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { UserEmailDispatchResultDto } from 'shared/models';

import type { InviteAdminDto } from '../models';
import { adminService } from '../services';

import { adminDashboardQueryKey } from './query-keys';

export const useInviteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<UserEmailDispatchResultDto, ProblemDetails, InviteAdminDto>({
    mutationFn: (dto) => adminService.inviteAdmin(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKey() });
    },
  });
};
