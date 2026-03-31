import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { PATHS } from 'app/router';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthCard } from 'shared/ui/components';
import { useCompleteSecretaryInvitation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';
import {
  secretaryOnboardingSchema,
  type SecretaryOnboardingValues,
} from './secretary-onboarding.schema';

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
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap={4} align="center">
          <Title order={3}>Crear contrasena</Title>
          <Text size="sm" c="dimmed" ta="center">
            Define tu contrasena inicial para activar la cuenta e ingresar a BOOKLY.
          </Text>
        </Stack>

        {!token && (
          <Text size="sm" c="red" ta="center">
            El enlace no es valido o no incluye el token requerido.
          </Text>
        )}

        {completeInvitation.isSuccess ? (
          <Stack gap="xs" align="center">
            <Text size="sm" c="green" ta="center">
              La cuenta se activo correctamente. Ya puedes iniciar sesion.
            </Text>
            <Anchor c="brand" component={Link} to={PATHS.auth.login}>
              Ir al login
            </Anchor>
          </Stack>
        ) : (
          <>
            <PasswordInput
              label="Contrasena"
              placeholder="********"
              withAsterisk
              disabled={!token}
              {...register('password')}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirmar contrasena"
              placeholder="********"
              withAsterisk
              disabled={!token}
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            {errors.root && (
              <Text size="sm" c="red" ta="center">
                {errors.root.message}
              </Text>
            )}

            <Button type="submit" loading={completeInvitation.isPending} disabled={!token}>
              Activar cuenta
            </Button>
          </>
        )}
      </Stack>
    </AuthCard>
  );
}
