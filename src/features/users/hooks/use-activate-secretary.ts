import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { usersService } from '../services';

import { userQueryKey } from './query-keys';

export const useActivateSecretary = (secretaryId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => usersService.activateSecretary(secretaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: userQueryKey(secretaryId) });
    },
  });
};
