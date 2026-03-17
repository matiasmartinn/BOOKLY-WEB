import type { ScheduleModel } from 'shared/models';
import { DAY_ARRAY, type SchedulesFormValues } from '../types/schedules.types';
import type { CreateServiceScheduleDto } from '../services/schedules.service';

export const DEFAULT_RANGE = { start: '09:00', end: '18:00' };
export const EMPTY_RANGE = { start: null, end: null };

// Mismo mapa que el backend usa en GetDayName
const DAY_VALUE: Record<string, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
};

export const buildDefaultValues = (): SchedulesFormValues => ({
  schedules: DAY_ARRAY.map((day) => ({
    day,
    enabled: false,
    ranges: [{ ...EMPTY_RANGE }],
  })),
});

// API → Form
export const buildFromApi = (data: ScheduleModel[]): SchedulesFormValues['schedules'] =>
  DAY_ARRAY.map((day) => {
    const existing = data.filter((s) => s.day === day);
    return {
      day,
      enabled: existing.length > 0,
      ranges:
        existing.length > 0
          ? existing.map((s) => ({ start: s.startTime.slice(0, 5), end: s.endTime.slice(0, 5) }))
          : [{ ...EMPTY_RANGE }],
    };
  });

// Form → API
export const buildToApi = (
  schedules: SchedulesFormValues['schedules'],
  capacity = 1,
): CreateServiceScheduleDto[] =>
  schedules
    .filter((s) => s.enabled)
    .flatMap((s) =>
      s.ranges
        .filter((r) => r.start && r.end)
        .map((r) => ({
          startTime: r.start!,
          endTime: r.end!,
          capacity,
          day: DAY_VALUE[s.day] ?? 0,
        })),
    );
