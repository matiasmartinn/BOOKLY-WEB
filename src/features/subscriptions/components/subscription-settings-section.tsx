import { Alert, Badge, Box, Button, Grid, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

import { useOwnerSubscription } from '../hooks';
import {
  formatSubscriptionLimitValue,
  formatSubscriptionValidity,
  getSubscriptionPlanDisplayName,
  getSubscriptionPlanLimits,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';

import { SubscriptionManagementModal } from './subscription-management-modal';

interface SubscriptionSettingsSectionProps {
  ownerId?: number;
}

export function SubscriptionSettingsSection({ ownerId }: SubscriptionSettingsSectionProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const toast = useAppToast();
  const authUser = useAuthStore((state) => state.user);
  const services = useBusinessStore((state) => state.services);
  const refreshServices = useBusinessStore((state) => state.refreshServices);

  const {
    data: subscription,
    isLoading,
    isFetching,
    isError,
    error,
  } = useOwnerSubscription(ownerId, ownerId != null);

  useEffect(() => {
    if (ownerId == null || !authUser || authUser.id !== ownerId) {
      return;
    }

    void refreshServices(authUser);
  }, [authUser, ownerId, refreshServices]);

  if (ownerId == null) {
    return null;
  }

  const currentPlanName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const currentPlanLimits = getSubscriptionPlanLimits(subscription?.currentPlan?.limits);
  const usedServices = services.filter((service) => service.isActive).length;
  const usedSecretaries = new Set(
    services
      .flatMap((service) => service.secretaryIds)
      .filter(
        (secretaryId): secretaryId is number => typeof secretaryId === 'number' && secretaryId > 0,
      ),
  ).size;

  const openModal = () => {
    open();
  };

  return (
    <>
      <PageCard>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <Stack gap={4}>
              <Text fw={600}>Suscripcion y plan</Text>
            </Stack>

            {isFetching && !isLoading && (
              <Badge color="brand" variant="light">
                Actualizando
              </Badge>
            )}
          </Group>

          {isError && (
            <Alert color="red" variant="light">
              {error?.detail || 'No se pudo cargar la suscripcion actual.'}
            </Alert>
          )}

          {isLoading ? (
            <Stack gap="sm">
              <Skeleton h={20} radius="sm" />
              <Skeleton h={92} radius="md" />
            </Stack>
          ) : subscription ? (
            <Stack gap="md">
              <Box
                p="md"
                style={{
                  borderRadius: 'var(--mantine-radius-lg)',
                  border: '1px solid var(--app-color-brand-outline)',
                  backgroundColor: 'var(--app-color-brand-soft)',
                }}
              >
                <Group justify="space-between" align="center" gap="md" wrap="wrap">
                  <Stack gap={6} style={{ flex: '1 1 320px' }}>
                    <Group gap="xs" wrap="wrap">
                      <Text
                        size="xs"
                        fw={700}
                        tt="uppercase"
                        style={{
                          color: 'var(--mantine-color-brand-6)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Plan actual
                      </Text>

                      <Badge
                        color={getSubscriptionStatusColor(subscription)}
                        variant={subscription.isActive ? 'filled' : 'light'}
                        radius="sm"
                        tt="uppercase"
                      >
                        {getSubscriptionStatusLabel(subscription)}
                      </Badge>
                    </Group>

                    <Stack gap={2}>
                      <Text
                        size="xl"
                        fw={700}
                        style={{ color: 'var(--app-color-text-primary)' }}
                      >
                        {currentPlanName}
                      </Text>

                      <Text size="sm" c="dimmed">
                        Vigencia: {formatSubscriptionValidity(subscription)}
                      </Text>
                    </Stack>
                  </Stack>

                  <Group gap="xs" justify="flex-end" wrap="wrap" style={{ flex: '0 1 280px' }}>
                    <Button onClick={openModal}>Cambiar plan</Button>
                    {subscription.canRenew && (
                      <Button variant="light" onClick={openModal}>
                        Renovar
                      </Button>
                    )}
                    {subscription.canCancel && (
                      <Button color="red" variant="light" onClick={openModal}>
                        Cancelar suscripcion
                      </Button>
                    )}
                  </Group>
                </Group>
              </Box>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack gap={2}>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Servicios
                    </Text>
                    <Text size="sm" fw={600}>
                      {usedServices} / {formatSubscriptionLimitValue(currentPlanLimits.maxServices)}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack gap={2}>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Secretarios
                    </Text>
                    <Text size="sm" fw={600}>
                      {usedSecretaries} /{' '}
                      {formatSubscriptionLimitValue(currentPlanLimits.maxSecretaries)}
                    </Text>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack gap={2}>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Campos personalizados
                    </Text>
                    <Text size="sm" fw={600}>
                      {currentPlanLimits.allowsExtraFields ? 'Disponibles' : 'No disponibles'}
                    </Text>
                  </Stack>
                </Grid.Col>
              </Grid>

              {subscription.pendingCancellation && subscription.endDate && (
                <Alert color="yellow" variant="light">
                  La cancelacion esta pendiente y se aplicara al finalizar el periodo vigente.
                </Alert>
              )}

              {subscription.isExpired && (
                <Alert color="red" variant="light">
                  La suscripcion se encuentra vencida.
                </Alert>
              )}
            </Stack>
          ) : (
            <Stack gap="sm">
              <Alert color="yellow" variant="light">
                No hay datos de suscripcion disponibles para esta cuenta.
              </Alert>

              <Group justify="flex-end">
                <Button variant="light" onClick={openModal}>
                  Gestionar plan
                </Button>
              </Group>
            </Stack>
          )}
        </Stack>
      </PageCard>

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
