import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput, type DateValue } from '@mantine/dates';
import { GenericModal } from 'shared/components';
import type { SubscriptionPlanOptionDto } from 'shared/models';
import {
  useCancelSubscription,
  useChangePlan,
  useOwnerSubscription,
  useOwnerSubscriptionPlans,
  useRenewSubscription,
} from '../hooks';
import {
  buildPlanChangePayload,
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
  isExpanded: boolean;
  isMutating: boolean;
  periodStartDate: DateValue;
  periodEndDate: DateValue;
  onExpand: (plan: SubscriptionPlanOptionDto) => void;
  onCollapse: () => void;
  onStartDateChange: (value: DateValue) => void;
  onEndDateChange: (value: DateValue) => void;
  onSubmitDirect: (plan: SubscriptionPlanOptionDto) => void;
  onSubmitWithPeriod: (plan: SubscriptionPlanOptionDto) => void;
}

const getIntentHint = (intent: SubscriptionManagementModalIntent) => {
  switch (intent) {
    case 'cancel':
      return 'Revisa el estado actual antes de confirmar la cancelacion o elegir otro plan.';
    case 'renew':
      return 'Puedes renovar la suscripcion actual o cambiar de plan si el catalogo lo permite.';
    case 'change':
      return 'Elige una opcion del catalogo y completa un periodo solo cuando el backend lo requiera.';
    default:
      return 'Gestiona el plan actual y revisa el catalogo disponible para esta cuenta.';
  }
};

function SubscriptionPlanCard({
  plan,
  isExpanded,
  isMutating,
  periodStartDate,
  periodEndDate,
  onExpand,
  onCollapse,
  onStartDateChange,
  onEndDateChange,
  onSubmitDirect,
  onSubmitWithPeriod,
}: SubscriptionPlanCardProps) {
  const changeTypeLabel = getPlanChangeTypeLabel(plan.changeType);
  const planName = getSubscriptionPlanDisplayName(plan);
  const canSubmitPlanChange = plan.canChange && Boolean(plan.key?.trim() || plan.code != null);

  return (
    <Paper
      withBorder
      radius="md"
      p="md"
      style={{
        borderColor: plan.isCurrent
          ? 'var(--mantine-color-brand-4)'
          : isExpanded
            ? 'var(--mantine-color-brand-3)'
            : undefined,
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

              {plan.requiresPeriod && (
                <Badge color="grape" variant="light">
                  Requiere periodo
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
          ) : plan.requiresPeriod ? (
            <Button
              variant={isExpanded ? 'default' : 'light'}
              onClick={() => (isExpanded ? onCollapse() : onExpand(plan))}
              disabled={isMutating}
            >
              {isExpanded ? 'Ocultar periodo' : 'Elegir periodo'}
            </Button>
          ) : (
            <Button variant="light" onClick={() => onSubmitDirect(plan)} disabled={isMutating}>
              Cambiar plan
            </Button>
          )}
        </Group>

        {isExpanded && plan.canChange && plan.requiresPeriod && (
          <Stack gap="sm">
            <Divider />

            <Text size="sm" c="dimmed">
              Este cambio requiere un periodo explicito. Completa las fechas y confirma.
            </Text>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <DatePickerInput
                label="Inicio"
                placeholder="Selecciona una fecha"
                value={periodStartDate}
                onChange={onStartDateChange}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={isMutating}
              />

              <DatePickerInput
                label="Fin"
                placeholder="Selecciona una fecha"
                value={periodEndDate}
                onChange={onEndDateChange}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={isMutating}
              />
            </SimpleGrid>

            <Group justify="flex-end">
              <Button variant="default" onClick={onCollapse} disabled={isMutating}>
                Cancelar
              </Button>
              <Button onClick={() => onSubmitWithPeriod(plan)} loading={isMutating}>
                Confirmar cambio
              </Button>
            </Group>
          </Stack>
        )}
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
  const [expandedPlanKey, setExpandedPlanKey] = useState<string | null>(null);
  const [periodStartDate, setPeriodStartDate] = useState<DateValue>(null);
  const [periodEndDate, setPeriodEndDate] = useState<DateValue>(null);
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
      setExpandedPlanKey(null);
      setPeriodStartDate(null);
      setPeriodEndDate(null);
      setLocalError(null);
    }
  }, [opened]);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.key === expandedPlanKey) ?? null,
    [expandedPlanKey, plans],
  );
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

    const resolvedOwnerId = ownerId;

    if (resolvedOwnerId == null) {
      setLocalError('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    try {
      await renewMutation.mutateAsync({ ownerId: resolvedOwnerId });
      handleSuccessfulCompletion('La suscripcion quedo renovada.');
    } catch {
      // El error visible se resuelve desde mutationError.
    }
  };

  const handleChangePlan = async (
    plan: SubscriptionPlanOptionDto,
    period?: {
      startDate?: string | null;
      endDate?: string | null;
    },
  ) => {
    setLocalError(null);

    const resolvedOwnerId = ownerId;

    if (resolvedOwnerId == null) {
      setLocalError('No se pudo resolver la cuenta para gestionar la suscripcion.');
      return;
    }

    if (!plan.key?.trim() && plan.code == null) {
      setLocalError('El plan seleccionado no tiene un identificador valido.');
      return;
    }

    try {
      await changePlanMutation.mutateAsync(buildPlanChangePayload(resolvedOwnerId, plan, period));
      handleSuccessfulCompletion('El plan actual quedo actualizado.');
    } catch {
      // El error visible se resuelve desde mutationError.
    }
  };

  const handlePeriodPlanChange = (plan: SubscriptionPlanOptionDto) => {
    if (!periodStartDate || !periodEndDate) {
      setLocalError('Completa fecha de inicio y fin para este cambio de plan.');
      return;
    }

    const startDate = dayjs(periodStartDate).format('YYYY-MM-DD');
    const endDate = dayjs(periodEndDate).format('YYYY-MM-DD');

    if (startDate > endDate) {
      setLocalError('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    void handleChangePlan(plan, {
      startDate,
      endDate,
    });
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
                  La suscripcion esta vencida. Si el backend habilita renovacion, podras retomarla
                  desde aqui.
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
                El backend define que opciones pueden tomarse, si son upgrade o downgrade y si
                requieren periodo explicito.
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
                  key={plan.key}
                  plan={plan}
                  isExpanded={activePlan?.key === plan.key}
                  isMutating={isMutating}
                  periodStartDate={activePlan?.key === plan.key ? periodStartDate : null}
                  periodEndDate={activePlan?.key === plan.key ? periodEndDate : null}
                  onExpand={(selectedPlan) => {
                    setExpandedPlanKey(selectedPlan.key);
                    setPeriodStartDate(null);
                    setPeriodEndDate(null);
                    setLocalError(null);
                  }}
                  onCollapse={() => {
                    setExpandedPlanKey(null);
                    setPeriodStartDate(null);
                    setPeriodEndDate(null);
                    setLocalError(null);
                  }}
                  onStartDateChange={setPeriodStartDate}
                  onEndDateChange={setPeriodEndDate}
                  onSubmitDirect={(planToChange) => {
                    void handleChangePlan(planToChange);
                  }}
                  onSubmitWithPeriod={handlePeriodPlanChange}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </GenericModal>
  );
}
