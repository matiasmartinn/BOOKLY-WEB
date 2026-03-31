import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Anchor, Button, Stack, Text, TextInput } from '@mantine/core';
import { PATHS } from 'app/router';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useRecoverAccount } from '../auth.hooks';
import { getAuthErrorMessage } from '../get-auth-error-message';
import { recoverAccountSchema, type RecoverAccountValues } from './recover-account.schema';
import { AuthFormWrapper } from 'features/auth/components';

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
    <AuthFormWrapper onSubmit={handleSubmit(onSubmit)} title="Recupera tu contrasena">
      <Stack gap="xl">
        <TextInput
          label="Email"
          placeholder="usuario@correo.com"
          withAsterisk
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        {successMessage ? (
          <Alert color="green" variant="light">
            {successMessage}
          </Alert>
        ) : null}

        {errors.root ? (
          <Alert color="red" variant="light">
            {errors.root.message}
          </Alert>
        ) : null}

        <Button type="submit" loading={recoverAccount.isPending} fullWidth>
          Enviar enlace
        </Button>

        <Text size="sm" c="dimmed">
          Volver a{' '}
          <Anchor c="gray.7" component={Link} to={PATHS.auth.login}>
            iniciar sesion
          </Anchor>
        </Text>
      </Stack>
    </AuthFormWrapper>
  );
}
