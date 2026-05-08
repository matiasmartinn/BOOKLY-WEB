import { toDateOnlyDate } from './local-date-time.normalize';

export const getDateOnlyRangeDays = (startDate: string, endDate: string) => {
  const start = toDateOnlyDate(startDate);
  const end = toDateOnlyDate(endDate);

  if (!start || !end) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
};
