import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto } from 'shared/models';
import {
  businessService,
  type SetBusinessSecretariesDto,
  type UpdateBusinessDto,
} from '../services';

const ownerBusinessesQueryKey = (ownerId?: number) => ['services', ownerId] as const;
const businessQueryKey = (businessId?: number) => ['services', 'detail', businessId] as const;

const invalidateBusinessQueries = (
  queryClient: QueryClient,
  businessId?: number,
  ownerId?: number,
) => {
  queryClient.invalidateQueries({ queryKey: ['services'] });

  if (ownerId != null) {
    queryClient.invalidateQueries({ queryKey: ownerBusinessesQueryKey(ownerId) });
  }

  if (businessId != null) {
    queryClient.invalidateQueries({ queryKey: businessQueryKey(businessId) });
  }
};

export const useOwnerBusinesses = (ownerId?: number) =>
  useQuery<BusinessDto[], ProblemDetails>({
    queryKey: ownerBusinessesQueryKey(ownerId),
    queryFn: () => businessService.getByOwner(ownerId!),
    enabled: ownerId != null,
  });

export const useBusiness = (businessId?: number) =>
  useQuery<BusinessDto, ProblemDetails>({
    queryKey: businessQueryKey(businessId),
    queryFn: () => businessService.getById(businessId!),
    enabled: businessId != null,
  });

export const useUpdateBusiness = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, UpdateBusinessDto>({
    mutationFn: (dto) => businessService.update(businessId, dto),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};

export const useDeleteBusiness = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => businessService.delete(businessId),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};

export const useActivateBusiness = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => businessService.activate(businessId),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};

export const useDeactivateBusiness = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => businessService.deactivate(businessId),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};

export const useSetBusinessSecretaries = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, SetBusinessSecretariesDto>({
    mutationFn: (dto) => businessService.setSecretaries(businessId, dto),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};
