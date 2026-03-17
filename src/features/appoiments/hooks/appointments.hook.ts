import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useBusinessStore } from 'store/use-buisness-store';
import { appointmentService } from '../services';
import type { AppointmentDto } from 'shared/models/appointment-dto';
import type { ProblemDetails } from 'app/api';
import type { AppointmentFormValues } from '../schema';
import { mapAppointmentListToViewModel } from '../mapper/map-appointment-to-viewmodel';

export const useGetAppointments = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  return useQuery({
    queryKey: ['appointments', selectedService?.id],
    queryFn: () => appointmentService.getAppointmentsByService(selectedService!.id),
    enabled: !!selectedService,
    select: (response) => mapAppointmentListToViewModel(response),
  });
};

export const useCreateAppointment = () => {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const queryClient = useQueryClient();

  return useMutation<AppointmentDto, ProblemDetails, AppointmentFormValues>({
    mutationFn: (values) =>
      appointmentService.create({
        ...values,
        serviceId: selectedService!.id,
        startDateTime: values.startDateTime.toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments', selectedService?.id],
      });
    },
  });
};
