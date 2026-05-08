import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, PasswordInput, Stack } from '@mantine/core';
import { PATHS } from 'app/router';
import { AuthFormWrapper, AuthSuccessState } from 'features/auth/components';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useSearchParams } from 'react-router-dom';

import { useCompleteAdminInvitation, useCompleteSecretaryInvitation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';

import {
  secretaryOnboardingSchema,
  type SecretaryOnboardingValues,
} from './secretary-onboarding.schema';

export function SecretaryOnboardingForm() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const isAdminInvitation = pathname === PATHS.auth.adminInvitation;

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SecretaryOnboardingValues>({
    resolver: zodResolver(secretaryOnboardingSchema),
  });

  const completeSecretaryInvitation = useCompleteSecretaryInvitation();
  const completeAdminInvitation = useCompleteAdminInvitation();
  const completeInvitation = isAdminInvitation
    ? completeAdminInvitation
    : completeSecretaryInvitation;

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

  if (completeInvitation.isSuccess) {
    const roleLabel = isAdminInvitation ? 'administrador' : 'secretario';

    return (
      <AuthSuccessState
        description={`Tu invitacion de ${roleLabel} fue aceptada correctamente.`}
        noticeTitle="Cuenta activada."
        noticeText="Ya puedes iniciar sesion y continuar desde Bookly."
        loginMessage="Tu cuenta fue activada correctamente. Ya puedes iniciar sesion."
      />
    );
  }

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Activa tu acceso">
      <Stack gap="xl">
        {!token ? (
          <Alert color="red" variant="light">
            El enlace no es valido o no incluye el token requerido.
          </Alert>
        ) : null}

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
      </Stack>
    </AuthFormWrapper>
  );
}
