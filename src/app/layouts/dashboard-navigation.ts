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
]);

export function normalizeUserRole(role?: string): UserRole {
  const normalizedRole = role?.trim().toLowerCase();

  if (normalizedRole === 'secretary') {
    return 'secretary';
  }

  if (normalizedRole === 'admin') {
    return 'admin';
  }

  return 'owner';
}

export function buildServicePermissions(
  user: DashboardUser,
  selectedService: BusinessDto | null,
): ServicePermissions {
  const role = normalizeUserRole(user?.role);

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
    selectedService?.secretaryPermissions.find((item) => item.secretaryId === user?.id)?.permissions ??
    [];

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
  const canViewAppointments = Object.entries(servicePermissions).some(([key, granted]) =>
    key !== 'manageSchedules' && granted,
  );

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

export function canAccessDashboardPath(
  pathname: string,
  role: UserRole,
  permissions: SidebarPermissions,
): boolean {
  if (ACCOUNT_PATHS.has(pathname)) {
    return permissions.viewSettings;
  }

  if (ADMIN_PATHS.has(pathname)) {
    return role === 'admin';
  }

  if (role === 'owner') {
    return true;
  }

  if (role === 'admin') {
    return ADMIN_PATHS.has(pathname);
  }

  switch (pathname) {
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
