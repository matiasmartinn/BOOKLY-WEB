import type { UnavailabilityModel } from 'shared/models';

export interface UnavailabilityAdapter {
  id: number;
  startDate: Date;
  endDate: Date;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  isFullDay: boolean;
  dateLabel: string;
  timeLabel: string;
  totalDays: number;
}

const formatDate = (value: Date) => new Intl.DateTimeFormat('es-AR').format(value);

const getTotalDays = (startDate: Date, endDate: Date) =>
  Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1;

export const unavailabilityAdapter = (item: UnavailabilityModel): UnavailabilityAdapter => {
  const sameDay = item.startDate.getTime() === item.endDate.getTime();

  return {
    id: item.id,
    startDate: item.startDate,
    endDate: item.endDate,
    startTime: item.startTime,
    endTime: item.endTime,
    reason: item.reason,
    isFullDay: item.isFullDay,
    dateLabel: sameDay
      ? formatDate(item.startDate)
      : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`,
    timeLabel: item.isFullDay
      ? 'Todo el día'
      : `${item.startTime ?? '--:--'} - ${item.endTime ?? '--:--'}`,
    totalDays: getTotalDays(item.startDate, item.endDate),
  };
};

export const unavailabilityListAdapter = (items: UnavailabilityModel[]): UnavailabilityAdapter[] =>
  items.map(unavailabilityAdapter);
