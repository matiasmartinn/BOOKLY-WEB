import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { GenericModal } from 'shared/components';
import type { SubscriptionPlanOptionDto } from 'shared/models';
import { createChangePlanDto, createRenewSubscriptionDto } from '../adapter';
import {
  useCancelSubscription,
  useChangePlan,
  useOwnerSubscription,
  useOwnerSubscriptionPlans,
  useRenewSubscription,
} from '../hooks';
import {
  formatPlanLimitsSummary,
  formatSubscriptionDate,
  formatSubscriptionLimitValue,
  formatSubscriptionValidity,
  getPlanChangeTypeLabel,
  getSubscriptionPlanDisplayName,
  getSubscriptionPlanLimits,
  getSubscriptionStatusColor,
  getSubscriptionStatusLabel,
} from '../utils/subscription.utils';

export type SubscriptionManagementModalIntent = 'manage' | 'change' | 'cancel' | 'renew';

interface SubscriptionManagementModalProps {
  ownerId?: number;
  opened: boolean;
  onClose: () => void;
  onCompleted?: (message: string) => void;
  initialIntent?: SubscriptionManagementModalIntent;
}

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlanOptionDto;
  isMutating: boolean;
  onSubmit: (plan: SubscriptionPlanOptionDto) => void;
}

const getIntentHint = (intent: SubscriptionManagementModalIntent) => {
  switch (intent) {
    case 'cancel':
      return 'Revisa el estado actual antes de confirmar la cancelacion o elegir otro plan.';
    case 'renew':
      return 'La renovacion manual reactiva el plan actual con un nuevo periodo mensual calculado por el backend.';
    case 'change':
      return 'Elige el plan destino. Si es pago, el backend asigna automaticamente una vigencia mensual con hora Argentina.';
    default:
      return 'El frontend solo elige la accion o el plan. La vigencia de los planes pagos la calcula el backend.';
  }
};

const isFreePlan = (plan: SubscriptionPlanOptionDto) => plan.key?.trim().toLowerCase() === 'free';

function SubscriptionPlanCard({ plan, isMutating, onSubmit }: SubscriptionPlanCardProps) {
  const changeTypeLabel = getPlanChangeTypeLabel(plan.changeType);
  const planName = getSubscriptionPlanDisplayName(plan);
  const canSubmitPlanChange = plan.canChange && Boolean(plan.key?.trim() || plan.code != null);

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        borderColor: plan.isCurrent ? 'var(--mantine-color-brand-4)' : undefined,
        backgroundColor: plan.isCurrent ? 'var(--mantine-color-brand-0)' : 'white',
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
          <Stack gap={4} flex={1}>
            <Group gap="xs" wrap="wrap">
              <Text fw={600}>{planName}</Text>

              {plan.isCurrent && (
                <Badge color="brand" variant="light">
                  Actual
                </Badge>
              )}

              {changeTypeLabel && !plan.isCurrent && (
                <Badge color="blue" variant="light">
                  {changeTypeLabel}
                </Badge>
              )}

              {!isFreePlan(plan) && (
                <Badge color="grape" variant="light">
                  Mes automatico
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              {formatPlanLimitsSummary(plan.limits)}
            </Text>

            {!canSubmitPlanChange && (
              <Text size="sm" c="red">
                {plan.unavailableReason || 'Este plan no se puede seleccionar en este momento.'}
              </Text>
            )}
          </Stack>

          {plan.isCurrent ? (
            <Button variant="default" disabled>
              Plan actual
            </Button>
          ) : !canSubmitPlanChange ? (
            <Button variant="default" disabled>
              No disponible
            </Button>
          ) : (
            <Button variant="light" onClick={() => onSubmit(plan)} disabled={isMutating}>
              Cambiar plan
            </Button>
          )}
        </Group>
      </Stack>
    </Paper>
  );
}

export function SubscriptionManagementModal({
  ownerId,
  opened,
  onClose,
  onCompleted,
  initialIntent = 'manage',
}: SubscriptionManagementModalProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const canManageSubscription = ownerId != null;

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

  const mutationError =
    changePlanMutation.error?.detail || renewMutation.error?.detail || cancelMutation.error?.detail;

  const isMutating =
    cancelMutation.isPending || renewMutation.isPending || changePlanMutation.isPending;

  useEffect(() => {
    if (!opened) {
      setLocalError(null);
    }
  }, [opened]);

  const currentPlanName = getSubscriptionPlanDisplayName(subscription?.currentPlan);
  const currentPlanLimits = getSubscriptionPlanLimits(subscription?.currentPlan?.limits);
  const visibleError =
    localError ||
    mutationError ||
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

    onClose();
  };

  const handleCancelSubscription = async () => {
    setLocalError(null);

    if (!canManageSubscription) {
      setLocalError('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      const nextSubscription = await cancelMutation.mutateAsync();
      handleSuccessfulCompletion(
        nextSubscription.pendingCancellation
          ? 'La cancelacion quedo programada sobre la suscripcion actual.'
          : 'La suscripcion quedo cancelada.',
      );
    } catch {
      // El error visible se resuelve desde mutationError.
    }
  };

  const handleRenewSubscription = async () => {
    setLocalError(null);

    if (ownerId == null) {
      setLocalError('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      const payload = createRenewSubscriptionDto(ownerId);
      await renewMutation.mutateAsync(payload);
      handleSuccessfulCompletion('La suscripcion quedo renovada con un nuevo periodo mensual.');
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : 'No se pudo preparar la renovacion de la suscripcion.',
      );
    }
  };

  const handleChangePlan = async (plan: SubscriptionPlanOptionDto) => {
    setLocalError(null);

    if (ownerId == null) {
      setLocalError('No se pudo resolver la cuenta para gestionar la suscripcion.');
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
      setLocalError(
        error instanceof Error
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
        <Text size="sm" c="dimmed">
          {getIntentHint(initialIntent)}
        </Text>

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
                    <Button onClick={() => void handleRenewSubscription()} loading={renewMutation.isPending}>
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

              <Alert color="blue" variant="light">
                Los cambios y renovaciones de planes pagos generan un nuevo periodo mensual desde
                hoy, calculado por el backend con hora Argentina.
              </Alert>

              {!subscription.isPersisted && (
                <Alert color="blue" variant="light">
                  La cuenta todavia no tiene una fila persistida, pero el backend ya expone el plan
                  efectivo para operar desde el frontend.
                </Alert>
              )}

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
                  <Text size="sm">Estado backend: {subscription.status}</Text>
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
                  <Text size="sm">
                    Campos extra: {currentPlanLimits.allowsExtraFields ? 'Si' : 'No'}
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
              <Text size="sm" c="dimmed">
                El frontend solo elige plan y accion. Si el destino es pago, el backend aplica la
                vigencia mensual automaticamente.
              </Text>
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
