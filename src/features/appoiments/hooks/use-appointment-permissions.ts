import { buildServicePermissions } from 'app/layouts/dashboard-navigation';
import { useMemo } from 'react';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

export const useAppointmentPermissions = () => {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useMemo(() => {
    const servicePermissions = buildServicePermissions(authUser, selectedService);

    return {
      canViewAppointments: servicePermissions.viewAppointments,
      canCreateAppointments: servicePermissions.createAppointments,
      actionPermissions: {
        canEdit: servicePermissions.editAppointments,
        canReschedule: servicePermissions.rescheduleAppointments,
        canCancel: servicePermissions.cancelAppointments,
        canMarkAttendance: servicePermissions.markAttendance,
      },
    };
  }, [authUser, selectedService]);
};
