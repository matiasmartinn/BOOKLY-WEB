import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { UserDto } from 'shared/models';
import { usersService } from '../services';
import { userQueryKey } from './query-keys';

export const useUser = (userId?: number) =>
  useQuery<UserDto, ProblemDetails>({
    queryKey: userQueryKey(userId),
    queryFn: () => usersService.getById(userId!),
    enabled: userId != null,
  });
