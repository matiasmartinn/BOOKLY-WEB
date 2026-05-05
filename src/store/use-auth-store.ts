import { queryClient } from 'app/api/query-client';
import type { LoginRequest } from 'features/auth/login-form/login.schema';
import { authService, type AuthSession } from 'features/auth/services';
import type { UserModel } from 'shared/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useBusinessStore } from './use-business-store';

function isAccessTokenExpired(session: AuthSession | null): boolean {
  if (!session?.accessTokenExpiresAt) {
    return true;
  }

  const expiresAt = Date.parse(session.accessTokenExpiresAt);
  return Number.isNaN(expiresAt) || expiresAt <= Date.now();
}

type LegacyAuthSession = AuthSession & { refreshToken?: string };

interface AuthStore {
  session: AuthSession | null;
  user: UserModel | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (dto: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
  restoreSession: () => Promise<void>;
  clearSession: () => void;
  setUser: (user: UserModel | null) => void;
  finishHydration: () => void;
}

function sanitizeAuthSession(session: LegacyAuthSession | null | undefined): AuthSession | null {
  if (!session) {
    return null;
  }

  const sanitizedSession = { ...session };
  delete sanitizedSession.refreshToken;
  return sanitizedSession;
}

function getPersistedAuthState(
  persistedState: unknown,
): Pick<AuthStore, 'session' | 'user' | 'isAuthenticated'> {
  const state = persistedState as Partial<AuthStore> | undefined;
  const session = sanitizeAuthSession(state?.session as LegacyAuthSession | null | undefined);
  const user = state?.user ?? null;
  const hasValidSession = Boolean(session && user);

  return {
    session: hasValidSession ? session : null,
    user: hasValidSession ? user : null,
    isAuthenticated: hasValidSession,
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      user: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: async (dto) => {
        const authResult = await authService.login(dto);

        queryClient.clear();
        useBusinessStore.getState().clear();

        set({
          session: authResult.session,
          user: authResult.user,
          isAuthenticated: true,
        });

        await useBusinessStore.getState().loadServices(authResult.user);
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          get().clearSession();
        }
      },

      refreshSession: async () => {
        const authResult = await authService.refreshSession();

        set({
          session: authResult.session,
          user: authResult.user,
          isAuthenticated: true,
        });

        return authResult.session;
      },

      restoreSession: async () => {
        try {
          const { session, user } = get();

          if (!session || !user) {
            get().clearSession();
            return;
          }

          if (!isAccessTokenExpired(session)) {
            set({ isAuthenticated: true });
            return;
          }

          const refreshedSession = await get().refreshSession();
          if (!refreshedSession) {
            get().clearSession();
          }
        } catch {
          get().clearSession();
        } finally {
          get().finishHydration();
        }
      },

      clearSession: () => {
        queryClient.clear();
        useBusinessStore.getState().clear();
        set({
          session: null,
          user: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => {
        if (!user) {
          get().clearSession();
          return;
        }

        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
              }
            : null,
          user,
          isAuthenticated: Boolean(user && state.session),
        }));
      },

      finishHydration: () => {
        set({ hasHydrated: true });
      },
    }),
    {
      name: 'auth',
      version: 3,
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: getPersistedAuthState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...getPersistedAuthState(persistedState),
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        void state.restoreSession();
      },
    },
  ),
);
