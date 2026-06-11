import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { getMonthDateOnlyRange } from 'shared/utils';

import { publicBookingService } from '../services';

import { publicBookingQueryKeys } from './query-keys';

export const usePublicAvailableDates = (
  slug: string | undefined,
  code: string | undefined,
  visibleDate: string | null,
) => {
  const { from, to } = getMonthDateOnlyRange(visibleDate);

  return useQuery<string[], ProblemDetails>({
    queryKey: publicBookingQueryKeys.availableDates(slug, code, from, to),
    queryFn: () => publicBookingService.getAvailableDates(slug!, code!, from, to),
    enabled: Boolean(slug && code),
    staleTime: 0,
  });
};
