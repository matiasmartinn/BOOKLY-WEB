import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { ServiceTypeDto } from 'shared/models';

import {
  serviceTypeService,
  type CreateServiceTypeDto,
  type CreateServiceTypeFieldDto,
  type UpdateServiceTypeDto,
  type UpdateServiceTypeFieldDto,
} from '../services';

const serviceTypesQueryKey = ['service-types'] as const;
const serviceTypeQueryKey = (serviceTypeId?: number) => ['service-types', serviceTypeId] as const;
const serviceTypeFieldsQueryKey = (serviceTypeId?: number) =>
  ['service-types', serviceTypeId, 'fields'] as const;

const invalidateServiceTypeQueries = (queryClient: QueryClient, id?: number) => {
  queryClient.invalidateQueries({ queryKey: serviceTypesQueryKey });

  if (id != null) {
    queryClient.invalidateQueries({ queryKey: serviceTypeQueryKey(id) });
    queryClient.invalidateQueries({ queryKey: serviceTypeFieldsQueryKey(id) });
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

export const useGetServiceTypeFields = (serviceTypeId?: number) =>
  useQuery<ServiceTypeDto, ProblemDetails>({
    queryKey: serviceTypeFieldsQueryKey(serviceTypeId),
    queryFn: () => serviceTypeService.getByIdWithFields(serviceTypeId!),
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

export const useCreateServiceTypeField = (serviceTypeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, CreateServiceTypeFieldDto>({
    mutationFn: (dto) => serviceTypeService.createField(serviceTypeId!, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useUpdateServiceTypeField = (serviceTypeId?: number, fieldId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, UpdateServiceTypeFieldDto>({
    mutationFn: (dto) => serviceTypeService.updateField(serviceTypeId!, fieldId!, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useDeactivateServiceTypeField = (serviceTypeId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, number>({
    mutationFn: (fieldId) => serviceTypeService.deactivateField(serviceTypeId!, fieldId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};
