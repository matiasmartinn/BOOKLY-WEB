import { useQuery } from '@tanstack/react-query';
import { useBusinessStore } from 'store/use-business-store';

import { mapAppointmentListToViewModel } from '../mapper/map-appointment-to-viewmodel';
import { appointmentService } from '../services';

import { appointmentQueryKeys } from './query-keys';

export const useGetAppointments = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useQuery({
    queryKey: appointmentQueryKeys.byService(selectedService?.id),
    queryFn: () => appointmentService.getByService(selectedService!.id),
    enabled: !!selectedService,
    staleTime: 0,
    select: (appointments) =>
      mapAppointmentListToViewModel(
        appointments,
        selectedService?.allowsExtraFields ? selectedService.fieldDefinitions : [],
      ),
  });
};
