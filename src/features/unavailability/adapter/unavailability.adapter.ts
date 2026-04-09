import type { UnavailabilityDto } from 'shared/models';
import { formatLocalDateOnlyRange, getDateOnlyRangeDays, isSameDateOnly } from 'shared/utils';

import type { UnavailabilityViewModel } from '../viewmodel';

export const mapUnavailabilityToViewModel = (item: UnavailabilityDto): UnavailabilityViewModel => {
  const sameDay = isSameDateOnly(item.startDate, item.endDate);

  return {
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    startTime: item.startTime,
    endTime: item.endTime,
    reason: item.reason,
    isFullDay: item.isFullDay,
    dateLabel: sameDay
      ? formatLocalDateOnlyRange(item.startDate, item.endDate)
      : formatLocalDateOnlyRange(item.startDate, item.endDate, { separator: ' - ' }),
    timeLabel: item.isFullDay
      ? 'Todo el día'
      : `${item.startTime ?? '--:--'} - ${item.endTime ?? '--:--'}`,
    totalDays: getDateOnlyRangeDays(item.startDate, item.endDate),
  };
};

export const mapUnavailabilityListToViewModel = (
  items: UnavailabilityDto[],
): UnavailabilityViewModel[] => items.map(mapUnavailabilityToViewModel);
