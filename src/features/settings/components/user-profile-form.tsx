import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { isApiError } from 'app/api';
import { useUpdateUser, useUser } from 'features/users/hooks';
import { useEffect, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';

import { accountUserSchema, type AccountUserFormValues } from '../schema';

const defaultValues: AccountUserFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export function UserProfileForm() {
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const toast = useAppToast();

  const { data, isLoading } = useUser(authUser?.id);
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
        lastName: currentUser.lastName,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<AccountUserFormValues> = (values) => {
    if (!currentUser) {
      return;
    }

    mutate(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: currentUser.email,
      },
      {
        onSuccess: (updatedUser) => {
          setAuthUser(updatedUser);
          toast.success('Los datos de la cuenta se actualizaron correctamente.');
          reset({
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
          });
        },
      },
    );
  };

  if (!authUser) {
    return (
      <Alert color="warning" variant="light">
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
      <Stack gap="md" w="100%">
        <Stack gap={4}>
          <Text fw={600}>Informacion del usuario</Text>
        </Stack>

        {isSubmitError && submitError && (
          <Alert color="error" variant="light">
            {isApiError(submitError)
              ? submitError.detail
              : 'No se pudieron guardar los datos de la cuenta.'}
          </Alert>
        )}

        <Grid gutter="md">
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              withAsterisk
              {...register('firstName')}
              error={errors.firstName?.message}
              disabled={!currentUser || isPending}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Apellido"
              placeholder="Tu apellido"
              withAsterisk
              {...register('lastName')}
              error={errors.lastName?.message}
              disabled={!currentUser || isPending}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 7 }}>
            <input type="hidden" {...register('email')} />

            <Stack gap={6}>
              <Text size="sm" fw={500}>
                Email
              </Text>

              <Box
                px="sm"
                py={9}
                style={{
                  borderRadius: 'var(--mantine-radius-md)',
                  border: '1px solid var(--app-color-border)',
                  backgroundColor: 'var(--app-color-surface-soft)',
                }}
              >
                <Group justify="space-between" gap="sm" wrap="nowrap">
                  <Text
                    size="sm"
                    style={{
                      color: 'var(--app-color-text-primary)',
                      overflowWrap: 'anywhere',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {currentUser?.email}
                  </Text>

                  <Badge color="gray" variant="light" radius="sm">
                    Cuenta
                  </Badge>
                </Group>
              </Box>

              {errors.email?.message ? (
                <Text size="xs" c="red">
                  {errors.email.message}
                </Text>
              ) : null}
            </Stack>
          </Grid.Col>
        </Grid>

        <Group justify="flex-end">
          <Button type="submit" loading={isPending} disabled={!currentUser}>
            Guardar cambios
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
