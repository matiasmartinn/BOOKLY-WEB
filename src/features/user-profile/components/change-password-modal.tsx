import { useEffect, useState } from 'react';
import { Alert, Button, Stack, Text } from '@mantine/core';
import { useRecoverAccount } from 'features/auth/hooks';
import { getAuthErrorMessage } from 'features/auth/get-auth-error-message';
import { GenericModal } from 'shared/components';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
  email?: string | null;
}

export function ChangePasswordModal({ opened, onClose, email }: ChangePasswordModalProps) {
  const recoverAccount = useRecoverAccount();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) {
      setSuccessMessage(null);
    }
  }, [opened]);

  const canSendResetLink = Boolean(email);

  const handleSendResetLink = async () => {
    if (!email) {
      return;
    }

    setSuccessMessage(null);

    try {
      await recoverAccount.mutateAsync(email);
      setSuccessMessage('Te enviamos un email para continuar con el cambio de contraseña.');
    } catch {
      // El mensaje se muestra usando el estado del mutation.
    }
  };

  return (
    <GenericModal
      opened={opened}
      onClose={onClose}
      title="Cambiar contraseña"
      size="md"
      footer={
        <>
          <Button variant="default" onClick={onClose} disabled={recoverAccount.isPending}>
            Cerrar
          </Button>
          <Button
            onClick={handleSendResetLink}
            loading={recoverAccount.isPending}
            disabled={!canSendResetLink}
          >
            Enviar enlace
          </Button>
        </>
      }
    >
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Te enviaremos un enlace para continuar.
        </Text>

        {email ? (
          <Alert color="blue" variant="light">
            Enviaremos el enlace a <strong>{email}</strong>.
          </Alert>
        ) : (
          <Alert color="yellow" variant="light">
            No se pudo resolver el email de la cuenta para iniciar el cambio de contraseña.
          </Alert>
        )}

        {successMessage && (
          <Alert color="green" variant="light">
            {successMessage}
          </Alert>
        )}

        {recoverAccount.isError && (
          <Alert color="red" variant="light">
            {getAuthErrorMessage(
              recoverAccount.error,
              'No pudimos iniciar el cambio de contraseña. Intenta nuevamente.',
            )}
          </Alert>
        )}
      </Stack>
    </GenericModal>
  );
}
