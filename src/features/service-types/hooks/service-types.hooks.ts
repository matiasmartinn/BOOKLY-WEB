import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { ServiceTypeDto } from 'shared/models';

import {
  serviceTypeService,
  type CreateServiceTypeDto,
  type UpdateServiceTypeDto,
} from '../services';

const serviceTypesQueryKey = ['service-types'] as const;
const serviceTypeQueryKey = (serviceTypeId?: number) => ['service-types', serviceTypeId] as const;

const invalidateServiceTypeQueries = (queryClient: QueryClient, id?: number) => {
  queryClient.invalidateQueries({ queryKey: serviceTypesQueryKey });

  if (id != null) {
    queryClient.invalidateQueries({ queryKey: serviceTypeQueryKey(id) });
  }
};

export const useServiceTypes = () =>
  useQuery<ServiceTypeDto[], ProblemDetails>({
    queryKey: serviceTypesQueryKey,
    queryFn: serviceTypeService.getAll,
  });

export const useServiceType = (serviceTypeId?: number) =>
  useQuery<ServiceTypeDto, ProblemDetails>({
    queryKey: serviceTypeQueryKey(serviceTypeId),
    queryFn: () => serviceTypeService.getById(serviceTypeId!),
    enabled: serviceTypeId != null,
  });

export const useCreateServiceType = () => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, CreateServiceTypeDto>({
    mutationFn: serviceTypeService.create,
    onSuccess: (serviceType) => invalidateServiceTypeQueries(queryClient, serviceType.id),
  });
};

export const useUpdateServiceType = (serviceTypeId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, UpdateServiceTypeDto>({
    mutationFn: (dto) => serviceTypeService.update(serviceTypeId, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useDeleteServiceType = (serviceTypeId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.delete(serviceTypeId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};
