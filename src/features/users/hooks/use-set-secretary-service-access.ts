import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto } from 'shared/models';
import { usersService, type SetSecretaryServiceAccessDto } from '../services';
import { ownerSecretariesQueryKey } from './query-keys';

export const useSetSecretaryServiceAccess = (serviceId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, SetSecretaryServiceAccessDto>({
    mutationFn: (dto) => usersService.setSecretaryServiceAccess(serviceId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });

      if (ownerId != null) {
        queryClient.invalidateQueries({ queryKey: ownerSecretariesQueryKey(ownerId) });
      }
    },
  });
};
