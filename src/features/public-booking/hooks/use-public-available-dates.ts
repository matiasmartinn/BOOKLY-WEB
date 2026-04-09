import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import { getMonthDateOnlyRange } from 'shared/utils';

import { publicBookingService } from '../services';

import { publicBookingQueryKeys } from './query-keys';

export const usePublicAvailableDates = (
  slug: string | undefined,
  token: string | undefined,
  visibleDate: string | null,
) => {
  const { from, to } = getMonthDateOnlyRange(visibleDate);

  return useQuery<string[], ProblemDetails>({
    queryKey: publicBookingQueryKeys.availableDates(slug, token, from, to),
    queryFn: () => publicBookingService.getAvailableDates(slug!, token!, from, to),
    enabled: Boolean(slug && token),
  });
};
