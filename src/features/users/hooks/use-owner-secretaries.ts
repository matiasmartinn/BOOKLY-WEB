import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { SecretaryDto } from 'shared/models';

import { usersService } from '../services';

import { ownerSecretariesQueryKey } from './query-keys';

export const useOwnerSecretaries = (ownerId?: number) =>
  useQuery<SecretaryDto[], ProblemDetails>({
    queryKey: ownerSecretariesQueryKey(ownerId),
    queryFn: () => usersService.getSecretariesByOwner(ownerId!),
    enabled: ownerId != null,
  });
