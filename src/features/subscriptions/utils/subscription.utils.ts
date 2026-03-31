import type {
  SubscriptionDto,
  SubscriptionPlanLimitsDto,
  SubscriptionPlanDto,
  SubscriptionPlanOptionDto,
} from 'shared/models';

const subscriptionDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const DEFAULT_SUBSCRIPTION_PLAN_LIMITS: SubscriptionPlanLimitsDto = {
  maxServices: null,
  maxSecretaries: null,
  allowsExtraFields: false,
};

export const formatSubscriptionDate = (value?: string | null) => {
  if (!value) {
    return 'Sin fecha informada';
  }

  const normalizedValue = value.includes('T') ? value : `${value}T00:00:00`;
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Sin fecha informada';
  }

  return subscriptionDateFormatter.format(parsedDate);
};

export const formatSubscriptionLimitValue = (value?: number | null) => {
  if (value == null || value < 0) {
    return 'Sin limite';
  }

  return String(value);
};

export const getSubscriptionPlanLimits = (
  limits?: Partial<SubscriptionPlanLimitsDto> | null,
): SubscriptionPlanLimitsDto => ({
  maxServices:
    typeof limits?.maxServices === 'number' || limits?.maxServices === null
      ? limits.maxServices
      : DEFAULT_SUBSCRIPTION_PLAN_LIMITS.maxServices,
  maxSecretaries:
    typeof limits?.maxSecretaries === 'number' || limits?.maxSecretaries === null
      ? limits.maxSecretaries
      : DEFAULT_SUBSCRIPTION_PLAN_LIMITS.maxSecretaries,
  allowsExtraFields:
    typeof limits?.allowsExtraFields === 'boolean'
      ? limits.allowsExtraFields
      : DEFAULT_SUBSCRIPTION_PLAN_LIMITS.allowsExtraFields,
});

export const getSubscriptionPlanDisplayName = (
  plan?: Partial<SubscriptionPlanDto> | null,
) => {
  const displayName = plan?.displayName?.trim();
  if (displayName) {
    return displayName;
  }

  const key = plan?.key?.trim();
  if (key) {
    return key;
  }

  if (plan?.code != null) {
    const code = String(plan.code).trim();
    if (code) {
      return code;
    }
  }

  return 'Plan no disponible';
};

export const formatPlanLimitsSummary = (limits?: Partial<SubscriptionPlanLimitsDto> | null) => {
  const safeLimits = getSubscriptionPlanLimits(limits);

  return `Servicios: ${formatSubscriptionLimitValue(safeLimits.maxServices)} | Secretarios: ${formatSubscriptionLimitValue(
    safeLimits.maxSecretaries,
  )} | Campos extra: ${safeLimits.allowsExtraFields ? 'Si' : 'No'}`;
};

export const getSubscriptionStatusLabel = (subscription: SubscriptionDto) => {
  if (subscription.isExpired) {
    return 'Vencida';
  }

  if (subscription.pendingCancellation) {
    return 'Cancelacion pendiente';
  }

  if (subscription.isActive) {
    return 'Activa';
  }

  return subscription.status?.trim() || subscription.rawStatus?.trim() || 'Sin estado';
};

export const getSubscriptionStatusColor = (subscription: SubscriptionDto) => {
  if (subscription.isExpired) {
    return 'red';
  }

  if (subscription.pendingCancellation) {
    return 'yellow';
  }

  if (subscription.isActive) {
    return 'green';
  }

  return 'gray';
};

export const formatSubscriptionValidity = (subscription: SubscriptionDto) => {
  if (!subscription.startDate && !subscription.endDate) {
    return 'Sin vigencia informada';
  }

  if (subscription.isOpenEnded || !subscription.endDate) {
    if (subscription.startDate) {
      return `Desde ${formatSubscriptionDate(subscription.startDate)} | sin vencimiento`;
    }

    return 'Sin vencimiento';
  }

  if (!subscription.startDate) {
    return `Hasta ${formatSubscriptionDate(subscription.endDate)}`;
  }

  return `${formatSubscriptionDate(subscription.startDate)} al ${formatSubscriptionDate(
    subscription.endDate,
  )}`;
};

export const getPlanChangeTypeLabel = (changeType?: string | null) => {
  const normalized = changeType?.trim().toLowerCase();

  switch (normalized) {
    case 'upgrade':
      return 'Upgrade';
    case 'downgrade':
      return 'Downgrade';
    case 'lateral':
    case 'same-tier':
    case 'same_tier':
      return 'Cambio lateral';
    default:
      return changeType?.trim() || null;
  }
};

export const getSubscriptionCtaLabel = (subscription: SubscriptionDto) => {
  const normalizedKey = subscription.currentPlan?.key?.trim().toLowerCase();

  if (normalizedKey === 'free' || normalizedKey === 'basic') {
    return 'Mejorar plan';
  }

  return 'Gestionar plan';
};

export const buildPlanChangePayload = (
  ownerId: number,
  plan: SubscriptionPlanOptionDto,
  period?: {
    startDate?: string | null;
    endDate?: string | null;
  },
) => ({
  ownerId,
  targetPlan: plan.key?.trim() || undefined,
  planName: plan.code ?? plan.displayName ?? undefined,
  startDate: period?.startDate ?? undefined,
  endDate: period?.endDate ?? undefined,
});
