import { Alert, Box, Divider, Stack } from '@mantine/core';
import { SubscriptionSettingsSection } from 'features/subscriptions/components';
import { PageCard } from 'shared/layout';
import { useAuthStore } from 'store/use-auth-store';

import { UserProfileForm, UserSecuritySection } from '../components';

export function SettingsPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const isOwner = authUser?.role?.trim().toLowerCase() === 'owner';

  return (
    <Stack gap="md">
      <PageCard>
        <Stack gap="lg">
          <Box w="100%" maw={560}>
            <UserProfileForm />
          </Box>
          <Divider />
          <UserSecuritySection />
        </Stack>
      </PageCard>

      {authUser && isOwner ? (
        <SubscriptionSettingsSection ownerId={authUser.id} />
      ) : authUser ? null : (
        <Alert color="yellow" variant="light">
          No se pudo resolver la cuenta autenticada para cargar la suscripcion.
        </Alert>
      )}
    </Stack>
  );
}
