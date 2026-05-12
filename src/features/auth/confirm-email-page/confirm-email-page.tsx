import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { PATHS } from 'app/router';
import { AuthFormWrapper, AuthSuccessState } from 'features/auth/components';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

import { useConfirmEmail, useResendConfirmation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';

import { resendConfirmationSchema, type ResendConfirmationValues } from './schema';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const [confirmationSucceeded, setConfirmationSucceeded] = useState(false);
  const [confirmationAttempted, setConfirmationAttempted] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{ message: string; color: string } | null>(
    null,
  );

  const confirmEmail = useConfirmEmail();
  const resendConfirmation = useResendConfirmation();

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ResendConfirmationValues>({
    resolver: zodResolver(resendConfirmationSchema),
  });

  useEffect(() => {
    if (!token || confirmationAttempted) {
      return;
    }

    setConfirmationAttempted(true);

    void (async () => {
      try {
        await confirmEmail.mutateAsync({ token });
        setConfirmationSucceeded(true);
      } catch {
        setConfirmationSucceeded(false);
      }
    })();
  }, [confirmationAttempted, confirmEmail, token]);

  const onResendSubmit: SubmitHandler<ResendConfirmationValues> = async ({ email }) => {
    clearErrors('root');
    setResendFeedback(null);

    try {
      const response = await resendConfirmation.mutateAsync({ email });
      reset();
      setResendFeedback({
        message: response.message,
        color: response.emailSent ? 'green' : 'orange',
      });
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos reenviar el email de confirmacion. Intenta nuevamente.',
        ),
      });
    }
  };

  const confirmationErrorMessage =
    token && confirmEmail.isError
      ? getAuthErrorMessage(
          confirmEmail.error,
          'No pudimos confirmar tu email. Solicita un nuevo enlace para intentarlo otra vez.',
        )
      : null;

  if (confirmationSucceeded) {
    return (
      <AuthSuccessState
        description="Tu direccion de correo electronico fue confirmada correctamente."
        noticeTitle="Tu cuenta ya esta activa."
        noticeText="Ahora puedes iniciar sesion y comenzar a usar Bookly."
        loginMessage="Tu email fue confirmado correctamente. Ya puedes iniciar sesion."
      />
    );
  }

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onResendSubmit)} title="Confirma tu email">
      <Stack gap="xl">
        {token && (!confirmationAttempted || confirmEmail.isPending) ? (
          <Alert color="brand" variant="light">
            Estamos validando tu enlace de confirmacion...
          </Alert>
        ) : (
          <>
            {token && confirmationAttempted && !confirmEmail.isPending ? (
              <Alert color="red" variant="light">
                {confirmationErrorMessage}
              </Alert>
            ) : null}

            <TextInput
              label="Email"
              placeholder="usuario@correo.com"
              withAsterisk
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />

            {errors.root ? (
              <Alert color="red" variant="light">
                {errors.root.message}
              </Alert>
            ) : null}

            {resendFeedback ? (
              <Alert color={resendFeedback.color === 'green' ? 'green' : 'orange'} variant="light">
                {resendFeedback.message}
              </Alert>
            ) : null}

            <Button type="submit" loading={resendConfirmation.isPending} fullWidth>
              Reenviar confirmacion
            </Button>

            <Text size="sm" c="dimmed">
              Volver a{' '}
              <Anchor c="gray.7" component={Link} to={PATHS.auth.login}>
                iniciar sesion
              </Anchor>
            </Text>
          </>
        )}
      </Stack>
    </AuthFormWrapper>
  );
}
