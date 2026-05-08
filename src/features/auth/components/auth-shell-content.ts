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
    asideLines: ['Confirmacion', 'de email'],
  },
  'forgot-password': {
    id: 'forgot-password',
    asideLines: ['Recuperacion', 'de contrasena'],
  },
  'reset-password': {
    id: 'reset-password',
    asideLines: ['Recuperacion', 'de contrasena'],
  },
  'admin-invitation': {
    id: 'admin-invitation',
    asideLines: ['Invitacion', 'de administrador'],
  },
  'secretary-invitation': {
    id: 'secretary-invitation',
    asideLines: ['Invitacion', 'de secretario'],
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
