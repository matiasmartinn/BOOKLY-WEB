import {
  buildDateOnly,
  buildLocalDateTime,
  buildNativeDate,
  buildTimeOnly,
} from './local-date-time.parts';
import {
  parseBusinessDateParts,
  parseBusinessDateTimeParts,
  parseLocalDateTimeParts,
  parseTimeOnlyParts,
} from './local-date-time.parsers';

export const normalizeDateOnly = (value?: string | null) => {
  const parts = parseBusinessDateParts(value);
  return parts ? buildDateOnly(parts) : null;
};

export const toDateOnlyDate = (value?: string | null) => {
  const parts = parseBusinessDateParts(value);
  return parts ? buildNativeDate(parts) : null;
};

export const normalizeLocalDateTime = (value?: string | null) => {
  const parts = parseBusinessDateTimeParts(value);
  return parts ? buildLocalDateTime(parts) : null;
};

export const normalizeBusinessLocalDateTime = (value?: string | null) => {
  const parts = parseLocalDateTimeParts(value);
  return parts ? buildLocalDateTime(parts) : null;
};

export const extractDateOnly = (value?: string | null) => normalizeDateOnly(value);

export const extractTimeOnly = (value?: string | null, includeSeconds = false) => {
  const dateTimeParts = parseBusinessDateTimeParts(value);
  if (dateTimeParts) {
    return buildTimeOnly(dateTimeParts, includeSeconds);
  }

  const timeParts = parseTimeOnlyParts(value);
  return timeParts ? buildTimeOnly(timeParts, includeSeconds) : null;
};
