import { Alert, Button, Stack, Text } from '@mantine/core';
import { getAuthErrorMessage } from 'features/auth/get-auth-error-message';
import { useRecoverAccount } from 'features/auth/hooks';
import { GenericModal } from 'shared/components';
import { useAppToast } from 'shared/ui/toast';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
  email?: string | null;
}

export function ChangePasswordModal({ opened, onClose, email }: ChangePasswordModalProps) {
  const recoverAccount = useRecoverAccount();
  const toast = useAppToast();

  const canSendResetLink = Boolean(email);

  const handleSendResetLink = async () => {
    if (!email) {
      return;
    }

    try {
      await recoverAccount.mutateAsync(email);
      toast.success('Te enviamos un email para continuar con el cambio de contrasena.');
    } catch (error) {
      toast.error(
        getAuthErrorMessage(
          error,
          'No pudimos iniciar el cambio de contrasena. Intenta nuevamente.',
        ),
      );
    }
  };

  return (
    <GenericModal
      opened={opened}
      onClose={onClose}
      title="Cambiar contrasena"
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
          <Alert color="brand" variant="light">
            Enviaremos el enlace a <strong>{email}</strong>.
          </Alert>
        ) : (
          <Alert color="yellow" variant="light">
            No se pudo resolver el email de la cuenta para iniciar el cambio de contrasena.
          </Alert>
        )}
      </Stack>
    </GenericModal>
  );
}
