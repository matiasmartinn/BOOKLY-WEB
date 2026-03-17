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

export type Range = {
  start: string | null;
  end: string | null;
};

export type DaySchedule = {
  day: Day;
  enabled: boolean;
  ranges: Range[];
};

export type SchedulesFormValues = {
  schedules: DaySchedule[];
};
