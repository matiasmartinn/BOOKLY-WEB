import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { usersService } from '../services';
import { userQueryKey } from './query-keys';

export const useDeleteUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => usersService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
    },
  });
};
