import { isApiError } from 'app/api';
import { queryClient } from 'app/api/query-client';
import type { LoginRequest } from 'features/auth/login-form/login.schema';
import { authService, type AuthSession } from 'features/auth/services';
import type { UserModel } from 'shared/models';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useBusinessStore } from './use-business-store';

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

// El access token vive solo en memoria: lo unico que se persiste es el perfil
// del usuario, como pista para reintentar /auth/refresh al recargar la app.
function getPersistedAuthState(persistedState: unknown): Pick<AuthStore, 'user'> {
  const state = persistedState as Partial<AuthStore> | undefined;

  return {
    user: state?.user ?? null,
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
          if (!get().user) {
            get().clearSession();
            return;
          }

          await get().refreshSession();
        } catch (error) {
          // Solo descartar la sesion si el backend la rechazo explicitamente.
          // Ante error de red o 5xx se conserva el user persistido para que el
          // proximo reload reintente el refresh con la cookie.
          if (isApiError(error) && (error.status === 401 || error.status === 403)) {
            get().clearSession();
          }
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
      version: 4,
      partialize: (state) => ({
        user: state.user,
      }),
      migrate: getPersistedAuthState,
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...getPersistedAuthState(persistedState),
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!state || error) {
          // Rehidratacion fallida (storage corrupto/bloqueado): desbloquear la app
          // igual. queueMicrotask difiere la llamada porque este callback corre
          // sincronicamente durante create(), antes de que useAuthStore exista.
          queueMicrotask(() => useAuthStore.getState().finishHydration());
          return;
        }

        void state.restoreSession();
      },
    },
  ),
);
