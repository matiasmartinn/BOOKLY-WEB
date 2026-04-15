import type { ScheduleModel } from 'shared/models';

import type { CreateServiceScheduleDto } from '../services/schedules.service';
import {
  DAY_ARRAY,
  DAY_VALUE,
  createScheduleRange,
  type SchedulesFormValues,
} from '../types/schedules.types';

export const buildDefaultValues = (): SchedulesFormValues => ({
  schedules: DAY_ARRAY.map((day) => ({
    day,
    enabled: false,
    ranges: [createScheduleRange(null, null)],
  })),
});

export const buildFromApi = (data: ScheduleModel[]): SchedulesFormValues['schedules'] =>
  DAY_ARRAY.map((day) => {
    const existing = data.filter((schedule) => schedule.day === day);

    return {
      day,
      enabled: existing.length > 0,
      ranges:
        existing.length > 0
          ? existing.map((schedule) =>
              createScheduleRange(schedule.startTime.slice(0, 5), schedule.endTime.slice(0, 5)),
            )
          : [createScheduleRange(null, null)],
    };
  });

export const buildToApi = (
  schedules: SchedulesFormValues['schedules'],
  capacity = 1,
): CreateServiceScheduleDto[] =>
  schedules
    .filter((schedule) => schedule.enabled)
    .flatMap((schedule) =>
      schedule.ranges
        .filter((range) => range.start && range.end)
        .map((range) => ({
          startTime: range.start!,
          endTime: range.end!,
          capacity,
          day: DAY_VALUE[schedule.day],
        })),
    );

export const findOverlappingScheduleDay = (
  schedules: Array<Pick<CreateServiceScheduleDto, 'day' | 'startTime' | 'endTime'>>,
): number | null => {
  const schedulesByDay = schedules.reduce<Record<number, typeof schedules>>((acc, schedule) => {
    acc[schedule.day] = [...(acc[schedule.day] ?? []), schedule];
    return acc;
  }, {});

  for (const [dayValue, daySchedules] of Object.entries(schedulesByDay)) {
    const orderedSchedules = [...daySchedules].sort((left, right) =>
      left.startTime.localeCompare(right.startTime),
    );

    for (let index = 0; index < orderedSchedules.length - 1; index += 1) {
      const current = orderedSchedules[index];
      const next = orderedSchedules[index + 1];

      if (current.endTime > next.startTime) {
        return Number(dayValue);
      }
    }
  }

  return null;
};
