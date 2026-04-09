import { queryClient } from 'app/api/query-client';
import type { LoginRequest } from 'features/auth/login-form/login.schema';
import { authService, type AuthSession } from 'features/auth/services';
import type { UserModel } from 'shared/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useBusinessStore } from './use-buisness-store';

interface AuthStore {
  session: AuthSession | null;
  user: UserModel | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (dto: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<AuthSession | null>;
  clearSession: () => void;
  setUser: (user: UserModel | null) => void;
  finishHydration: () => void;
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
        const refreshToken = get().session?.refreshToken;

        try {
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } finally {
          get().clearSession();
        }
      },

      refreshSession: async () => {
        const currentRefreshToken = get().session?.refreshToken;

        if (!currentRefreshToken) {
          get().clearSession();
          return null;
        }

        const authResult = await authService.refreshSession(currentRefreshToken);

        set({
          session: authResult.session,
          user: authResult.user,
          isAuthenticated: true,
        });

        return authResult.session;
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
      version: 2,
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persistedState, version) => {
        if (version !== 2) {
          return {
            session: null,
            user: null,
            isAuthenticated: false,
          };
        }

        const state = persistedState as Partial<AuthStore> | undefined;
        const hasValidSession = Boolean(state?.session && state.user);

        return {
          session: hasValidSession ? state?.session ?? null : null,
          user: hasValidSession ? state?.user ?? null : null,
          isAuthenticated: hasValidSession,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.finishHydration();
      },
    },
  ),
);
