import { Center, Loader } from '@mantine/core';
import {
  buildSidebarPermissions,
  canAccessDashboardPath,
  getDefaultDashboardPath,
  normalizeUserRole,
} from 'app/layouts/dashboard-navigation';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

import { PATHS } from './PATHS';


function AuthGuardFallback() {
  return (
    <Center mih="100dvh">
      <Loader size="sm" />
    </Center>
  );
}

export function RequireAuth() {
  const location = useLocation();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.auth.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RequireOwner() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={PATHS.auth.login} replace />;
  }

  if (normalizeUserRole(user.role) !== 'owner') {
    return <Navigate to={PATHS.dashboard.overview} replace />;
  }

  return <Outlet />;
}

export function RequireDashboardAccess() {
  const location = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const { selectedService, initialized, isLoading, loadServices } = useBusinessStore();

  useEffect(() => {
    if (authUser && !initialized && !isLoading) {
      void loadServices(authUser);
    }
  }, [authUser, initialized, isLoading, loadServices]);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated || !authUser) {
    return <Navigate to={PATHS.auth.login} replace state={{ from: location }} />;
  }

  if (!initialized) {
    return <AuthGuardFallback />;
  }

  const role = normalizeUserRole(authUser.role);
  const permissions = buildSidebarPermissions(authUser, selectedService);
  const defaultPath = getDefaultDashboardPath(role, permissions);
  const isAllowedPath = canAccessDashboardPath(location.pathname, role, permissions);

  if (location.pathname === PATHS.dashboard.overview && role !== 'owner') {
    return <Navigate to={defaultPath} replace />;
  }

  if (!isAllowedPath) {
    return <Navigate to={defaultPath} replace />;
  }

  return <Outlet />;
}

export function RequireGuest() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.dashboard.overview} replace />;
  }

  return <Outlet />;
}
