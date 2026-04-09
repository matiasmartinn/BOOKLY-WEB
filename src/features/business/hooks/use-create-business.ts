import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessDto } from 'shared/models';

import type { CreateBusinessFormValues } from '../business-wizard/schema';
import { businessService } from '../services/business.service';

export interface CreateBusinessPayload extends CreateBusinessFormValues {
  ownerId: number;
  slug?: string;
  placeName?: string;
  address?: string;
  googleMapsUrl?: string;
}

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();

  return useMutation<BusinessDto, ProblemDetails, CreateBusinessPayload>({
    mutationFn: (payload) =>
      businessService.create({
        name: payload.name,
        ownerId: payload.ownerId,
        description: payload.description,
        placeName: payload.placeName,
        address: payload.address,
        googleMapsUrl: payload.googleMapsUrl,
        slug: payload.slug,
        serviceTypeId: payload.serviceTypeId!,
        durationMinutes: payload.durationMinutes!,
        capacity: payload.schedules?.[0]?.capacity ?? 1,
        price: payload.price,
        schedules: payload.schedules ?? [],
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
};
