import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { PATHS } from 'app/router';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { AuthCard } from 'shared/ui/components';
import { useConfirmEmail, useResendConfirmation } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';

const resendConfirmationSchema = z.object({
  email: z.string().trim().email('Ingresa un email valido.'),
});

type ResendConfirmationValues = z.infer<typeof resendConfirmationSchema>;

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const [confirmationSucceeded, setConfirmationSucceeded] = useState(false);
  const [confirmationAttempted, setConfirmationAttempted] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

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
    setResendMessage(null);

    try {
      await resendConfirmation.mutateAsync({ email });
      reset();
      setResendMessage(
        'Si la cuenta existe y sigue pendiente de confirmacion, te enviamos un nuevo email.',
      );
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

  return (
    <AuthCard onSubmit={handleSubmit(onResendSubmit)}>
      <Stack gap="md">
        <Stack gap={4} align="center">
          <Title order={3}>Confirmar email</Title>
          <Text size="sm" c="dimmed" ta="center">
            Valida tu correo para activar la cuenta y poder iniciar sesion.
          </Text>
        </Stack>

        {confirmationSucceeded ? (
          <Stack gap="xs" align="center">
            <Text size="sm" c="green" ta="center">
              Tu email fue confirmado correctamente.
            </Text>
            <Anchor c="brand" component={Link} to={PATHS.auth.login}>
              Ir al login
            </Anchor>
          </Stack>
        ) : token && (!confirmationAttempted || confirmEmail.isPending) ? (
          <Text size="sm" c="dimmed" ta="center">
            Estamos validando tu enlace de confirmacion...
          </Text>
        ) : (
          <>
            {token ? (
              confirmationAttempted &&
              !confirmEmail.isPending && (
                <Text size="sm" c="red" ta="center">
                  {confirmationErrorMessage}
                </Text>
              )
            ) : (
              <Text size="sm" c="red" ta="center">
                El enlace no incluye un token de confirmacion. Puedes solicitar un nuevo email.
              </Text>
            )}

            <TextInput
              label="Email"
              placeholder="usuario@correo.com"
              withAsterisk
              {...register('email')}
              error={errors.email?.message}
            />

            {errors.root && (
              <Text size="sm" c="red" ta="center">
                {errors.root.message}
              </Text>
            )}

            {resendMessage && (
              <Text size="sm" c="green" ta="center">
                {resendMessage}
              </Text>
            )}

            <Stack gap="xs" align="center">
              <Button type="submit" loading={resendConfirmation.isPending}>
                Reenviar confirmacion
              </Button>
              <Text size="sm" c="dimmed" ta="center">
                Volver a{' '}
                <Anchor c="brand" component={Link} to={PATHS.auth.login}>
                  iniciar sesion
                </Anchor>
              </Text>
            </Stack>
          </>
        )}
      </Stack>
    </AuthCard>
  );
}
