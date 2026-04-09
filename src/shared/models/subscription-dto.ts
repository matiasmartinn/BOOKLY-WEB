export interface SubscriptionPlanLimitsDto {
  maxServices: number | null;
  maxSecretaries: number | null;
}

export interface SubscriptionPlanDto {
  code: string | number;
  key: string;
  displayName: string;
  limits: SubscriptionPlanLimitsDto;
}

export interface SubscriptionPlanOptionDto extends SubscriptionPlanDto {
  isCurrent: boolean;
  changeType?: string | null;
  canChange: boolean;
  requiresPeriod: boolean;
  unavailableReason?: string | null;
}

export interface SubscriptionDto {
  id: number | null;
  ownerId: number;
  isPersisted: boolean;
  currentPlan: SubscriptionPlanDto;
  status: string;
  rawStatus?: string | null;
  rawStatusCode?: number | null;
  isActive: boolean;
  isExpired: boolean;
  pendingCancellation: boolean;
  canCancel: boolean;
  canRenew: boolean;
  startDate?: string | null;
  endDate?: string | null;
  isOpenEnded: boolean;
  createdOn?: string | null;
  updatedOn?: string | null;
}
