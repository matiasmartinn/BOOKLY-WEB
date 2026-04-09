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
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Stack gap={2} style={{ flex: '1 1 280px' }}>
          <Text fw={600}>Seguridad</Text>
          <Text size="sm" c="dimmed">
            Gestiona el acceso a tu cuenta.
          </Text>
        </Stack>

        <Button variant="default" onClick={openPasswordModal} disabled={!authUser?.email}>
          Cambiar clave
        </Button>
      </Group>

      <ChangePasswordModal
        opened={passwordModalOpened}
        onClose={closePasswordModal}
        email={authUser?.email}
      />
    </>
  );
}
