import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { UserDto } from 'shared/models';
import { usersService, type CreateSecretaryDto } from '../services';
import { ownerSecretariesQueryKey } from './query-keys';

export const useCreateSecretary = (ownerId: number) => {
  const queryClient = useQueryClient();

  return useMutation<UserDto, ProblemDetails, CreateSecretaryDto>({
    mutationFn: (dto) => usersService.createSecretary(ownerId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerSecretariesQueryKey(ownerId) });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
