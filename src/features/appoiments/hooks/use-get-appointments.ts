import { useQuery } from '@tanstack/react-query';
import { useBusinessStore } from 'store/use-business-store';

import { mapAppointmentListToViewModel } from '../mapper/map-appointment-to-viewmodel';
import { appointmentService } from '../services';

export const useGetAppointments = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);

  return useQuery({
    queryKey: ['appointments', selectedService?.id],
    queryFn: () => appointmentService.getByService(selectedService!.id),
    enabled: !!selectedService,
    select: (appointments) =>
      mapAppointmentListToViewModel(
        appointments,
        selectedService?.allowsExtraFields ? selectedService.fieldDefinitions : [],
      ),
  });
};
