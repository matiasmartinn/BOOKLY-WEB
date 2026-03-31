import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { PATHS } from 'app/router';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthCard } from 'shared/ui/components';
import { useResetPassword } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';
import { resetPasswordSchema, type ResetPasswordValues } from './reset-password.schema';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPassword = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordValues> = async ({ password }) => {
    clearErrors('root');

    if (!token) {
      setError('root', { message: 'El enlace no contiene un token valido.' });
      return;
    }

    try {
      await resetPassword.mutateAsync({ token, password });
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos restablecer la contrasena. Intenta nuevamente.',
        ),
      });
    }
  };

  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap={4} align="center">
          <Title order={3}>Restablecer contrasena</Title>
          <Text size="sm" c="dimmed" ta="center">
            Define una nueva contrasena para recuperar el acceso a tu cuenta.
          </Text>
        </Stack>

        {!token && (
          <Text size="sm" c="red" ta="center">
            El enlace no es valido o no incluye el token requerido.
          </Text>
        )}

        {resetPassword.isSuccess ? (
          <Stack gap="xs" align="center">
            <Text size="sm" c="green" ta="center">
              La contrasena se actualizo correctamente.
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Ya puedes volver a{' '}
              <Anchor c="brand" component={Link} to={PATHS.auth.login}>
                iniciar sesion
              </Anchor>
              .
            </Text>
          </Stack>
        ) : (
          <>
            <PasswordInput
              label="Nueva contrasena"
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

            <Stack gap="xs" align="center">
              <Button type="submit" loading={resetPassword.isPending} disabled={!token}>
                Guardar contrasena
              </Button>
              <Text size="sm" c="dimmed" ta="center">
                Necesitas otro enlace?{' '}
                <Anchor c="brand" component={Link} to={PATHS.auth.forgotPassword}>
                  Solicitalo nuevamente
                </Anchor>
              </Text>
            </Stack>
          </>
        )}
      </Stack>
    </AuthCard>
  );
}
