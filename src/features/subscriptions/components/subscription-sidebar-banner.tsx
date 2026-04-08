import { Badge, Box, Button, Loader, Stack, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppToast } from 'shared/ui/toast';
import { useOwnerSubscription } from '../hooks';
import {
  getSubscriptionCtaLabel,
  getSubscriptionPlanDisplayName,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';
import {
  SubscriptionManagementModal,
  type SubscriptionManagementModalIntent,
} from './subscription-management-modal';

interface SubscriptionSidebarBannerProps {
  ownerId?: number;
  collapsed: boolean;
}

export function SubscriptionSidebarBanner({
  ownerId,
  collapsed,
}: SubscriptionSidebarBannerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const modalIntent: SubscriptionManagementModalIntent = 'manage';
  const canManageSubscription = ownerId != null;
  const toast = useAppToast();

  const { data: subscription, isLoading, isError } = useOwnerSubscription(ownerId);
  const planName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const ctaLabel = subscription ? getSubscriptionCtaLabel(subscription) : 'Gestionar plan';

  if (!canManageSubscription) {
    return null;
  }

  const handleOpen = () => {
    open();
  };

  if (isLoading) {
    if (collapsed) {
      return (
        <Tooltip label="Cargando suscripcion" position="right" withArrow>
          <Box
            w={28}
            h={28}
            mx="auto"
            style={{
              borderRadius: 8,
              border: '0.5px solid var(--mantine-color-default-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader size={12} />
          </Box>
        </Tooltip>
      );
    }

    return (
      <Stack gap={6} px={4}>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
          Suscripcion
        </Text>
        <Text size="xs" c="dimmed">
          Cargando plan actual...
        </Text>
      </Stack>
    );
  }

  const bannerContent = collapsed ? (
    <Tooltip
      label={
        subscription
          ? `${planName} | ${getSubscriptionStatusLabel(subscription)}`
          : 'Gestionar suscripcion'
      }
      position="right"
      withArrow
    >
      <Button variant="light" color="brand" size="xs" fullWidth onClick={handleOpen}>
        Plan
      </Button>
    </Tooltip>
  ) : (
    <Stack
      gap={6}
      p="xs"
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        backgroundColor: 'var(--mantine-color-brand-0)',
        border: '0.5px solid var(--mantine-color-brand-2)',
      }}
    >
      <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
        Suscripcion
      </Text>

      <Text size="sm" fw={600}>
        {subscription ? planName : 'Plan no disponible'}
      </Text>

      {subscription ? (
        <Badge color={getSubscriptionStatusColor(subscription)} variant="light" w="fit-content">
          {getSubscriptionStatusLabel(subscription)}
        </Badge>
      ) : (
        <Text size="xs" c={isError ? 'red.6' : 'dimmed'}>
          {isError ? 'No se pudo cargar el plan actual.' : 'Sin datos de plan por el momento.'}
        </Text>
      )}

      <Button size="xs" variant="light" onClick={handleOpen}>
        {ctaLabel}
      </Button>
    </Stack>
  );

  return (
    <>
      {bannerContent}

      <SubscriptionManagementModal
        ownerId={ownerId}
        opened={opened}
        onClose={close}
        initialIntent={modalIntent}
        onCompleted={(message) => {
          toast.success(message);
          close();
        }}
      />
    </>
  );
}
