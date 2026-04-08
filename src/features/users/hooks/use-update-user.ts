import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { UserDto } from 'shared/models';
import { usersService, type UpdateUserDto } from '../services';
import { userQueryKey } from './query-keys';

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation<UserDto, ProblemDetails, UpdateUserDto>({
    mutationFn: (dto) => usersService.update(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
    },
  });
};
