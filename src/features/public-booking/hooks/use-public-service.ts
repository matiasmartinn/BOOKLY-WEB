import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { publicBookingService } from '../services';
import type { PublicServiceBookingDto } from '../types/public-booking';
import { publicBookingQueryKeys } from './query-keys';

export const usePublicService = (slug?: string, token?: string) =>
  useQuery<PublicServiceBookingDto, ProblemDetails>({
    queryKey: publicBookingQueryKeys.service(slug, token),
    queryFn: () => publicBookingService.getService(slug!, token!),
    enabled: Boolean(slug && token),
  });
