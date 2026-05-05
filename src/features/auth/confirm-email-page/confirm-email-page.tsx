import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { PATHS } from 'app/router';
import { AuthFormWrapper } from 'features/auth/components';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useConfirmEmail, useResendConfirmation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';

import { resendConfirmationSchema, type ResendConfirmationValues } from './schema';

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!confirmationSucceeded) {
      return;
    }

    const timer = window.setTimeout(() => {
      navigate(PATHS.auth.login, {
        replace: true,
        state: {
          message: 'Tu email fue confirmado correctamente. Ya puedes iniciar sesion.',
          emailSent: true,
        },
      });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [confirmationSucceeded, navigate]);

  return (
    <AuthFormWrapper onSubmit={handleSubmit(onResendSubmit)} title="Confirma tu email" className="">
      <Stack gap="xl">
        {confirmationSucceeded ? (
          <Stack>
            <Text
              component="div"
              fw={700}
              size="xl"
              ta="center"
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#e6f4ea',
                color: '#2f9e44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 30,
              }}
            >
              ✓
            </Text>

            <Stack gap={4}>
              <Text fw={700} size="lg">
                Email confirmado correctamente
              </Text>

              <Text size="sm" c="dimmed">
                Ya puedes iniciar sesion. Te redirigiremos automaticamente.
              </Text>
            </Stack>

            <Button
              mt="sm"
              w="70%"
              onClick={() =>
                navigate(PATHS.auth.login, {
                  replace: true,
                  state: {
                    message: 'Tu email fue confirmado correctamente. Ya puedes iniciar sesion.',
                    emailSent: true,
                  },
                })
              }
            >
              Ir al login
            </Button>
          </Stack>
        ) : token && (!confirmationAttempted || confirmEmail.isPending) ? (
          <Alert color="blue" variant="light">
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
