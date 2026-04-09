import { formatDateOnly } from 'shared/utils';

import type {
  AdminOwnerAccountStatus,
  AdminPlanDto,
  AdminServiceStatus,
  AdminSubscriptionStatus,
} from '../models';

const numberFormatter = new Intl.NumberFormat('es-AR');

interface BadgeMeta {
  label: string;
  color: string;
}

const OWNER_STATUS_META: Record<AdminOwnerAccountStatus, BadgeMeta> = {
  active: { label: 'Activo', color: 'green' },
  disabled: { label: 'Deshabilitado', color: 'red' },
  pending_email_confirmation: { label: 'Pendiente email', color: 'yellow' },
  pending_invitation_acceptance: { label: 'Pendiente invitacion', color: 'blue' },
};

const SERVICE_STATUS_META: Record<AdminServiceStatus, BadgeMeta> = {
  active: { label: 'Activo', color: 'green' },
  disabled: { label: 'Deshabilitado', color: 'red' },
};

const SUBSCRIPTION_STATUS_META: Record<AdminSubscriptionStatus, BadgeMeta> = {
  active: { label: 'Activa', color: 'green' },
  pending_cancellation: { label: 'Cancelacion pendiente', color: 'yellow' },
  expired: { label: 'Vencida', color: 'red' },
  implicit_free: { label: 'Free', color: 'gray' },
};

export const formatAdminNumber = (value?: number | null) => numberFormatter.format(value ?? 0);

export const formatAdminDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }

  return formatDateOnly(value);
};

export const formatAdminPrice = (value?: number | null) => {
  if (value == null) {
    return 'Sin definir';
  }

  return numberFormatter.format(value);
};

export const formatAdminPlan = (plan?: AdminPlanDto | null) => {
  if (!plan) {
    return '-';
  }

  return plan.displayName;
};

export const getOwnerStatusMeta = (status: AdminOwnerAccountStatus): BadgeMeta =>
  OWNER_STATUS_META[status];

export const getServiceStatusMeta = (status: AdminServiceStatus): BadgeMeta =>
  SERVICE_STATUS_META[status];

export const getSubscriptionStatusMeta = (status: AdminSubscriptionStatus): BadgeMeta =>
  SUBSCRIPTION_STATUS_META[status];
