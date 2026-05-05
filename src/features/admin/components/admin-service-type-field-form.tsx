import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Checkbox, Group, Select, Stack, TextInput } from '@mantine/core';
import type { UseMutationResult } from '@tanstack/react-query';
import { isApiError, type ProblemDetails } from 'app/api';
import type {
  CreateServiceTypeFieldDto,
  UpdateServiceTypeFieldDto,
} from 'features/service-types/services';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import type {
  ServiceTypeDto,
  ServiceTypeFieldDefinitionDto,
} from 'shared/models';

import {
  createServiceTypeFieldFormSchema,
  type ServiceTypeFieldFormValues,
} from '../schema/service-type-field-form.schema';
import {
  ADMIN_SERVICE_TYPE_FIELD_TYPE_OPTIONS,
  getServiceTypeFieldTypeLabel,
} from '../utils';

interface AdminServiceTypeFieldFormProps {
  mode: 'create' | 'edit';
  field: ServiceTypeFieldDefinitionDto | null;
  existingFields: ServiceTypeFieldDefinitionDto[];
  createMutation: UseMutationResult<ServiceTypeDto, ProblemDetails, CreateServiceTypeFieldDto>;
  updateMutation: UseMutationResult<ServiceTypeDto, ProblemDetails, UpdateServiceTypeFieldDto>;
  onCancel: () => void;
  onSuccess: () => void;
}

const defaultValues: ServiceTypeFieldFormValues = {
  label: '',
  key: '',
  fieldType: '1' as ServiceTypeFieldFormValues['fieldType'],
  isRequired: false,
};

const mapFieldToFormValues = (
  field: ServiceTypeFieldDefinitionDto | null,
): ServiceTypeFieldFormValues => ({
  label: field?.label ?? '',
  key: field?.key ?? '',
  fieldType: field
    ? (String(field.fieldType) as ServiceTypeFieldFormValues['fieldType'])
    : ('1' as ServiceTypeFieldFormValues['fieldType']),
  isRequired: field?.isRequired ?? false,
});

export function AdminServiceTypeFieldForm({
  mode,
  field,
  existingFields,
  createMutation,
  updateMutation,
  onCancel,
  onSuccess,
}: AdminServiceTypeFieldFormProps) {
  const schema = useMemo(
    () => createServiceTypeFieldFormSchema({ existingFields, mode }),
    [existingFields, mode],
  );

  const fieldTypeOptions = useMemo(() => {
    const currentFieldType = field ? String(field.fieldType) : null;
    const options = [...ADMIN_SERVICE_TYPE_FIELD_TYPE_OPTIONS];

    if (
      field &&
      currentFieldType &&
      !options.some((option) => option.value === currentFieldType)
    ) {
      options.push({
        value: currentFieldType,
        label: getServiceTypeFieldTypeLabel(field.fieldType),
      });
    }

    return options;
  }, [field]);

  const nextSortOrder = useMemo(
    () => existingFields.reduce((max, current) => Math.max(max, current.sortOrder), -1) + 1,
    [existingFields],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceTypeFieldFormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues,
  });

  useEffect(() => {
    reset(mapFieldToFormValues(field));
  }, [field, reset]);

  const activeMutation = mode === 'create' ? createMutation : updateMutation;

  const onSubmit: SubmitHandler<ServiceTypeFieldFormValues> = async (values) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync({
          label: values.label.trim(),
          key: values.key.trim().toLowerCase(),
          fieldType: Number(values.fieldType),
          isRequired: values.isRequired,
          sortOrder: nextSortOrder,
        });
      } else {
        await updateMutation.mutateAsync({
          label: values.label.trim(),
          isRequired: values.isRequired,
        });
      }

      onSuccess();
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
              : `No se pudo ${mode === 'create' ? 'crear' : 'actualizar'} el campo.`}
          </Alert>
        ) : null}

        <TextInput
          label="Label"
          placeholder="Ej: Obra social"
          withAsterisk
          {...register('label')}
          error={errors.label?.message}
          disabled={activeMutation.isPending}
        />

        <TextInput
          label="Key"
          placeholder="Ej: obra_social"
          withAsterisk
          description={
            mode === 'edit'
              ? 'La key se conserva para mantener consistencia con el resto del sistema.'
              : undefined
          }
          {...register('key')}
          error={errors.key?.message}
          disabled={activeMutation.isPending || mode === 'edit'}
        />

        <Controller
          name="fieldType"
          control={control}
          render={({ field: controllerField }) => (
            <Select
              label="Tipo"
              withAsterisk
              data={fieldTypeOptions}
              value={controllerField.value}
              onChange={(value) => controllerField.onChange(value ?? '')}
              error={errors.fieldType?.message}
              disabled={activeMutation.isPending || mode === 'edit'}
              allowDeselect={false}
              description={
                mode === 'edit'
                  ? 'El tipo no se edita desde esta pantalla para evitar cambios de contrato.'
                  : undefined
              }
            />
          )}
        />

        <Controller
          name="isRequired"
          control={control}
          render={({ field: controllerField }) => (
            <Checkbox
              label="Campo obligatorio"
              checked={controllerField.value}
              onChange={(event) => controllerField.onChange(event.currentTarget.checked)}
              disabled={activeMutation.isPending}
            />
          )}
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
            {mode === 'create' ? 'Crear campo' : 'Guardar cambios'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
