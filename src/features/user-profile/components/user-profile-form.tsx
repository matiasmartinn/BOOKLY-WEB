import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Group, Loader, Stack, Text, TextInput } from '@mantine/core';
import { isApiError } from 'app/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useUpdateUser, useUser } from 'features/users/hooks';
import {
  updateUserProfileSchema,
  type UpdateUserProfileFormValues,
} from 'features/users/schema';
import { useAuthStore } from 'store/use-auth-store';

const accountUserSchema = updateUserProfileSchema.pick({
  firstName: true,
  email: true,
});

type AccountUserFormValues = Pick<UpdateUserProfileFormValues, 'firstName' | 'email'>;

const defaultValues: AccountUserFormValues = {
  firstName: '',
  email: '',
};

export function UserProfileForm() {
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, isLoading, isError: isLoadError, error: loadError } = useUser(authUser?.id);
  const currentUser = useMemo(() => data ?? authUser, [authUser, data]);
  const {
    mutate,
    isPending,
    isError: isSubmitError,
    error: submitError,
  } = useUpdateUser(authUser?.id ?? 0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountUserFormValues>({
    resolver: zodResolver(accountUserSchema),
    mode: 'onTouched',
    defaultValues,
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<AccountUserFormValues> = (values) => {
    if (!currentUser) {
      return;
    }

    setSuccessMessage(null);

    mutate(
      {
        firstName: values.firstName.trim(),
        lastName: currentUser.lastName,
        email: currentUser.email,
      },
      {
        onSuccess: (updatedUser) => {
          setAuthUser(updatedUser);
          setSuccessMessage('Los datos de la cuenta se actualizaron correctamente.');
          reset({
            firstName: updatedUser.firstName,
            email: updatedUser.email,
          });
        },
      },
    );
  };

  if (!authUser) {
    return (
      <Alert color="yellow" variant="light">
        No se pudo resolver la cuenta autenticada.
      </Alert>
    );
  }

  if (isLoading && !currentUser) {
    return (
      <Group justify="center" py="md">
        <Loader size="sm" />
      </Group>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="lg" w="100%" maw={460}>
        <Stack gap={4}>
          <Text fw={600}>Información del usuario</Text>
          <Text size="sm" c="dimmed">
            Actualiza tus datos básicos.
          </Text>
        </Stack>

        {isLoadError && loadError && (
          <Alert color="yellow" variant="light">
            {isApiError(loadError)
              ? loadError.detail
              : 'No se pudo refrescar el perfil. Usaremos los datos locales disponibles.'}
          </Alert>
        )}

        {successMessage && (
          <Alert color="green" variant="light">
            {successMessage}
          </Alert>
        )}

        {isSubmitError && submitError && (
          <Alert color="red" variant="light">
            {isApiError(submitError)
              ? submitError.detail
              : 'No se pudieron guardar los datos de la cuenta.'}
          </Alert>
        )}

        <TextInput
          label="Nombre"
          placeholder="Tu nombre"
          withAsterisk
          {...register('firstName')}
          error={errors.firstName?.message}
          disabled={!currentUser || isPending}
        />

        <TextInput
          label="Email"
          readOnly
          {...register('email')}
          error={errors.email?.message}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-gray-0)',
            },
          }}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isPending} disabled={!currentUser}>
            Guardar cambios
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
