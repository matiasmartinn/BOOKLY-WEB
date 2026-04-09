import type { ProblemDetails } from 'app/api';

import type {
  PublicBookingProblemState,
  PublicBookingTerminalState,
} from '../types/public-booking';

const INVALID_ACCESS_DETAIL = 'Acceso publico invalido o inexistente.';
const SERVICE_INACTIVE_DETAIL = 'El servicio compartido no se encuentra activo.';
const PUBLIC_BOOKING_DISABLED_DETAIL = 'El acceso publico para este servicio esta deshabilitado.';

const publicBookingProblems: Record<
  PublicBookingTerminalState,
  Omit<PublicBookingProblemState, 'kind'>
> = {
  'invalid-access': {
    title: 'Este enlace no es valido',
    description: 'El enlace de reserva no existe o ya no esta disponible.',
    supportingText:
      'Si recibiste este enlace del propietario del servicio, pedile que lo revise o que te comparta uno nuevo.',
  },
  'service-inactive': {
    title: 'Este servicio no esta disponible',
    description: 'El servicio compartido no se encuentra activo en este momento.',
    supportingText: 'Contacta al propietario para mas informacion.',
  },
  'public-booking-disabled': {
    title: 'Las reservas online no estan habilitadas',
    description:
      'Este servicio existe, pero actualmente no acepta reservas desde enlace publico.',
    supportingText: 'Contacta al propietario si necesitas reservar.',
  },
};

export const getPublicBookingProblemState = (
  kind: PublicBookingTerminalState,
): PublicBookingProblemState => ({
  kind,
  ...publicBookingProblems[kind],
});

export const resolvePublicBookingProblemState = (
  problem?: ProblemDetails | null,
): PublicBookingProblemState | null => {
  const detail = problem?.detail?.trim();

  if (!problem || !detail) {
    return null;
  }

  if (problem.status === 404 && detail === INVALID_ACCESS_DETAIL) {
    return getPublicBookingProblemState('invalid-access');
  }

  if (problem.status === 409 && detail === SERVICE_INACTIVE_DETAIL) {
    return getPublicBookingProblemState('service-inactive');
  }

  if (problem.status === 409 && detail === PUBLIC_BOOKING_DISABLED_DETAIL) {
    return getPublicBookingProblemState('public-booking-disabled');
  }

  return null;
};
