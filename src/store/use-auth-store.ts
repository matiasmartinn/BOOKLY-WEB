import { authService } from 'features/auth/auth.service';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserModel } from 'shared/models';
import type { LoginRequest } from 'features/auth/login-form/login.schema';
import { useBusinessStore } from './use-buisness-store';

interface AuthStore {
  user: UserModel | null;
  isAuthenticated: boolean;
  login: (dto: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  // persist guarda user + isAuthenticated en localStorage bajo la clave 'auth'.
  // Al refrescar la página, Zustand rehidrata el store antes del primer render,
  // evitando el return null que dejaba la pantalla en blanco.
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (dto) => {
        const user = await authService.login(dto);
        set({ user, isAuthenticated: true });
        await useBusinessStore.getState().loadServices(user.id);
      },

      logout: () => {
        useBusinessStore.getState().clear();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth',
      // Solo persistimos los datos del usuario, no funciones ni estados de carga.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
