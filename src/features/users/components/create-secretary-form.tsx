import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Stack, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useCreateSecretary } from '../hooks';
import { createSecretarySchema, type CreateSecretaryFormValues } from '../schema';

interface CreateSecretaryFormProps {
  ownerId: number;
  serviceId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const defaultValues: CreateSecretaryFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export function CreateSecretaryForm({
  ownerId,
  serviceId,
  onCancel,
  onSuccess,
}: CreateSecretaryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSecretaryFormValues>({
    resolver: zodResolver(createSecretarySchema),
    mode: 'onTouched',
    defaultValues,
  });

  const { mutate, isPending, error, isError } = useCreateSecretary(ownerId);

  const onSubmit: SubmitHandler<CreateSecretaryFormValues> = (values) => {
    mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        serviceId,
      },
      {
        onSuccess,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        {isError && error && (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo crear el secretario/a.'}
          </Alert>
        )}

        <TextInput
          label="Nombre"
          placeholder="Nombre"
          withAsterisk
          {...register('firstName')}
          error={errors.firstName?.message}
          disabled={isPending}
        />

        <TextInput
          label="Apellido"
          placeholder="Apellido"
          withAsterisk
          {...register('lastName')}
          error={errors.lastName?.message}
          disabled={isPending}
        />

        <TextInput
          label="Email"
          placeholder="secretaria@correo.com"
          withAsterisk
          {...register('email')}
          error={errors.email?.message}
          disabled={isPending}
        />

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="submit" loading={isPending}>
            Crear secretario/a
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
