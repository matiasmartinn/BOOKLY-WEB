import type { UnavailabilityDto } from 'shared/models';
import type { UnavailabilityViewModel } from '../viewmodel';
import { formatDateOnly, getDateOnlyRangeDays, isSameDateOnly } from 'shared/utils';

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
      ? formatDateOnly(item.startDate)
      : `${formatDateOnly(item.startDate)} - ${formatDateOnly(item.endDate)}`,
    timeLabel: item.isFullDay
      ? 'Todo el día'
      : `${item.startTime ?? '--:--'} - ${item.endTime ?? '--:--'}`,
    totalDays: getDateOnlyRangeDays(item.startDate, item.endDate),
  };
};

export const mapUnavailabilityListToViewModel = (
  items: UnavailabilityDto[],
): UnavailabilityViewModel[] => items.map(mapUnavailabilityToViewModel);
