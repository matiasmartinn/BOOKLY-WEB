import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { ServiceTypeDto } from 'shared/models';
import {
  serviceTypeService,
  type AddServiceTypeFieldDto,
  type AddServiceTypeFieldOptionDto,
  type CreateServiceTypeDto,
  type UpdateServiceTypeDto,
  type UpdateServiceTypeFieldDto,
  type UpdateServiceTypeFieldOptionDto,
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

export const useServiceTypeWithFields = (serviceTypeId?: number) =>
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

export const useAddServiceTypeField = (serviceTypeId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, AddServiceTypeFieldDto>({
    mutationFn: (dto) => serviceTypeService.addField(serviceTypeId, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useUpdateServiceTypeField = (serviceTypeId: number, fieldId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, UpdateServiceTypeFieldDto>({
    mutationFn: (dto) => serviceTypeService.updateField(serviceTypeId, fieldId, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useActivateServiceTypeField = (serviceTypeId: number, fieldId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.activateField(serviceTypeId, fieldId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useDeactivateServiceTypeField = (serviceTypeId: number, fieldId: number) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.deactivateField(serviceTypeId, fieldId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useAddServiceTypeFieldOption = (serviceTypeId: number, fieldId: number) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, AddServiceTypeFieldOptionDto>({
    mutationFn: (dto) => serviceTypeService.addOption(serviceTypeId, fieldId, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useUpdateServiceTypeFieldOption = (
  serviceTypeId: number,
  fieldId: number,
  optionId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation<ServiceTypeDto, ProblemDetails, UpdateServiceTypeFieldOptionDto>({
    mutationFn: (dto) => serviceTypeService.updateOption(serviceTypeId, fieldId, optionId, dto),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useRemoveServiceTypeFieldOption = (
  serviceTypeId: number,
  fieldId: number,
  optionId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.removeOption(serviceTypeId, fieldId, optionId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useActivateServiceTypeFieldOption = (
  serviceTypeId: number,
  fieldId: number,
  optionId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.activateOption(serviceTypeId, fieldId, optionId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};

export const useDeactivateServiceTypeFieldOption = (
  serviceTypeId: number,
  fieldId: number,
  optionId: number,
) => {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetails, void>({
    mutationFn: () => serviceTypeService.deactivateOption(serviceTypeId, fieldId, optionId),
    onSuccess: () => invalidateServiceTypeQueries(queryClient, serviceTypeId),
  });
};
