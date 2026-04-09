import { Alert, Badge, Button, Group, Loader, Paper, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import { GenericModal } from 'shared/components';
import type { SubscriptionPlanOptionDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';

import { createChangePlanDto, createRenewSubscriptionDto } from '../adapter';
import {
  useCancelSubscription,
  useChangePlan,
  useOwnerSubscription,
  useOwnerSubscriptionPlans,
  useRenewSubscription,
} from '../hooks';
import {
  formatSubscriptionDate,
  formatSubscriptionLimitValue,
  formatSubscriptionValidity,
  getSubscriptionPlanDisplayName,
  getSubscriptionPlanLimits,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';

import { SubscriptionPlanCard } from './subscription-plan-card';

export type SubscriptionManagementModalIntent = 'manage' | 'change' | 'cancel' | 'renew';

interface SubscriptionManagementModalProps {
  ownerId?: number;
  opened: boolean;
  onClose: () => void;
  onCompleted?: (message: string) => void;
}

const isFreePlan = (plan: SubscriptionPlanOptionDto) => plan.key?.trim().toLowerCase() === 'free';

export function SubscriptionManagementModal({
  ownerId,
  opened,
  onClose,
  onCompleted,
}: SubscriptionManagementModalProps) {
  const canManageSubscription = ownerId != null;
  const toast = useAppToast();

  const {
    data: subscription,
    isLoading: isLoadingSubscription,
    isFetching: isFetchingSubscription,
    error: subscriptionError,
  } = useOwnerSubscription(ownerId, opened);

  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    isFetching: isFetchingPlans,
    error: plansError,
  } = useOwnerSubscriptionPlans(ownerId, opened);

  const cancelMutation = useCancelSubscription(ownerId);
  const renewMutation = useRenewSubscription();
  const changePlanMutation = useChangePlan();

  const isMutating =
    cancelMutation.isPending || renewMutation.isPending || changePlanMutation.isPending;

  const currentPlanName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const currentPlanLimits = getSubscriptionPlanLimits(subscription?.currentPlan?.limits);
  const visibleError =
    (!canManageSubscription
      ? 'No se pudo resolver la cuenta para gestionar la suscripcion.'
      : undefined) ||
    subscriptionError?.detail ||
    plansError?.detail ||
    null;

  const handleSuccessfulCompletion = (message: string) => {
    if (onCompleted) {
      onCompleted(message);
      return;
    }

    toast.success(message);
    onClose();
  };

  const handleCancelSubscription = async () => {
    if (!canManageSubscription) {
      toast.error('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      const nextSubscription = await cancelMutation.mutateAsync();
      handleSuccessfulCompletion(
        nextSubscription.pendingCancellation
          ? 'La cancelacion quedo programada sobre la suscripcion actual.'
          : 'La suscripcion quedo cancelada.',
      );
    } catch (error) {
      toast.error(
        isApiError(error) ? error.detail : 'No se pudo completar la cancelacion de la suscripcion.',
      );
    }
  };

  const handleRenewSubscription = async () => {
    if (ownerId == null) {
      toast.error('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      const payload = createRenewSubscriptionDto(ownerId);
      await renewMutation.mutateAsync(payload);
      handleSuccessfulCompletion('La suscripcion quedo renovada con un nuevo periodo mensual.');
    } catch (error) {
      toast.error(
        isApiError(error)
          ? error.detail
          : error instanceof Error
            ? error.message
            : 'No se pudo preparar la renovacion de la suscripcion.',
      );
    }
  };

  const handleChangePlan = async (plan: SubscriptionPlanOptionDto) => {
    if (ownerId == null) {
      toast.error('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      const payload = createChangePlanDto(ownerId, plan);
      await changePlanMutation.mutateAsync(payload);
      handleSuccessfulCompletion(
        isFreePlan(plan)
          ? 'El plan actual quedo actualizado.'
          : 'El plan actual quedo actualizado con un nuevo periodo mensual.',
      );
    } catch (error) {
      toast.error(
        isApiError(error)
          ? error.detail
          : error instanceof Error
            ? error.message
            : 'No se pudo preparar el cambio de plan.',
      );
    }
  };

  return (
    <GenericModal
      opened={opened}
      onClose={onClose}
      title="Gestionar suscripcion"
      size="xl"
      loading={isMutating}
    >
      <Stack gap="lg">
        {visibleError && (
          <Alert color="red" variant="light">
            {visibleError || 'No se pudo completar la gestion de la suscripcion.'}
          </Alert>
        )}

        {canManageSubscription && isLoadingSubscription ? (
          <Stack gap="sm">
            <Skeleton h={20} radius="sm" />
            <Skeleton h={72} radius="md" />
          </Stack>
        ) : canManageSubscription && subscription ? (
          <Paper withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                <Stack gap={4}>
                  <Group gap="xs" wrap="wrap">
                    <Text fw={600}>Plan actual</Text>
                    <Badge color={getSubscriptionStatusColor(subscription)} variant="light">
                      {getSubscriptionStatusLabel(subscription)}
                    </Badge>
                    {!subscription.isPersisted && (
                      <Badge color="blue" variant="light">
                        Efectivo
                      </Badge>
                    )}
                    {isFetchingSubscription && (
                      <Badge color="brand" variant="light">
                        Actualizando
                      </Badge>
                    )}
                  </Group>

                  <Text size="lg" fw={700}>
                    {currentPlanName}
                  </Text>

                  <Text size="sm" c="dimmed">
                    Vigencia: {formatSubscriptionValidity(subscription)}
                  </Text>
                </Stack>

                <Group gap="xs">
                  {subscription.canRenew && (
                    <Button
                      onClick={() => void handleRenewSubscription()}
                      loading={renewMutation.isPending}
                    >
                      Renovar
                    </Button>
                  )}

                  {subscription.canCancel && (
                    <Button
                      color="red"
                      variant="light"
                      onClick={() => void handleCancelSubscription()}
                      loading={cancelMutation.isPending}
                    >
                      Cancelar suscripcion
                    </Button>
                  )}
                </Group>
              </Group>

              {subscription.pendingCancellation && subscription.endDate && (
                <Alert color="yellow" variant="light">
                  La suscripcion quedara cancelada al cierre del periodo actual:{' '}
                  {formatSubscriptionDate(subscription.endDate)}.
                </Alert>
              )}

              {subscription.isExpired && (
                <Alert color="red" variant="light">
                  La suscripcion esta vencida. Puedes renovarla o elegir un nuevo plan pago para
                  generar una nueva vigencia mensual.
                </Alert>
              )}

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Stack gap={4}>
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
                </Stack>

                <Stack gap={4}>
                  <Text size="sm">
                    Servicios: {formatSubscriptionLimitValue(currentPlanLimits.maxServices)}
                  </Text>
                  <Text size="sm">
                    Secretarios: {formatSubscriptionLimitValue(currentPlanLimits.maxSecretaries)}
                  </Text>
                </Stack>
              </SimpleGrid>
            </Stack>
          </Paper>
        ) : !canManageSubscription ? (
          <Alert color="yellow" variant="light">
            Espera a que se resuelva la cuenta antes de gestionar la suscripcion.
          </Alert>
        ) : (
          <Alert color="yellow" variant="light">
            No hay suscripcion disponible para esta cuenta.
          </Alert>
        )}

        <Stack gap="sm">
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text fw={600}>Catalogo de planes</Text>
            </Stack>

            {canManageSubscription && isFetchingPlans && !isLoadingPlans && <Loader size="sm" />}
          </Group>

          {!canManageSubscription ? (
            <Alert color="yellow" variant="light">
              No se puede cargar el catalogo mientras la cuenta no este disponible.
            </Alert>
          ) : isLoadingPlans ? (
            <Stack gap="sm">
              <Skeleton h={92} radius="md" />
              <Skeleton h={92} radius="md" />
            </Stack>
          ) : plans.length === 0 ? (
            <Alert color="yellow" variant="light">
              No hay planes disponibles para esta cuenta en este momento.
            </Alert>
          ) : (
            <Stack gap="sm">
              {plans.map((plan) => (
                <SubscriptionPlanCard
                  key={plan.key || String(plan.code)}
                  plan={plan}
                  isMutating={isMutating}
                  onSubmit={(planToChange) => {
                    void handleChangePlan(planToChange);
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </GenericModal>
  );
}
