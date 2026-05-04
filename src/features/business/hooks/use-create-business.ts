import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto } from 'shared/models';

import type { CreateBusinessFormValues } from '../business-wizard/schema';
import { businessService } from '../services/business.service';

export interface CreateBusinessPayload extends CreateBusinessFormValues {
  ownerId: number;
  slug?: string;
  phoneNumber?: string;
  placeName?: string;
  address?: string;
}

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, CreateBusinessPayload>({
    mutationFn: (payload) => {
      const scheduleCapacity = Math.max(
        1,
        ...(payload.schedules ?? []).map((schedule) => schedule.capacity ?? 1),
      );

      return businessService.create({
        name: payload.name,
        ownerId: payload.ownerId,
        description: payload.description,
        phoneNumber: payload.phoneNumber,
        placeName: payload.placeName,
        address: payload.address,
        slug: payload.slug,
        serviceTypeId: payload.serviceTypeId!,
        durationMinutes: payload.durationMinutes!,
        capacity: scheduleCapacity,
        price: payload.price,
        schedules: payload.schedules ?? [],
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
