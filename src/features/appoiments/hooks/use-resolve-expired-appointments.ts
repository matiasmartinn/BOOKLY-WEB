import { useMutation, useQueryClient } from '@tanstack/react-query';
import { normalizeUserRole } from 'app/layouts/dashboard-navigation';
import type { ProblemDetails } from 'app/api';
import { useEffect, useRef } from 'react';
import { useAuthStore } from 'store/use-auth-store';

import { appointmentService, type ResolveExpiredAppointmentsResultDto } from '../services';

import { appointmentQueryKeys } from './query-keys';

/**
 * Pide al backend resolver los turnos pendientes vencidos del owner
 * (la regla de negocio vive en la API) y refresca las queries de turnos
 * si algo cambio. Se ejecuta una sola vez por entrada a la pantalla,
 * solo para usuarios owner, y falla en silencio: la pantalla principal
 * no depende de este llamado.
 */
export const useResolveExpiredAppointments = () => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((s) => s.user);
  const isOwner = normalizeUserRole(authUser?.role) === 'owner';
  const hasRequestedRef = useRef(false);

  const { mutate } = useMutation<ResolveExpiredAppointmentsResultDto, ProblemDetails>({
    mutationFn: () => appointmentService.resolveExpired(),
    onSuccess: (result) => {
      if (result.resolvedAppointments > 0) {
        queryClient.invalidateQueries({ queryKey: appointmentQueryKeys.all() });
      }
    },
  });

  useEffect(() => {
    if (!isOwner || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    mutate();
  }, [isOwner, mutate]);
};
