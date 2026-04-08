import { useState } from 'react';
import { Alert, Badge, Button, Grid, Group, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useOwnerSubscription } from '../hooks';
import {
  formatSubscriptionLimitValue,
  formatSubscriptionValidity,
  getSubscriptionPlanDisplayName,
  getSubscriptionPlanLimits,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';
import {
  SubscriptionManagementModal,
  type SubscriptionManagementModalIntent,
} from './subscription-management-modal';

interface SubscriptionSettingsSectionProps {
  ownerId?: number;
}

export function SubscriptionSettingsSection({ ownerId }: SubscriptionSettingsSectionProps) {
  if (ownerId == null) {
    return null;
  }

  const [opened, { open, close }] = useDisclosure(false);
  const [modalIntent, setModalIntent] = useState<SubscriptionManagementModalIntent>('manage');
  const toast = useAppToast();

  const {
    data: subscription,
    isLoading,
    isFetching,
    isError,
    error,
  } = useOwnerSubscription(ownerId);

  const currentPlanName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const currentPlanLimits = getSubscriptionPlanLimits(subscription?.currentPlan?.limits);

  const openModal = (intent: SubscriptionManagementModalIntent) => {
    setModalIntent(intent);
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
            <Stack gap="lg">
              {!subscription.isPersisted && (
                <Alert color="blue" variant="light">
                  El owner ya tiene un plan efectivo disponible aunque todavia no exista una fila de
                  suscripcion persistida.
                </Alert>
              )}

              <Grid gutter="xl" align="flex-start">
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Stack gap="md">
                    <Stack gap={4}>
                      <Group gap="xs" wrap="wrap">
                        <Text size="lg" fw={700}>
                          {currentPlanName}
                        </Text>
                        <Badge color={getSubscriptionStatusColor(subscription)} variant="light">
                          {getSubscriptionStatusLabel(subscription)}
                        </Badge>
                      </Group>

                      <Text size="sm" c="dimmed">
                        Vigencia: {formatSubscriptionValidity(subscription)}
                      </Text>
                    </Stack>

                    <Stack gap={6}>
                      <Text size="sm">
                        Servicios maximos:{' '}
                        {formatSubscriptionLimitValue(currentPlanLimits.maxServices)}
                      </Text>
                      <Text size="sm">
                        Secretarios maximos:{' '}
                        {formatSubscriptionLimitValue(currentPlanLimits.maxSecretaries)}
                      </Text>
                      <Text size="sm">
                        Campos extra: {currentPlanLimits.allowsExtraFields ? 'Si' : 'No'}
                      </Text>
                    </Stack>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Stack align="flex-end" gap="sm">
                    <Group gap="xs" justify="flex-end" wrap="wrap">
                      <Button variant="light" onClick={() => openModal('change')}>
                        Cambiar plan
                      </Button>
                      {subscription.canCancel && (
                        <Button color="red" variant="light" onClick={() => openModal('cancel')}>
                          Cancelar suscripcion
                        </Button>
                      )}
                      {subscription.canRenew && <Button onClick={() => openModal('renew')}>Renovar</Button>}
                    </Group>
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
                <Button variant="light" onClick={() => openModal('manage')}>
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
        initialIntent={modalIntent}
        onCompleted={(message) => {
          toast.success(message);
          close();
        }}
      />
    </>
  );
}
