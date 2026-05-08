import { compareDateOnly } from './local-date-time.compare';
import { extractTimeOnly } from './local-date-time.normalize';
import { pad2 } from './local-date-time.parts';
import { parseBusinessDateParts } from './local-date-time.parsers';

const SHORT_MONTH_LABELS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

export const formatLocalDateOnly = (value?: string | null) => {
  const parts = parseBusinessDateParts(value);

  if (!parts) {
    return value ?? '';
  }

  return `${pad2(parts.day)}/${pad2(parts.month)}/${parts.year}`;
};

export const formatShortLocalDateOnly = (value?: string | null) => {
  const parts = parseBusinessDateParts(value);
  return parts ? `${pad2(parts.day)} ${SHORT_MONTH_LABELS[parts.month - 1]}` : value ?? '';
};

export const formatLongLocalDateOnly = (value?: string | null) => {
  const parts = parseBusinessDateParts(value);
  return parts
    ? `${pad2(parts.day)} ${SHORT_MONTH_LABELS[parts.month - 1]} ${parts.year}`
    : value ?? '';
};

export const formatLocalDateOnlyRange = (
  start?: string | null,
  end?: string | null,
  options?: { separator?: string; collapseSameDay?: boolean },
) => {
  const startLabel = formatLocalDateOnly(start);
  const endLabel = formatLocalDateOnly(end);

  if (!startLabel) {
    return endLabel;
  }

  if (!endLabel) {
    return startLabel;
  }

  if ((options?.collapseSameDay ?? true) && compareDateOnly(start, end) === 0) {
    return startLabel;
  }

  return `${startLabel}${options?.separator ?? ' al '}${endLabel}`;
};

export const formatLocalTime = (value?: string | null) => {
  const time = extractTimeOnly(value, false);
  return time ?? (value ?? '');
};

export const formatLocalDateTime = (value?: string | null) => {
  const dateLabel = formatLocalDateOnly(value);
  const timeLabel = formatLocalTime(value);

  if (!dateLabel) {
    return timeLabel;
  }

  if (!timeLabel || timeLabel === value) {
    return dateLabel;
  }

  return `${dateLabel} ${timeLabel}`;
};

export const formatDateOnly = formatLocalDateOnly;
export const formatTime = formatLocalTime;
export const formatDateTime = formatLocalDateTime;
