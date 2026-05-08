import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Anchor, Button, PasswordInput, Stack, Text } from '@mantine/core';
import { PATHS } from 'app/router';
import { AuthFormWrapper, AuthSuccessState } from 'features/auth/components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

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

  if (resetPassword.isSuccess) {
    return (
      <AuthSuccessState
        description="Tu contrasena fue actualizada correctamente."
        noticeTitle="Acceso recuperado."
        noticeText="Ya puedes iniciar sesion con tu nueva contrasena."
        loginMessage="Tu contrasena fue actualizada correctamente. Ya puedes iniciar sesion."
      />
    );
  }

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Define una nueva contrasena">
      <Stack gap="xl">
        {!token ? (
          <Alert color="red" variant="light">
            El enlace no es valido o no incluye el token requerido.
          </Alert>
        ) : null}

        <PasswordInput
          label="Nueva contrasena"
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

        <Button type="submit" loading={resetPassword.isPending} disabled={!token} fullWidth>
          Guardar contrasena
        </Button>

        <Text size="sm" c="dimmed">
          Necesitas otro enlace?{' '}
          <Anchor c="gray.7" component={Link} to={PATHS.auth.forgotPassword}>
            Solicitalo nuevamente
          </Anchor>
        </Text>
      </Stack>
    </AuthFormWrapper>
  );
}
