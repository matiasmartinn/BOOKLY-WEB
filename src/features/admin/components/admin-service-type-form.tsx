import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, ColorInput, Group, Select, Stack, TextInput, Textarea } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { UseMutationResult } from '@tanstack/react-query';
import { isApiError, type ProblemDetails } from 'app/api';
import type {
  CreateServiceTypeDto,
  UpdateServiceTypeDto,
} from 'features/service-types/services';
import { useEffect } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import type { ServiceTypeDto } from 'shared/models';
import {
  getServiceTypeColor,
  getServiceTypeIcon,
  isServiceTypeIconKey,
  SERVICE_TYPE_COLOR_SWATCHES,
  SERVICE_TYPE_DEFAULT_COLOR_HEX,
  SERVICE_TYPE_ICON_OPTIONS,
} from 'shared/utils';

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
  colorHex: SERVICE_TYPE_DEFAULT_COLOR_HEX,
  iconKey: null,
};

const mapServiceTypeToFormValues = (serviceType: ServiceTypeDto | null): ServiceTypeFormValues => {
  const iconKey = serviceType?.iconKey;

  return {
    name: serviceType?.name ?? '',
    description: serviceType?.description ?? '',
    colorHex: getServiceTypeColor(serviceType?.colorHex),
    iconKey: isServiceTypeIconKey(iconKey) ? iconKey : null,
  };
};

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
    control,
    handleSubmit,
    reset,
    watch,
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
  const selectedIcon = getServiceTypeIcon(watch('iconKey'));

  const onSubmit: SubmitHandler<ServiceTypeFormValues> = async (values) => {
    const colorHex = values.colorHex.trim().toUpperCase();
    const iconKey = values.iconKey ?? null;

    try {
      const result =
        mode === 'create'
          ? await createMutation.mutateAsync({
              name: values.name.trim(),
              description: values.description?.trim() ?? '',
              colorHex,
              iconKey,
            })
          : await updateMutation.mutateAsync({
              name: values.name.trim(),
              description: values.description?.trim() ?? '',
              colorHex,
              iconKey: iconKey ?? '',
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

        <Group grow align="flex-start">
          <Controller
            name="colorHex"
            control={control}
            render={({ field }) => (
              <ColorInput
                label="Color"
                withAsterisk
                format="hex"
                swatches={SERVICE_TYPE_COLOR_SWATCHES}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.colorHex?.message}
                disabled={activeMutation.isPending}
              />
            )}
          />

          <Controller
            name="iconKey"
            control={control}
            render={({ field }) => (
              <Select
                label="Icono"
                placeholder="Seleccionar"
                data={SERVICE_TYPE_ICON_OPTIONS}
                clearable
                leftSection={<FontAwesomeIcon icon={selectedIcon} size="sm" />}
                value={field.value ?? null}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                error={errors.iconKey?.message}
                disabled={activeMutation.isPending}
              />
            )}
          />
        </Group>

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
