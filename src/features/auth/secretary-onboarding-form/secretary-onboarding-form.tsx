import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Anchor, Button, PasswordInput, Stack, Text } from '@mantine/core';
import { PATHS } from 'app/router';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useCompleteSecretaryInvitation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';
import {
  secretaryOnboardingSchema,
  type SecretaryOnboardingValues,
} from './secretary-onboarding.schema';
import { AuthFormWrapper } from 'features/auth/components';

export function SecretaryOnboardingForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SecretaryOnboardingValues>({
    resolver: zodResolver(secretaryOnboardingSchema),
  });

  const completeInvitation = useCompleteSecretaryInvitation();

  const onSubmit: SubmitHandler<SecretaryOnboardingValues> = async ({ password }) => {
    clearErrors('root');

    if (!token) {
      setError('root', { message: 'El enlace no contiene un token valido.' });
      return;
    }

    try {
      await completeInvitation.mutateAsync({ token, password });
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos completar la invitacion. Intenta nuevamente.',
        ),
      });
    }
  };

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Activa tu acceso">
      <Stack gap="xl">
        {!token ? (
          <Alert color="red" variant="light">
            El enlace no es valido o no incluye el token requerido.
          </Alert>
        ) : null}

        {completeInvitation.isSuccess ? (
          <Stack gap="sm">
            <Alert color="green" variant="light">
              La cuenta se activo correctamente. Ya puedes iniciar sesion.
            </Alert>

            <Text size="sm" c="dimmed">
              Continua desde{' '}
              <Anchor c="gray.7" component={Link} to={PATHS.auth.login}>
                el login
              </Anchor>
              .
            </Text>
          </Stack>
        ) : (
          <>
            <PasswordInput
              label="Contrasena"
              placeholder="********"
              withAsterisk
              disabled={!token}
              autoComplete="new-password"
              {...register('password')}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirmar contrasena"
              placeholder="********"
              withAsterisk
              disabled={!token}
              autoComplete="new-password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            {errors.root ? (
              <Alert color="red" variant="light">
                {errors.root.message}
              </Alert>
            ) : null}

            <Button type="submit" loading={completeInvitation.isPending} disabled={!token} fullWidth>
              Activar cuenta
            </Button>
          </>
        )}
      </Stack>
    </AuthFormWrapper>
  );
}
