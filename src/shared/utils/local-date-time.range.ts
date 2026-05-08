import { getCurrentBusinessDateOnly } from './local-date-time.business';
import { buildDateOnly } from './local-date-time.parts';
import { parseDateOnlyParts } from './local-date-time.parsers';
import { toDateOnlyDate } from './local-date-time.normalize';

export const getMonthDateOnlyRange = (visibleDate: string | null) => {
  const baseDate =
    parseDateOnlyParts(visibleDate) ?? parseDateOnlyParts(getCurrentBusinessDateOnly());

  if (!baseDate) {
    return {
      from: getCurrentBusinessDateOnly(),
      to: getCurrentBusinessDateOnly(),
    };
  }

  const lastDay = new Date(baseDate.year, baseDate.month, 0).getDate();

  return {
    from: buildDateOnly({ ...baseDate, day: 1 }),
    to: buildDateOnly({ ...baseDate, day: lastDay }),
  };
};

export const addDaysToDateOnly = (value?: string | null, days = 0) => {
  const date = toDateOnlyDate(value);

  if (!date) {
    return null;
  }

  date.setDate(date.getDate() + days);

  return buildDateOnly({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
};
