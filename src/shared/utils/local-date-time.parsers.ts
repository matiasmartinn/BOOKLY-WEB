import { getBusinessDateTimeParts } from './local-date-time.business';
import {
  isValidDateOnlyParts,
  isValidTimeOnlyParts,
  parseNumber,
} from './local-date-time.parts';
import type {
  DateOnlyParts,
  DateTimeParts,
  TimeOnlyParts,
} from './local-date-time.parts';

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_DATE_TIME_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,7})?)?$/;
const ZONED_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,7})?)?(?:Z|[+-]\d{2}:?\d{2})$/i;
const TIME_ONLY_REGEX = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export const parseDateOnlyParts = (value?: string | null): DateOnlyParts | null => {
  if (!value) {
    return null;
  }

  const match = value.trim().match(DATE_ONLY_REGEX);
  if (!match) {
    return null;
  }

  const parts: DateOnlyParts = {
    year: parseNumber(match[1]),
    month: parseNumber(match[2]),
    day: parseNumber(match[3]),
  };

  return isValidDateOnlyParts(parts) ? parts : null;
};

export const parseTimeOnlyParts = (value?: string | null): TimeOnlyParts | null => {
  if (!value) {
    return null;
  }

  const match = value.trim().match(TIME_ONLY_REGEX);
  if (!match) {
    return null;
  }

  const parts: TimeOnlyParts = {
    hour: parseNumber(match[1]),
    minute: parseNumber(match[2]),
    second: match[3] ? parseNumber(match[3]) : 0,
  };

  return isValidTimeOnlyParts(parts) ? parts : null;
};

export const parseLocalDateTimeParts = (value?: string | null): DateTimeParts | null => {
  if (!value) {
    return null;
  }

  const match = value.trim().match(LOCAL_DATE_TIME_REGEX);
  if (!match) {
    return null;
  }

  const parts: DateTimeParts = {
    year: parseNumber(match[1]),
    month: parseNumber(match[2]),
    day: parseNumber(match[3]),
    hour: parseNumber(match[4]),
    minute: parseNumber(match[5]),
    second: match[6] ? parseNumber(match[6]) : 0,
  };

  return isValidDateOnlyParts(parts) && isValidTimeOnlyParts(parts) ? parts : null;
};

const parseZonedDateTimeParts = (value?: string | null): DateTimeParts | null => {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!ZONED_DATE_TIME_REGEX.test(trimmedValue)) {
    return null;
  }

  const date = new Date(trimmedValue.replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : getBusinessDateTimeParts(date);
};

export const parseBusinessDateTimeParts = (value?: string | null) =>
  parseLocalDateTimeParts(value) ?? parseZonedDateTimeParts(value);

export const parseBusinessDateParts = (value?: string | null) =>
  parseDateOnlyParts(value) ?? parseBusinessDateTimeParts(value);
