import { formatDateOnly } from 'shared/utils';
import { ServiceTypeFieldType } from 'shared/models';

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

const SERVICE_TYPE_FIELD_TYPE_LABELS: Record<ServiceTypeFieldType, string> = {
  [ServiceTypeFieldType.Text]: 'Texto',
  [ServiceTypeFieldType.MultilineText]: 'Texto largo',
  [ServiceTypeFieldType.Number]: 'Numero',
  [ServiceTypeFieldType.Date]: 'Fecha',
  [ServiceTypeFieldType.Select]: 'Seleccion',
  [ServiceTypeFieldType.Checkbox]: 'Booleano',
};

export const ADMIN_SERVICE_TYPE_FIELD_TYPE_OPTIONS = [
  { value: String(ServiceTypeFieldType.Text), label: 'Texto' },
  { value: String(ServiceTypeFieldType.Number), label: 'Numero' },
  { value: String(ServiceTypeFieldType.Checkbox), label: 'Booleano' },
];

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

export const getServiceTypeFieldTypeLabel = (fieldType: number) =>
  SERVICE_TYPE_FIELD_TYPE_LABELS[fieldType as ServiceTypeFieldType] ?? 'Desconocido';
