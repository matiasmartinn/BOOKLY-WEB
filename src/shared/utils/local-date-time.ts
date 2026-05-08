const BUSINESS_TIME_ZONE = 'America/Argentina/Buenos_Aires';

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_DATE_TIME_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,7})?)?$/;
const ZONED_DATE_TIME_REGEX =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,7})?)?(?:Z|[+-]\d{2}:?\d{2})$/i;
const TIME_ONLY_REGEX = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
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

interface DateOnlyParts {
  year: number;
  month: number;
  day: number;
}

interface TimeOnlyParts {
  hour: number;
  minute: number;
  second: number;
}

interface DateTimeParts extends DateOnlyParts, TimeOnlyParts {}

const pad2 = (value: number) => String(value).padStart(2, '0');

const buildDateOnly = ({ year, month, day }: DateOnlyParts) =>
  `${year}-${pad2(month)}-${pad2(day)}`;

const buildNativeDate = ({ year, month, day }: DateOnlyParts) => new Date(year, month - 1, day);

const buildTimeOnly = (
  { hour, minute, second }: TimeOnlyParts,
  includeSeconds = true,
) =>
  includeSeconds
    ? `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
    : `${pad2(hour)}:${pad2(minute)}`;

const buildLocalDateTime = (parts: DateTimeParts) =>
  `${buildDateOnly(parts)}T${buildTimeOnly(parts)}`;

const isValidDateOnlyParts = ({ year, month, day }: DateOnlyParts) => {
  const candidate = buildNativeDate({ year, month, day });

  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
};

const isValidTimeOnlyParts = ({ hour, minute, second }: TimeOnlyParts) =>
  hour >= 0 &&
  hour <= 23 &&
  minute >= 0 &&
  minute <= 59 &&
  second >= 0 &&
  second <= 59;

const parseNumber = (value: string) => Number.parseInt(value, 10);

const getBusinessDateTimeParts = (date: Date): DateTimeParts | null => {
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

const parseBusinessDateTimeParts = (value?: string | null) =>
  parseLocalDateTimeParts(value) ?? parseZonedDateTimeParts(value);

const parseBusinessDateParts = (value?: string | null) =>
  parseDateOnlyParts(value) ?? parseBusinessDateTimeParts(value);

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

export const combineDateAndTime = (dateOnly?: string | null, timeOnly?: string | null) => {
  const dateParts = parseDateOnlyParts(dateOnly);
  const timeParts = parseTimeOnlyParts(timeOnly);

  if (!dateParts || !timeParts) {
    return null;
  }

  return buildLocalDateTime({
    ...dateParts,
    ...timeParts,
  });
};

export const getMonthDateOnlyRange = (visibleDate: string | null) => {
  const baseDate = parseDateOnlyParts(visibleDate) ?? parseDateOnlyParts(getCurrentBusinessDateOnly());

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

export const compareDateOnly = (left?: string | null, right?: string | null) => {
  const normalizedLeft = normalizeDateOnly(left);
  const normalizedRight = normalizeDateOnly(right);

  if (!normalizedLeft && !normalizedRight) {
    return 0;
  }

  if (!normalizedLeft) {
    return -1;
  }

  if (!normalizedRight) {
    return 1;
  }

  return normalizedLeft.localeCompare(normalizedRight);
};

export const compareLocalDateTime = (left?: string | null, right?: string | null) => {
  const normalizedLeft = normalizeLocalDateTime(left);
  const normalizedRight = normalizeLocalDateTime(right);

  if (!normalizedLeft && !normalizedRight) {
    return 0;
  }

  if (!normalizedLeft) {
    return -1;
  }

  if (!normalizedRight) {
    return 1;
  }

  return normalizedLeft.localeCompare(normalizedRight);
};

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

export const formatLocalDate = (value?: string | null) => formatLocalDateOnly(value);

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
