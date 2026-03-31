import { useState } from 'react';
import { Alert, Badge, Button, Group, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PageCard } from 'shared/layout';
import { useOwnerSubscription } from '../hooks';
import {
  formatSubscriptionDate,
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
  const [opened, { open, close }] = useDisclosure(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [modalIntent, setModalIntent] = useState<SubscriptionManagementModalIntent>('manage');
  const canManageSubscription = ownerId != null;

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
    if (!canManageSubscription) {
      setFeedbackMessage('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    setFeedbackMessage(null);
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
              <Text size="sm" c="dimmed">
                Revisa el plan actual, su vigencia y las acciones administrativas habilitadas por
                el backend.
              </Text>
            </Stack>

            {isFetching && !isLoading && (
              <Badge color="brand" variant="light">
                Actualizando
              </Badge>
            )}
          </Group>

          {feedbackMessage && (
            <Alert color={canManageSubscription ? 'green' : 'yellow'} variant="light">
              {feedbackMessage}
            </Alert>
          )}

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
            <>
              {!subscription.isPersisted && (
                <Alert color="blue" variant="light">
                  El owner ya tiene un plan efectivo disponible aunque todavia no exista una fila de
                  suscripcion persistida.
                </Alert>
              )}

              <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
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

                <Group gap="xs">
                  <Button variant="light" onClick={() => openModal('change')}>
                    Cambiar plan
                  </Button>
                  {subscription.canCancel && (
                    <Button color="red" variant="light" onClick={() => openModal('cancel')}>
                      Cancelar suscripcion
                    </Button>
                  )}
                  {subscription.canRenew && (
                    <Button onClick={() => openModal('renew')}>Renovar</Button>
                  )}
                </Group>
              </Group>

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

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Stack gap={4}>
                  <Text size="sm">Estado visible: {subscription.status}</Text>
                  <Text size="sm">
                    Inicio:{' '}
                    {subscription.startDate
                      ? formatSubscriptionDate(subscription.startDate)
                      : 'Sin fecha informada'}
                  </Text>
                  <Text size="sm">
                    Fin:{' '}
                    {subscription.isOpenEnded
                      ? 'Sin vencimiento'
                      : subscription.endDate
                        ? formatSubscriptionDate(subscription.endDate)
                        : 'Sin fecha informada'}
                  </Text>
                  <Text size="sm">Persistida: {subscription.isPersisted ? 'Si' : 'No'}</Text>
                </Stack>

                <Stack gap={4}>
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
              </SimpleGrid>
            </>
          ) : (
            <Stack gap="sm">
              <Alert color="yellow" variant="light">
                No hay datos de suscripcion disponibles para esta cuenta.
              </Alert>

              <Group justify="flex-end">
                <Button
                  variant="light"
                  onClick={() => openModal('manage')}
                  disabled={!canManageSubscription}
                >
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
          setFeedbackMessage(message);
          close();
        }}
      />
    </>
  );
}
