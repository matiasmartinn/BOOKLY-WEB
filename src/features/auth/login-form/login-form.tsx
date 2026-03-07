import { Stack, Title, Text, TextInput, PasswordInput, Button, Anchor } from '@mantine/core';
import { PATHS } from 'app/router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AuthCard } from 'shared/ui/components';
import { loginSchema, type LoginRequest } from './login-form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../auth.hooks';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate } = useLogin();

  const onSubmit: SubmitHandler<LoginRequest> = (data: LoginRequest) => {
    mutate(data);
  };
  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md" align="strech">
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
                {' '}
                Recuperala
              </Anchor>
            </Text>
          </Stack>

          <Stack gap="xs" align="center">
            <Button type="submit">Ingresar</Button>
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
