import { PATHS } from 'app/router';

export type AuthViewId =
  | 'login'
  | 'register'
  | 'confirm-email'
  | 'forgot-password'
  | 'reset-password'
  | 'admin-invitation'
  | 'secretary-invitation'
  | 'secretary-password-form';

export interface AuthViewContent {
  id: AuthViewId;
  asideLines: [string, string];
}

const AUTH_VIEW_CONTENT: Record<AuthViewId, AuthViewContent> = {
  login: {
    id: 'login',
    asideLines: ['Volve a tu agenda.', 'Todo en orden.'],
  },
  register: {
    id: 'register',
    asideLines: ['Empeza simple.', 'Escala ordenado.'],
  },
  'confirm-email': {
    id: 'confirm-email',
    asideLines: ['Confirma tu cuenta.', 'Segui sin friccion.'],
  },
  'forgot-password': {
    id: 'forgot-password',
    asideLines: ['Recupera acceso.', 'Sin friccion.'],
  },
  'reset-password': {
    id: 'reset-password',
    asideLines: ['Cambia tu clave.', 'Entra otra vez.'],
  },
  'admin-invitation': {
    id: 'admin-invitation',
    asideLines: ['Activa tu acceso.', 'Entra al panel.'],
  },
  'secretary-invitation': {
    id: 'secretary-invitation',
    asideLines: ['Activa tu acceso.', 'Entra al equipo.'],
  },
  'secretary-password-form': {
    id: 'secretary-password-form',
    asideLines: ['Define tu clave.', 'Entra al equipo.'],
  },
};

export function resolveAuthViewContent(pathname: string): AuthViewContent {
  switch (pathname) {
    case PATHS.auth.register:
      return AUTH_VIEW_CONTENT.register;
    case PATHS.auth.confirmEmail:
      return AUTH_VIEW_CONTENT['confirm-email'];
    case PATHS.auth.forgotPassword:
      return AUTH_VIEW_CONTENT['forgot-password'];
    case PATHS.auth.resetPassword:
      return AUTH_VIEW_CONTENT['reset-password'];
    case PATHS.auth.adminInvitation:
      return AUTH_VIEW_CONTENT['admin-invitation'];
    case PATHS.auth.secretaryInvitation:
      return AUTH_VIEW_CONTENT['secretary-invitation'];
    case PATHS.auth.secretarySetup:
      return AUTH_VIEW_CONTENT['secretary-password-form'];
    case PATHS.auth.login:
    default:
      return AUTH_VIEW_CONTENT.login;
  }
}
