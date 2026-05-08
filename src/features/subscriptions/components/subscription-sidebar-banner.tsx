import { Box, Button, Loader, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppToast } from 'shared/ui/toast';
import type { SubscriptionDto } from 'shared/models';

import { useOwnerSubscription } from '../hooks';
import {
  getSubscriptionCtaLabel,
  getSubscriptionPlanDisplayName,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';

import { SubscriptionManagementModal } from './subscription-management-modal';

function SubscriptionBannerCollapsed({
  subscription,
  planName,
  onOpen,
}: {
  subscription: SubscriptionDto | undefined;
  planName: string;
  onOpen: () => void;
}) {
  return (
    <Tooltip
      label={
        subscription
          ? `${planName} | ${getSubscriptionStatusLabel(subscription)}`
          : 'Gestionar suscripcion'
      }
      position="right"
      withArrow
    >
      <Button variant="light" color="brand" size="xs" fullWidth onClick={onOpen}>
        Plan
      </Button>
    </Tooltip>
  );
}

function SubscriptionBannerExpanded({
  onOpen,
  ctaLabel,
}: {
  onOpen: () => void;
  ctaLabel: string;
}) {
  return (
    <Button size="xs" variant="subtle" color="brand" fullWidth onClick={onOpen}>
      {ctaLabel}
    </Button>
  );
}

interface SubscriptionSidebarBannerProps {
  ownerId: number;
  collapsed: boolean;
}

export function SubscriptionSidebarBanner({ ownerId, collapsed }: SubscriptionSidebarBannerProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const toast = useAppToast();

  const { data: subscription, isLoading } = useOwnerSubscription(ownerId);
  const planName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const ctaLabel = subscription ? getSubscriptionCtaLabel(subscription) : 'Gestionar plan';

  if (ownerId == null) return null;

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
    return null; // collapsed=false: no renderizar nada mientras carga, el botón aparece solo
  }

  return (
    <>
      {collapsed ? (
        <SubscriptionBannerCollapsed
          subscription={subscription}
          planName={planName}
          onOpen={open}
        />
      ) : (
        <SubscriptionBannerExpanded ctaLabel={ctaLabel} onOpen={open} />
      )}

      <SubscriptionManagementModal
        ownerId={ownerId}
        opened={opened}
        onClose={close}
        onCompleted={(message) => {
          toast.success(message);
          close();
        }}
      />
    </>
  );
}
