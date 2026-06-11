import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';

import { publicBookingService } from '../services';

import { publicBookingQueryKeys } from './query-keys';

export const usePublicAvailableSlots = (
  slug: string | undefined,
  code: string | undefined,
  selectedDate: string | null,
) =>
  useQuery<string[], ProblemDetails>({
    queryKey: publicBookingQueryKeys.availableSlots(slug, code, selectedDate),
    queryFn: () => publicBookingService.getAvailableSlots(slug!, code!, selectedDate!),
    enabled: Boolean(slug && code && selectedDate),
    staleTime: 0,
  });
