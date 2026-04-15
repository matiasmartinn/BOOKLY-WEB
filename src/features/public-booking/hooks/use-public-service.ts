import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { publicBookingService } from '../services';
import type { PublicServiceBookingDto } from '../types/public-booking';

import { publicBookingQueryKeys } from './query-keys';

export const usePublicService = (slug?: string, code?: string) =>
  useQuery<PublicServiceBookingDto, ProblemDetails>({
    queryKey: publicBookingQueryKeys.service(slug, code),
    queryFn: () => publicBookingService.getService(slug!, code!),
    enabled: Boolean(slug && code),
  });
