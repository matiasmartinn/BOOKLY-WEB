import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Loader, Stack, Text, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { formatLocalDateTime } from 'shared/utils';

import { useUpdateUser, useUser } from '../hooks';
import { updateUserProfileSchema, type UpdateUserProfileFormValues } from '../schema';

interface EditSecretaryProfileFormProps {
  secretaryId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const defaultValues: UpdateUserProfileFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export function EditSecretaryProfileForm({
  secretaryId,
  onCancel,
  onSuccess,
}: EditSecretaryProfileFormProps) {
  const { data, isLoading, isError: isLoadError, error: loadError } = useUser(secretaryId);
  const { mutate, isPending, isError: isSubmitError, error: submitError } = useUpdateUser(
    secretaryId,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserProfileFormValues>({
    resolver: zodResolver(updateUserProfileSchema),
    mode: 'onTouched',
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<UpdateUserProfileFormValues> = (values) => {
    mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
      },
      {
        onSuccess,
      },
    );
  };

  if (isLoading) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
      </Group>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600}>Perfil del secretario/a</Text>
          <Text size="sm" c="dimmed">
            Edita unicamente datos personales respaldados por el contrato actual de usuarios.
          </Text>
        </Stack>

        {isLoadError && loadError && (
          <Alert color="red" variant="light">
            {isApiError(loadError) ? loadError.detail : 'No se pudo cargar el perfil.'}
          </Alert>
        )}

        {isSubmitError && submitError && (
          <Alert color="red" variant="light">
            {isApiError(submitError) ? submitError.detail : 'No se pudo guardar el perfil.'}
          </Alert>
        )}

        <TextInput
          label="Nombre"
          placeholder="Nombre"
          withAsterisk
          {...register('firstName')}
          error={errors.firstName?.message}
          disabled={isPending || isLoadError}
        />

        <TextInput
          label="Apellido"
          placeholder="Apellido"
          withAsterisk
          {...register('lastName')}
          error={errors.lastName?.message}
          disabled={isPending || isLoadError}
        />

        <TextInput
          label="Email"
          placeholder="secretaria@correo.com"
          withAsterisk
          {...register('email')}
          error={errors.email?.message}
          disabled={isPending || isLoadError}
        />

        {data?.createdAt && (
          <Text size="xs" c="dimmed">
            Alta registrada: {formatLocalDateTime(data.createdAt)}
          </Text>
        )}

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={isPending} disabled={isLoadError}>
            Guardar perfil
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
