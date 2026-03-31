import { zodResolver } from '@hookform/resolvers/zod';
import { Anchor, Button, Stack, Text, TextInput, Title } from '@mantine/core';
import { PATHS } from 'app/router';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { AuthCard } from 'shared/ui/components';
import { useRecoverAccount } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';
import { recoverAccountSchema, type RecoverAccountValues } from './recover-account.schema';

export function RecoverAccountForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RecoverAccountValues>({
    resolver: zodResolver(recoverAccountSchema),
  });

  const recoverAccount = useRecoverAccount();

  const onSubmit: SubmitHandler<RecoverAccountValues> = async ({ email }) => {
    clearErrors('root');
    setSuccessMessage(null);

    try {
      await recoverAccount.mutateAsync(email);
      setSuccessMessage(
        'Si la cuenta existe, te enviamos un email con los pasos para restablecer la contrasena.',
      );
    } catch (error) {
      setError('root', {
        message: getAuthErrorMessage(
          error,
          'No pudimos procesar la solicitud de recuperacion. Intenta nuevamente.',
        ),
      });
    }
  };

  return (
    <AuthCard onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="md">
        <Stack gap={4} align="center">
          <Title order={3}>Recuperar contrasena</Title>
          <Text size="sm" c="dimmed" ta="center">
            Ingresa el email de tu cuenta y te enviaremos un enlace para restablecerla.
          </Text>
        </Stack>

        <TextInput
          label="Email"
          placeholder="usuario@correo.com"
          withAsterisk
          {...register('email')}
          error={errors.email?.message}
        />

        {successMessage && (
          <Text size="sm" c="green" ta="center">
            {successMessage}
          </Text>
        )}

        {errors.root && (
          <Text size="sm" c="red" ta="center">
            {errors.root.message}
          </Text>
        )}

        <Stack gap="xs" align="center">
          <Button type="submit" loading={recoverAccount.isPending}>
            Enviar enlace
          </Button>
          <Text size="sm" c="dimmed" ta="center">
            Volver a{' '}
            <Anchor c="brand" component={Link} to={PATHS.auth.login}>
              iniciar sesion
            </Anchor>
          </Text>
        </Stack>
      </Stack>
    </AuthCard>
  );
}
