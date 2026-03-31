import { Button, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuthStore } from 'store/use-auth-store';
import { ChangePasswordModal } from './change-password-modal';

export function UserSecuritySection() {
  const authUser = useAuthStore((state) => state.user);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] =
    useDisclosure(false);

  return (
    <>
      <Stack gap="sm">
        <Stack gap={2}>
          <Text fw={600}>Seguridad</Text>
          <Text size="sm" c="dimmed">
            Gestiona el acceso a tu cuenta.
          </Text>
        </Stack>

        <Group justify="flex-start">
          <Button variant="light" onClick={openPasswordModal} disabled={!authUser?.email}>
            Cambiar contraseña
          </Button>
        </Group>
      </Stack>

      <ChangePasswordModal
        opened={passwordModalOpened}
        onClose={closePasswordModal}
        email={authUser?.email}
      />
    </>
  );
}
