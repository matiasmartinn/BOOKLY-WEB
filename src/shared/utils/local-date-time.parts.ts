export interface DateOnlyParts {
  year: number;
  month: number;
  day: number;
}

export interface TimeOnlyParts {
  hour: number;
  minute: number;
  second: number;
}

export interface DateTimeParts extends DateOnlyParts, TimeOnlyParts {}

export const pad2 = (value: number) => String(value).padStart(2, '0');

export const buildDateOnly = ({ year, month, day }: DateOnlyParts) =>
  `${year}-${pad2(month)}-${pad2(day)}`;

export const buildNativeDate = ({ year, month, day }: DateOnlyParts) =>
  new Date(year, month - 1, day);

export const buildTimeOnly = (
  { hour, minute, second }: TimeOnlyParts,
  includeSeconds = true,
) =>
  includeSeconds
    ? `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
    : `${pad2(hour)}:${pad2(minute)}`;

export const buildLocalDateTime = (parts: DateTimeParts) =>
  `${buildDateOnly(parts)}T${buildTimeOnly(parts)}`;

export const isValidDateOnlyParts = ({ year, month, day }: DateOnlyParts) => {
  const candidate = buildNativeDate({ year, month, day });

  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
};

export const isValidTimeOnlyParts = ({ hour, minute, second }: TimeOnlyParts) =>
  hour >= 0 &&
  hour <= 23 &&
  minute >= 0 &&
  minute <= 59 &&
  second >= 0 &&
  second <= 59;

export const parseNumber = (value: string) => Number.parseInt(value, 10);
