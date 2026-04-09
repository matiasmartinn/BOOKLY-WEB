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
