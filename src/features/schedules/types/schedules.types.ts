export const DAY_ARRAY = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
] as const;

export type Day = (typeof DAY_ARRAY)[number];

export const DAY_LABELS: Record<Day, string> = {
  Lunes: 'Lunes',
  Martes: 'Martes',
  Miercoles: 'Miercoles',
  Jueves: 'Jueves',
  Viernes: 'Viernes',
  Sabado: 'Sabado',
  Domingo: 'Domingo',
};

export const DAY_VALUE: Record<Day, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sabado: 6,
};

export const MAX_SCHEDULE_RANGES_PER_DAY = 3;

const createRangeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `range-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export type Range = {
  id: string;
  start: string | null;
  end: string | null;
  capacity: number;
};

export type Schedule = {
  enabled: boolean;
  ranges: Range[];
};

export type SchedulesFormState = Record<Day, Schedule>;

export type DaySchedule = {
  day: Day;
  enabled: Schedule['enabled'];
  ranges: Range[];
};

export type SchedulesFormValues = {
  schedules: DaySchedule[];
};

export const createScheduleRange = (
  start: string | null = '09:00',
  end: string | null = '18:00',
  capacity = 1,
): Range => ({
  id: createRangeId(),
  start,
  end,
  capacity,
});
