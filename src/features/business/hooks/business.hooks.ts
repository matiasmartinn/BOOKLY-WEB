import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto, ServicePublicBookingDto } from 'shared/models';

import {
  businessService,
  type SetBusinessSecretariesDto,
  type UpdateBusinessDto,
} from '../services';

const ownerBusinessesQueryKey = (ownerId?: number) => ['services', ownerId] as const;
const businessQueryKey = (businessId?: number) => ['services', 'detail', businessId] as const;
const businessPublicBookingQueryKey = (businessId?: number) =>
  ['services', 'detail', businessId, 'public-booking'] as const;

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
    queryClient.invalidateQueries({ queryKey: businessPublicBookingQueryKey(businessId) });
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

export const useBusinessPublicBooking = (businessId?: number) =>
  useQuery<ServicePublicBookingDto, ProblemDetails>({
    queryKey: businessPublicBookingQueryKey(businessId),
    queryFn: () => businessService.getPublicBooking(businessId!),
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

const syncBusinessPublicBooking = (
  queryClient: QueryClient,
  businessId: number,
  ownerId: number | undefined,
  publicBooking: ServicePublicBookingDto,
) => {
  queryClient.setQueryData(businessPublicBookingQueryKey(businessId), publicBooking);
  invalidateBusinessQueries(queryClient, businessId, ownerId);
};

export const useEnableBusinessPublicBooking = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServicePublicBookingDto, ProblemDetails, void>({
    mutationFn: () => businessService.enablePublicBooking(businessId),
    onSuccess: (publicBooking) =>
      syncBusinessPublicBooking(queryClient, businessId, ownerId, publicBooking),
  });
};

export const useDisableBusinessPublicBooking = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServicePublicBookingDto, ProblemDetails, void>({
    mutationFn: () => businessService.disablePublicBooking(businessId),
    onSuccess: (publicBooking) =>
      syncBusinessPublicBooking(queryClient, businessId, ownerId, publicBooking),
  });
};

export const useRegenerateBusinessPublicBooking = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServicePublicBookingDto, ProblemDetails, void>({
    mutationFn: () => businessService.regeneratePublicBooking(businessId),
    onSuccess: (publicBooking) =>
      syncBusinessPublicBooking(queryClient, businessId, ownerId, publicBooking),
  });
};

export const useSetBusinessSecretaries = (businessId: number, ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, SetBusinessSecretariesDto>({
    mutationFn: (dto) => businessService.setSecretaries(businessId, dto),
    onSuccess: () => invalidateBusinessQueries(queryClient, businessId, ownerId),
  });
};
