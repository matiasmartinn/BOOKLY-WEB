import { Stack, Title, Text, TextInput, PasswordInput, Button, Anchor } from '@mantine/core';
import { PATHS } from 'app/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from 'shared/ui/components';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginRequest } from './login.schema';
import { useState } from 'react';
import { useAuthStore } from 'store/use-auth-store';

export function LoginForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    setIsPending(true);
    try {
      // login() → autentica, setea user, loadServices() → fetchea lista
      // y pre-selecciona el primer servicio con su detalle completo.
      // Cuando navigate() corre, el store ya tiene todo listo.
      await login(data);
      navigate(PATHS.dashboard.overview);
    } catch {
      setError('root', { message: 'Credenciales incorrectas. Revisá tu email y contraseña.' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md" align="stretch">
        <Stack gap={4} align="center">
          <Title order={3}>Iniciar Sesión</Title>
          <Text size="sm" c="dimmed">
            Ingrese las credenciales de su cuenta.
          </Text>
        </Stack>

        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="Ingrese su Email..."
            {...register('email')}
            error={errors.email?.message}
          />

          <Stack gap="xs">
            <PasswordInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              {...register('password')}
              error={errors.password?.message}
            />
            <Text size="sm" c="dimmed">
              ¿Olvidaste tu contraseña?{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.forgotPassword}>
                Recuperala
              </Anchor>
            </Text>
          </Stack>

          {errors.root && (
            <Text size="sm" c="red" ta="center">
              {errors.root.message}
            </Text>
          )}

          <Stack gap="xs" align="center">
            <Button type="submit" loading={isPending}>
              Ingresar
            </Button>
            <Text size="sm" c="dimmed" ta="center">
              ¿No tenes cuenta?{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.register}>
                Registrate
              </Anchor>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </AuthCard>
  );
}
