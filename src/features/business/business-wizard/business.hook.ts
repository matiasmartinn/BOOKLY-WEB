import { useMutation } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { BusinessModel } from 'shared/models';
import { businessService } from '../business.service';
import type { CreateBusinessFormValues } from './schema';

export interface CreateBusinessPayload extends CreateBusinessFormValues {
  ownerId: number;
  slug: string;
}

export const useCreateBusiness = () => {
  return useMutation<BusinessModel, ProblemDetails, CreateBusinessPayload>({
    mutationFn: businessService.create,
  });
};
