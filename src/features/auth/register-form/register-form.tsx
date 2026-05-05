import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { isApiError } from 'app/api';
import { PATHS } from 'app/router';
import { AuthFormWrapper } from 'features/auth/components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  const onSubmit: SubmitHandler<RegisterUserRequst> = async (values) => {
    const dto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    clearErrors('root');

    try {
      const response = await mutateAsync(dto);
      navigate(PATHS.auth.login, {
        state: {
          message: response.emailDispatch.message,
          emailSent: response.emailDispatch.emailSent,
        },
      });
    } catch (error) {
      setError('root', { message: getRegisterErrorMessage(error) });
    }
  };

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Crea tu cuenta">
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            label="Nombre"
            placeholder="Juan"
            withAsterisk
            autoComplete="given-name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />

          <TextInput
            label="Apellido"
            placeholder="Perez"
            withAsterisk
            autoComplete="family-name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </SimpleGrid>

        <TextInput
          label="Email"
          placeholder="usuario@correo.com"
          withAsterisk
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Contrasena"
          placeholder="********"
          withAsterisk
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />

        <PasswordInput
          label="Confirma contrasena"
          placeholder="********"
          withAsterisk
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        {errors.root ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        <Button type="submit" loading={isPending} fullWidth>
          Crear cuenta
        </Button>

        <Stack gap={6}>
          <Text size="sm" c="dimmed">
            Ya tenes una cuenta?{' '}
            <Anchor c="gray.7" component={Link} to={PATHS.auth.login}>
              Ingresa
            </Anchor>
          </Text>

          <Text size="sm" c="dimmed">
            Necesitas otro email de confirmacion?{' '}
            <Anchor c="gray.7" component={Link} to={PATHS.auth.confirmEmail}>
              Reenviarlo
            </Anchor>
          </Text>
        </Stack>
      </Stack>
    </AuthFormWrapper>
  );
}
