import { PATHS } from 'app/router/PATHS';
import { SecretaryPermission, type BusinessDto, type UserModel } from 'shared/models';

import type { SidebarPermissions, UserRole } from './components/dashboard-sidebar';

type DashboardUser = Pick<UserModel, 'id' | 'role'> | null;

export interface ServicePermissions {
  viewAppointments: boolean;
  createAppointments: boolean;
  editAppointments: boolean;
  cancelAppointments: boolean;
  rescheduleAppointments: boolean;
  markAttendance: boolean;
  manageSchedules: boolean;
}

const ACCOUNT_PATHS = new Set<string>([
  PATHS.dashboard.account,
  PATHS.dashboard.profile,
  PATHS.dashboard.settings,
]);

const ADMIN_PATHS = new Set<string>([
  PATHS.dashboard.adminOverview,
  PATHS.dashboard.adminOwners,
  PATHS.dashboard.adminServices,
  PATHS.dashboard.adminServiceTypes,
]);

// Devuelve null ante un rol desconocido o ausente: la sesion se considera
// invalida y los guards la cierran, nunca se asume un rol por defecto.
export function normalizeUserRole(role?: string): UserRole | null {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'owner') {
    return 'owner';
  }

  if (normalizedRole === 'secretary') {
    return 'secretary';
  }

  if (normalizedRole === 'admin') {
    return 'admin';
  }

  return null;
}

// React Router matchea rutas sin distinguir mayusculas ni trailing slash;
// toda comparacion contra PATHS debe hacerse sobre el pathname normalizado.
function normalizePathname(pathname: string): string {
  const normalized = pathname.toLowerCase().replace(/\/+$/, '');
  return normalized === '' ? '/' : normalized;
}

export function buildServicePermissions(
  user: DashboardUser,
  selectedService: BusinessDto | null,
): ServicePermissions {
  const role = normalizeUserRole(user?.role);

  if (role === null) {
    return {
      viewAppointments: false,
      createAppointments: false,
      editAppointments: false,
      cancelAppointments: false,
      rescheduleAppointments: false,
      markAttendance: false,
      manageSchedules: false,
    };
  }

  if (role === 'owner') {
    return {
      viewAppointments: true,
      createAppointments: true,
      editAppointments: true,
      cancelAppointments: true,
      rescheduleAppointments: true,
      markAttendance: true,
      manageSchedules: true,
    };
  }

  if (role === 'admin') {
    return {
      viewAppointments: false,
      createAppointments: false,
      editAppointments: false,
      cancelAppointments: false,
      rescheduleAppointments: false,
      markAttendance: false,
      manageSchedules: false,
    };
  }

  const grantedPermissions =
    selectedService?.secretaryPermissions.find((item) => item.secretaryId === user?.id)
      ?.permissions ?? [];

  return {
    viewAppointments: grantedPermissions.includes(SecretaryPermission.ViewAppointments),
    createAppointments: grantedPermissions.includes(SecretaryPermission.CreateAppointments),
    editAppointments: grantedPermissions.includes(SecretaryPermission.EditAppointments),
    cancelAppointments: grantedPermissions.includes(SecretaryPermission.CancelAppointments),
    rescheduleAppointments: grantedPermissions.includes(SecretaryPermission.RescheduleAppointments),
    markAttendance: grantedPermissions.includes(SecretaryPermission.MarkAttendance),
    manageSchedules: grantedPermissions.includes(SecretaryPermission.ManageSchedules),
  };
}

export function buildSidebarPermissions(
  user: DashboardUser,
  selectedService: BusinessDto | null,
): SidebarPermissions {
  const role = normalizeUserRole(user?.role);

  if (role === null) {
    return {
      viewAppointments: false,
      viewSchedules: false,
      viewService: false,
      viewUnavailability: false,
      viewStatus: false,
      viewTeam: false,
      viewSettings: false,
    };
  }

  if (role === 'owner') {
    return {
      viewAppointments: true,
      viewSchedules: true,
      viewService: true,
      viewUnavailability: true,
      viewStatus: true,
      viewTeam: true,
      viewSettings: true,
    };
  }

  if (role === 'admin') {
    return {
      viewAppointments: false,
      viewSchedules: false,
      viewService: false,
      viewUnavailability: false,
      viewStatus: false,
      viewTeam: false,
      viewSettings: true,
    };
  }

  const servicePermissions = buildServicePermissions(user, selectedService);
  const canManageSchedules = servicePermissions.manageSchedules;
  const canViewAppointments = servicePermissions.viewAppointments;

  return {
    viewAppointments: canViewAppointments,
    viewSchedules: canManageSchedules,
    viewService: false,
    viewUnavailability: canManageSchedules,
    viewStatus: false,
    viewTeam: false,
    viewSettings: true,
  };
}

export function getDefaultDashboardPath(role: UserRole, permissions: SidebarPermissions): string {
  if (!hasFunctionalDashboardAccess(role, permissions)) {
    return PATHS.dashboard.welcome;
  }

  if (role === 'owner') {
    return PATHS.dashboard.overview;
  }

  if (role === 'admin') {
    return PATHS.dashboard.adminOverview;
  }

  if (role === 'secretary') {
    if (permissions.viewAppointments) {
      return PATHS.dashboard.appointments;
    }

    if (permissions.viewSchedules) {
      return PATHS.dashboard.schedules;
    }

    if (permissions.viewUnavailability) {
      return PATHS.dashboard.unavailability;
    }
  }

  return PATHS.dashboard.account;
}

export function resolveDashboardPath(
  pathname: string,
  role: UserRole,
  permissions: SidebarPermissions,
): string {
  const normalizedPath = normalizePathname(pathname);
  const defaultPath = getDefaultDashboardPath(role, permissions);

  if (normalizedPath === PATHS.dashboard.overview) {
    return defaultPath;
  }

  if (canAccessDashboardPath(normalizedPath, role, permissions)) {
    return normalizedPath;
  }

  return defaultPath;
}

export function hasFunctionalDashboardAccess(
  role: UserRole,
  permissions: SidebarPermissions,
): boolean {
  if (role === 'owner' || role === 'admin') {
    return true;
  }

  return (
    permissions.viewAppointments ||
    permissions.viewSchedules ||
    permissions.viewUnavailability
  );
}

export function canAccessDashboardPath(
  pathname: string,
  role: UserRole,
  permissions: SidebarPermissions,
): boolean {
  const normalizedPath = normalizePathname(pathname);

  if (normalizedPath === PATHS.dashboard.welcome) {
    return !hasFunctionalDashboardAccess(role, permissions);
  }

  if (ACCOUNT_PATHS.has(normalizedPath)) {
    return permissions.viewSettings;
  }

  if (ADMIN_PATHS.has(normalizedPath)) {
    return role === 'admin';
  }

  if (role === 'owner') {
    return true;
  }

  if (role === 'admin') {
    return ADMIN_PATHS.has(normalizedPath);
  }

  switch (normalizedPath) {
    case PATHS.dashboard.appointments:
      return permissions.viewAppointments;
    case PATHS.dashboard.schedules:
      return permissions.viewSchedules;
    case PATHS.dashboard.unavailability:
      return permissions.viewUnavailability;
    default:
      return false;
  }
}
