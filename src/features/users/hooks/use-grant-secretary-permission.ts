import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { usersService, type UpdateSecretaryPermissionDto } from '../services';

import { ownerSecretariesQueryKey } from './query-keys';

export const useGrantSecretaryPermission = (
  serviceId: number,
  secretaryId: number,
  ownerId?: number,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, UpdateSecretaryPermissionDto>({
    mutationFn: (dto) => usersService.grantSecretaryPermission(serviceId, secretaryId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });

      if (ownerId != null) {
        queryClient.invalidateQueries({ queryKey: ownerSecretariesQueryKey(ownerId) });
      }
    },
  });
};
