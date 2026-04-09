import type {
  SubscriptionPlanDto,
  SubscriptionPlanLimitsDto,
  SubscriptionPlanOptionDto,
} from 'shared/models';

import {
  changePlanSchema,
  renewSubscriptionSchema,
  type ChangePlanDto,
  type RenewSubscriptionDto,
} from '../schema';

export interface SubscriptionPlanOptionApiDto {
  plan: SubscriptionPlanDto;
  isCurrent: boolean;
  changeType?: string | null;
  canChange: boolean;
  requiresPeriod: boolean;
  unavailableReason?: string | null;
}

const DEFAULT_PLAN_LIMITS: SubscriptionPlanLimitsDto = {
  maxServices: null,
  maxSecretaries: null,
};

const getSchemaErrorMessage = (issues: { message?: string }[]) => {
  return issues[0]?.message || 'No se pudo preparar la solicitud de suscripcion.';
};

const normalizePlan = (plan?: Partial<SubscriptionPlanDto> | null): SubscriptionPlanDto => {
  const limits = plan?.limits;

  return {
    code: plan?.code ?? '',
    key: plan?.key?.trim() ?? '',
    displayName: plan?.displayName?.trim() ?? '',
    limits: {
      maxServices:
        typeof limits?.maxServices === 'number' || limits?.maxServices === null
          ? limits.maxServices
          : DEFAULT_PLAN_LIMITS.maxServices,
      maxSecretaries:
        typeof limits?.maxSecretaries === 'number' || limits?.maxSecretaries === null
          ? limits.maxSecretaries
          : DEFAULT_PLAN_LIMITS.maxSecretaries,
    },
  };
};

export const mapSubscriptionPlanOptionFromApi = (
  option: SubscriptionPlanOptionApiDto,
): SubscriptionPlanOptionDto => {
  const plan = normalizePlan(option.plan);

  return {
    ...plan,
    isCurrent: option.isCurrent,
    changeType: option.changeType ?? null,
    canChange: option.canChange,
    requiresPeriod: option.requiresPeriod,
    unavailableReason: option.unavailableReason ?? null,
  };
};

export const mapSubscriptionPlanOptionsFromApi = (
  items: SubscriptionPlanOptionApiDto[],
): SubscriptionPlanOptionDto[] => items.map(mapSubscriptionPlanOptionFromApi);

export const createRenewSubscriptionDto = (ownerId: number): RenewSubscriptionDto => {
  const result = renewSubscriptionSchema.safeParse({ ownerId });

  if (!result.success) {
    throw new Error(getSchemaErrorMessage(result.error.issues));
  }

  return result.data;
};

export const createChangePlanDto = (
  ownerId: number,
  plan: SubscriptionPlanOptionDto,
): ChangePlanDto => {
  const result = changePlanSchema.safeParse({
    ownerId,
    targetPlan: plan.key?.trim() || undefined,
    planName: plan.code ?? plan.displayName ?? undefined,
  });

  if (!result.success) {
    throw new Error(getSchemaErrorMessage(result.error.issues));
  }

  return result.data;
};
