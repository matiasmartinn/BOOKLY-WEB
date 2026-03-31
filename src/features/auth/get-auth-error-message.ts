import { isApiError } from 'app/api';

export function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (isApiError(error)) {
    if (error.status === 0) {
      return 'No pudimos conectar con el servidor. Verifica tu conexion e intenta nuevamente.';
    }

    return error.detail || fallbackMessage;
  }

  return fallbackMessage;
}
