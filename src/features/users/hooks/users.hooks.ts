import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { SecretaryDto, UserDto } from 'shared/models';
import { usersService, type CreateSecretaryDto, type UpdateUserDto } from '../services';

const userQueryKey = (userId?: number) => ['users', userId] as const;
const ownerSecretariesQueryKey = (ownerId?: number) =>
  ['users', 'owners', ownerId, 'secretaries'] as const;

export const useUser = (userId?: number) =>
  useQuery<UserDto, ProblemDetails>({
    queryKey: userQueryKey(userId),
    queryFn: () => usersService.getById(userId!),
    enabled: userId != null,
  });

export const useOwnerSecretaries = (ownerId?: number) =>
  useQuery<SecretaryDto[], ProblemDetails>({
    queryKey: ownerSecretariesQueryKey(ownerId),
    queryFn: () => usersService.getSecretariesByOwner(ownerId!),
    enabled: ownerId != null,
  });

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

export const useActivateSecretary = (secretaryId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => usersService.activateSecretary(secretaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'owners'] });
      queryClient.invalidateQueries({ queryKey: userQueryKey(secretaryId) });
    },
  });
};

export const useDeactivateSecretary = (secretaryId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => usersService.deactivateSecretary(secretaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'owners'] });
      queryClient.invalidateQueries({ queryKey: userQueryKey(secretaryId) });
    },
  });
};

export const useUpdateUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation<UserDto, ProblemDetails, UpdateUserDto>({
    mutationFn: (dto) => usersService.update(userId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['users', 'owners'] });
    },
  });
};

export const useDeleteUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => usersService.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
      queryClient.invalidateQueries({ queryKey: ['users', 'owners'] });
    },
  });
};
