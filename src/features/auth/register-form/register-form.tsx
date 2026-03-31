import { Title, Text, TextInput, PasswordInput, Button, Stack, Anchor } from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError } from 'app/api';
import { PATHS } from 'app/router';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthCard } from 'shared/ui/components';
import { useRegister } from '../auth.hooks';
import { registerUserSchema, type RegisterUserRequst } from './register-user.schema';

function getRegisterErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 0) {
      return 'No pudimos conectar con el servidor. Verifica tu conexion e intenta nuevamente.';
    }

    return error.detail || 'No pudimos completar el registro en este momento. Intenta nuevamente.';
  }

  return 'No pudimos completar el registro en este momento. Intenta nuevamente.';
}

export function RegisterForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterUserRequst>({
    resolver: zodResolver(registerUserSchema),
  });

  const { mutateAsync, isPending } = useRegister();

  const onSubmit: SubmitHandler<RegisterUserRequst> = async ({ confirmPassword, ...dto }) => {
    clearErrors('root');
    setSuccessMessage(null);

    try {
      await mutateAsync(dto);
      setSuccessMessage(
        'La cuenta se creo correctamente. Revisa tu email para confirmar el acceso antes de iniciar sesion.',
      );
    } catch (error) {
      setError('root', { message: getRegisterErrorMessage(error) });
    }
  };

  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap={3} align="center">
          <Title order={3}>Crear usuario</Title>
          <Text>Completa los datos para poder crear su cuenta.</Text>
        </Stack>
        <TextInput
          label="Nombre"
          placeholder="Juan"
          withAsterisk
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <TextInput
          label="Apellido"
          placeholder="Perez"
          withAsterisk
          {...register('lastName')}
          error={errors.lastName?.message}
        />

        <TextInput
          label="Email"
          placeholder="usuario@correo.com"
          withAsterisk
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Contrasena"
          placeholder="********"
          withAsterisk
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirme contrasena"
          placeholder="********"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {successMessage && (
          <Text size="sm" c="green" ta="center">
            {successMessage}
          </Text>
        )}

        {errors.root && (
          <Text size="sm" c="red" ta="center">
            {errors.root.message}
          </Text>
        )}

        <Stack gap="xs" align="center">
          <Button type="submit" loading={isPending}>
            Crear cuenta
          </Button>
          <Text size="sm" c="dimmed" ta="center">
            Ya tenes una cuenta?{' '}
            <Anchor c="brand" component={Link} to={PATHS.auth.login}>
              Ingresa
            </Anchor>
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            Necesitas otro email de confirmacion?{' '}
            <Anchor c="brand" component={Link} to={PATHS.auth.confirmEmail}>
              Reenviarlo
            </Anchor>
          </Text>
        </Stack>
      </Stack>
    </AuthCard>
  );
}
