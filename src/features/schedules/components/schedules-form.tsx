import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import { useEffect, useState } from 'react';
import type { ScheduleDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { useBusinessStore } from 'store/use-business-store';

import { useSelectedServiceSchedules, useSaveSchedules } from '../hooks';
import {
  DAY_ARRAY,
  DAY_VALUE,
  MAX_SCHEDULE_RANGES_PER_DAY,
  createScheduleRange,
  type Day,
  type Range,
  type SchedulesFormState,
} from '../types/schedules.types';
import { findOverlappingScheduleDay } from '../utils/schedules.utils';

import { ScheduleDayRow } from './schedule-day-row';

const buildFromApi = (data: ScheduleDto[]): SchedulesFormState => {
  const state = buildEmpty();

  for (const schedule of data) {
    const day = DAY_ARRAY.find((candidate) => DAY_VALUE[candidate] === schedule.dayValue);
    if (!day) {
      continue;
    }

    if (!state[day].enabled) {
      state[day] = { enabled: true, ranges: [] };
    }

    state[day].ranges.push(
      createScheduleRange(
        schedule.startTime.slice(0, 5),
        schedule.endTime.slice(0, 5),
        schedule.capacity,
      ),
    );
  }

  return state;
};

const buildEmpty = (): SchedulesFormState =>
  Object.fromEntries(
    DAY_ARRAY.map((day) => [day, { enabled: false, ranges: [createScheduleRange()] }]),
  ) as SchedulesFormState;

const createNextRange = (ranges: Range[]) => {
  const previousRange = ranges.at(-1);

  return createScheduleRange(previousRange?.end ?? null, null, previousRange?.capacity ?? 1);
};

export function SchedulesForm() {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const toast = useAppToast();
  const { data: schedulesData } = useSelectedServiceSchedules();
  const { mutate: setSchedule, isPending, isError, error } = useSaveSchedules();
  const [form, setForm] = useState<SchedulesFormState>(buildEmpty);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (schedulesData) {
      setForm(buildFromApi(schedulesData));
      setValidationError(null);
    }
  }, [schedulesData]);

  const toggle = (day: Day, enabled: boolean) => {
    setValidationError(null);
    setForm((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        enabled,
        ranges: enabled
          ? previous[day].ranges.length > 0
            ? previous[day].ranges
            : [createScheduleRange()]
          : previous[day].ranges,
      },
    }));
  };

  const updateRange = (day: Day, index: number, field: 'start' | 'end', value: string | null) => {
    setValidationError(null);
    setForm((previous) => {
      const ranges = previous[day].ranges.map((range, currentIndex) =>
        currentIndex === index ? { ...range, [field]: value } : range,
      );

      return { ...previous, [day]: { ...previous[day], ranges } };
    });
  };

  const updateCapacity = (day: Day, index: number, capacity: number) => {
    setValidationError(null);
    setForm((previous) => {
      const ranges = previous[day].ranges.map((range, currentIndex) =>
        currentIndex === index ? { ...range, capacity } : range,
      );

      return { ...previous, [day]: { ...previous[day], ranges } };
    });
  };

  const addRange = (day: Day) => {
    setValidationError(null);
    setForm((previous) => {
      const ranges = previous[day].ranges;

      if (ranges.length >= MAX_SCHEDULE_RANGES_PER_DAY) {
        return previous;
      }

      return {
        ...previous,
        [day]: {
          ...previous[day],
          ranges: [...ranges, createNextRange(ranges)],
        },
      };
    });
  };

  const removeRange = (day: Day, index: number) => {
    setValidationError(null);
    setForm((previous) => ({
      ...previous,
      [day]: {
        ...previous[day],
        ranges: previous[day].ranges.filter((_, currentIndex) => currentIndex !== index),
      },
    }));
  };

  const handleSave = () => {
    if (!selectedService) {
      return;
    }

    const dto = DAY_ARRAY.filter((day) => form[day].enabled).flatMap((day) =>
      form[day].ranges
        .filter((range) => range.start && range.end)
        .map((range) => ({
          startTime: range.start!,
          endTime: range.end!,
          capacity: range.capacity,
          day: DAY_VALUE[day],
        })),
    );

    if (findOverlappingScheduleDay(dto) !== null) {
      setValidationError('Hay horarios superpuestos en el mismo dia.');
      return;
    }

    setValidationError(null);

    setSchedule(dto, {
      onSuccess: () => {
        setValidationError(null);
        toast.success('Los horarios se guardaron correctamente.');
      },
    });
  };

  return (
    <Stack gap="sm">
      <Stack gap={2}>
        <Text fw={600}>Configuracion semanal</Text>
        {!selectedService && (
          <Text size="sm" c="dimmed">
            Selecciona un servicio desde el sidebar para poder gestionar sus horarios.
          </Text>
        )}
      </Stack>

      {validationError && (
        <Alert color="red" variant="light">
          {validationError}
        </Alert>
      )}

      {isError && error && (
        <Alert color="red" variant="light">
          {isApiError(error) ? error.detail : 'No se pudieron guardar los horarios.'}
        </Alert>
      )}

      {DAY_ARRAY.map((day) => (
        <ScheduleDayRow
          key={day}
          day={day}
          schedule={form[day]}
          onToggle={toggle}
          onUpdateRange={updateRange}
          onUpdateCapacity={updateCapacity}
          onAddRange={addRange}
          onRemoveRange={removeRange}
        />
      ))}

      <Group justify="flex-end" mt="md">
        <Button onClick={handleSave} loading={isPending} disabled={!selectedService}>
          Guardar cambios
        </Button>
      </Group>
    </Stack>
  );
}
