import {
  buildDateOnly,
  buildLocalDateTime,
  isValidDateOnlyParts,
  isValidTimeOnlyParts,
  parseNumber,
} from './local-date-time.parts';
import type { DateTimeParts } from './local-date-time.parts';

const BUSINESS_TIME_ZONE = 'America/Argentina/Buenos_Aires';

const businessNowFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export const getBusinessDateTimeParts = (date: Date): DateTimeParts | null => {
  const partMap = new Map(
    businessNowFormatter
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  const parts: DateTimeParts = {
    year: parseNumber(partMap.get('year') ?? '0'),
    month: parseNumber(partMap.get('month') ?? '0'),
    day: parseNumber(partMap.get('day') ?? '0'),
    hour: parseNumber(partMap.get('hour') ?? '0'),
    minute: parseNumber(partMap.get('minute') ?? '0'),
    second: parseNumber(partMap.get('second') ?? '0'),
  };

  return isValidDateOnlyParts(parts) && isValidTimeOnlyParts(parts) ? parts : null;
};

const getBusinessNowParts = (): DateTimeParts =>
  getBusinessDateTimeParts(new Date()) ?? {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  };

export const getCurrentBusinessDateOnly = () => buildDateOnly(getBusinessNowParts());

export const getCurrentBusinessDateTime = () => buildLocalDateTime(getBusinessNowParts());
