import { Alert, Button, Group, Loader, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
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
import { formatSubscriptionDate } from '../utils/subscription.utils';

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

        {!canManageSubscription && (
          <Alert color="yellow" variant="light">
            Espera a que se resuelva la cuenta antes de gestionar la suscripcion.
          </Alert>
        )}

        <Stack gap="sm">
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Stack gap={2}>
              <Text fw={600}>Planes disponibles</Text>
            </Stack>

            {canManageSubscription &&
              (isFetchingSubscription || isFetchingPlans) &&
              !isLoadingPlans && <Loader size="sm" />}
          </Group>

          {!canManageSubscription ? (
            <Alert color="yellow" variant="light">
              No se pueden cargar los planes mientras la cuenta no este disponible.
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
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" verticalSpacing="md">
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
            </SimpleGrid>
          )}
        </Stack>

        {canManageSubscription && isLoadingSubscription ? (
          <Skeleton h={40} radius="md" />
        ) : subscription ? (
          <Stack gap="sm">
            {subscription.pendingCancellation && subscription.endDate && (
              <Alert color="yellow" variant="light">
                La suscripcion quedara cancelada al cierre del periodo actual:{' '}
                {formatSubscriptionDate(subscription.endDate)}.
              </Alert>
            )}

            {subscription.isExpired && (
              <Alert color="red" variant="light">
                La suscripcion esta vencida. Puedes renovarla o elegir un nuevo plan pago.
              </Alert>
            )}

            {(subscription.canRenew || subscription.canCancel) && (
              <Group justify="flex-end" gap="xs" wrap="wrap">
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

                {subscription.canRenew && (
                  <Button
                    onClick={() => void handleRenewSubscription()}
                    loading={renewMutation.isPending}
                  >
                    Renovar
                  </Button>
                )}
              </Group>
            )}
          </Stack>
        ) : canManageSubscription ? (
          <Alert color="yellow" variant="light">
            No hay suscripcion disponible para esta cuenta.
          </Alert>
        ) : null}
      </Stack>
    </GenericModal>
  );
}
