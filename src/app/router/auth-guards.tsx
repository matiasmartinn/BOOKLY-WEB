import { Center, Loader } from '@mantine/core';
import {
  buildSidebarPermissions,
  normalizeUserRole,
  resolveDashboardPath,
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

  const role = user ? normalizeUserRole(user.role) : null;
  const hasInvalidRole = hasHydrated && isAuthenticated && Boolean(user) && role === null;

  useEffect(() => {
    if (hasInvalidRole) {
      useAuthStore.getState().clearSession();
    }
  }, [hasInvalidRole]);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={PATHS.auth.login} replace />;
  }

  if (hasInvalidRole) {
    // Rol desconocido: la sesion se esta limpiando; el proximo render redirige a login.
    return <AuthGuardFallback />;
  }

  if (role !== 'owner') {
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

  const role = authUser ? normalizeUserRole(authUser.role) : null;
  const hasInvalidRole = hasHydrated && isAuthenticated && Boolean(authUser) && role === null;

  useEffect(() => {
    if (authUser && !initialized && !isLoading) {
      void loadServices(authUser);
    }
  }, [authUser, initialized, isLoading, loadServices]);

  useEffect(() => {
    if (hasInvalidRole) {
      useAuthStore.getState().clearSession();
    }
  }, [hasInvalidRole]);

  if (!hasHydrated) {
    return <AuthGuardFallback />;
  }

  if (!isAuthenticated || !authUser) {
    return <Navigate to={PATHS.auth.login} replace state={{ from: location }} />;
  }

  if (role === null) {
    // Rol desconocido: la sesion se esta limpiando; el proximo render redirige a login.
    return <AuthGuardFallback />;
  }

  if (!initialized) {
    return <AuthGuardFallback />;
  }

  const permissions = buildSidebarPermissions(authUser, selectedService);
  const resolvedPath = resolveDashboardPath(location.pathname, role, permissions);

  if (resolvedPath !== location.pathname) {
    return <Navigate to={resolvedPath} replace />;
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
