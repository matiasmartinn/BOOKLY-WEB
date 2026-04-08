import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { publicBookingService } from '../services';
import { publicBookingQueryKeys } from './query-keys';

export const usePublicAvailableSlots = (
  slug: string | undefined,
  token: string | undefined,
  selectedDate: string | null,
) =>
  useQuery<string[], ProblemDetails>({
    queryKey: publicBookingQueryKeys.availableSlots(slug, token, selectedDate),
    queryFn: () => publicBookingService.getAvailableSlots(slug!, token!, selectedDate!),
    enabled: Boolean(slug && token && selectedDate),
  });
