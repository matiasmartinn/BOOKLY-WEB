import { Alert, Stack } from '@mantine/core';
import { SubscriptionSettingsSection } from 'features/subscriptions/components';
import { UserProfileForm, UserSecuritySection } from 'features/user-profile/components';
import { PageCard, PageShell } from 'shared/layout';
import { useAuthStore } from 'store/use-auth-store';

export function SettingsPage() {
  const authUser = useAuthStore((s) => s.user);

  return (
    <PageShell
      title="Cuenta"
      description="Administra tu información personal y el plan activo desde una sola pantalla."
    >
      <Stack gap="md">
        <PageCard>
          <UserProfileForm />
        </PageCard>

        <PageCard>
          <UserSecuritySection />
        </PageCard>

        {authUser ? (
          <SubscriptionSettingsSection ownerId={authUser.id} />
        ) : (
          <Alert color="yellow" variant="light">
            No se pudo resolver la cuenta autenticada para cargar la suscripción.
          </Alert>
        )}
      </Stack>
    </PageShell>
  );
}
