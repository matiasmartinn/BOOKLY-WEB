import {
  Alert,
  Anchor,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { isApiError } from 'app/api';
import { PATHS } from 'app/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginRequest } from './login.schema';
import { useState } from 'react';
import { useAuthStore } from 'store/use-auth-store';
import { AuthFormWrapper } from 'features/auth/components';

function getLoginErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.status === 0) {
      return 'No pudimos conectar con el servidor. Verifica tu conexion e intenta nuevamente.';
    }

    if (error.status === 401) {
      return 'Credenciales incorrectas. Revisa tu email y contrasena.';
    }

    return error.detail || 'No pudimos iniciar sesion en este momento. Intenta nuevamente.';
  }

  return 'No pudimos iniciar sesion en este momento. Intenta nuevamente.';
}

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isPending, setIsPending] = useState(false);

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    setIsPending(true);
    clearErrors('root');

    try {
      await login(data);
      navigate(PATHS.dashboard.overview);
    } catch (error) {
      setError('root', { message: getLoginErrorMessage(error) });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Inicia sesion">
      <Stack gap="xl">
        <TextInput
          label="Email"
          placeholder="usuario@correo.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <PasswordInput
          label="Contrasena"
          placeholder="Ingresa tu contrasena"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />

        {errors.root ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        <Button type="submit" loading={isPending} fullWidth>
          Ingresar
        </Button>

        <Stack gap={6}>
          <Text size="sm" c="dimmed">
            Olvidaste tu contrasena?{' '}
            <Anchor c="gray.7" component={Link} to={PATHS.auth.forgotPassword}>
              Recuperala
            </Anchor>
          </Text>

          <Text size="sm" c="dimmed">
            No tenes cuenta?{' '}
            <Anchor c="gray.7" component={Link} to={PATHS.auth.register}>
              Registrate
            </Anchor>
          </Text>
        </Stack>
      </Stack>
    </AuthFormWrapper>
  );
}
