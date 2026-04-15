import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Stack, TextInput, Textarea } from '@mantine/core';
import type { UseMutationResult } from '@tanstack/react-query';
import { isApiError, type ProblemDetails } from 'app/api';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ServiceTypeDto } from 'shared/models';

import type {
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
} from 'features/service-types/services';

import {
  serviceTypeFormSchema,
  type ServiceTypeFormValues,
} from '../schema/service-type-form.schema';

interface AdminServiceTypeFormProps {
  mode: 'create' | 'edit';
  serviceType: ServiceTypeDto | null;
  createMutation: UseMutationResult<ServiceTypeDto, ProblemDetails, CreateServiceTypeDto>;
  updateMutation: UseMutationResult<ServiceTypeDto, ProblemDetails, UpdateServiceTypeDto>;
  onCancel: () => void;
  onSuccess: (serviceType: ServiceTypeDto) => void;
}

const defaultValues: ServiceTypeFormValues = {
  name: '',
  description: '',
};

const mapServiceTypeToFormValues = (serviceType: ServiceTypeDto | null): ServiceTypeFormValues => ({
  name: serviceType?.name ?? '',
  description: serviceType?.description ?? '',
});

export function AdminServiceTypeForm({
  mode,
  serviceType,
  createMutation,
  updateMutation,
  onCancel,
  onSuccess,
}: AdminServiceTypeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeFormSchema),
    mode: 'onTouched',
    defaultValues,
  });

  useEffect(() => {
    reset(mapServiceTypeToFormValues(serviceType));
  }, [reset, serviceType]);

  const activeMutation = mode === 'create' ? createMutation : updateMutation;

  const onSubmit: SubmitHandler<ServiceTypeFormValues> = async (values) => {
    try {
      const result =
        mode === 'create'
          ? await createMutation.mutateAsync({
              name: values.name.trim(),
              description: values.description?.trim() ?? '',
            })
          : await updateMutation.mutateAsync({
              name: values.name.trim(),
              description: values.description?.trim() ?? '',
            });

      onSuccess(result);
    } catch {
      // El error se muestra inline.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {activeMutation.isError && activeMutation.error ? (
          <Alert color="red" variant="light">
            {isApiError(activeMutation.error)
              ? activeMutation.error.detail
              : `No se pudo ${mode === 'create' ? 'crear' : 'actualizar'} el tipo de servicio.`}
          </Alert>
        ) : null}

        <TextInput
          label="Nombre"
          placeholder="Ej: Peluqueria"
          withAsterisk
          {...register('name')}
          error={errors.name?.message}
          disabled={activeMutation.isPending}
        />

        <Textarea
          label="Descripcion"
          placeholder="Describe brevemente este tipo de servicio"
          autosize
          minRows={3}
          maxRows={6}
          maxLength={500}
          {...register('description')}
          error={errors.description?.message}
          disabled={activeMutation.isPending}
        />

        <Group justify="flex-end">
          <Button
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={activeMutation.isPending}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={activeMutation.isPending}>
            {mode === 'create' ? 'Crear tipo de servicio' : 'Guardar cambios'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
