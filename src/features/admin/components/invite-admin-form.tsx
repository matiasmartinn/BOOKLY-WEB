import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { createSecretarySchema, type CreateSecretaryFormValues } from 'features/users/schema';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UserEmailDispatchResultDto } from 'shared/models';

import { useInviteAdmin } from '../hooks';

interface InviteAdminFormProps {
  onCancel: () => void;
  onSuccess: (result: UserEmailDispatchResultDto) => void;
}

const defaultValues: CreateSecretaryFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export function InviteAdminForm({ onCancel, onSuccess }: InviteAdminFormProps) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSecretaryFormValues>({
    resolver: zodResolver(createSecretarySchema),
    mode: 'onTouched',
    defaultValues,
  });

  const { mutate, isPending, error, isError } = useInviteAdmin();

  const onSubmit: SubmitHandler<CreateSecretaryFormValues> = (values) => {
    mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
      },
      {
        onSuccess: (result) => {
          reset(defaultValues);
          onSuccess(result);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg">
        <Stack gap={4}>
          <Text fw={600}>Invitacion administrativa</Text>
          <Text size="sm" c="dimmed">
            El nuevo admin recibira un email para completar el acceso a la consola.
          </Text>
        </Stack>

        {isError && error ? (
          <Alert color="red" variant="light">
            {isApiError(error) ? error.detail : 'No se pudo invitar al admin.'}
          </Alert>
        ) : null}

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
          placeholder="admin@correo.com"
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
            Invitar admin
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
