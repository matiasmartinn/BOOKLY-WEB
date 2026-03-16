import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Group, Stack, Switch, Box, ActionIcon, Text } from '@mantine/core';
import { SelectDayTimePicker } from 'shared/ui/components';
import type { CreateServiceFormValues, ScheduleValue } from '../../schema';

const DAY_ARRAY = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
] as const;

type Day = (typeof DAY_ARRAY)[number];
type Range = { start: string | null; end: string | null };
type DaySchedule = { enabled: boolean; ranges: Range[] };
type SchedulesState = Record<Day, DaySchedule>;

// Backend: 0 = Domingo, 1 = Lunes ... 6 = Sábado
const DAY_TO_NUMBER: Record<Day, number> = {
  Lunes: 1,
  Martes: 2,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sabado: 6,
  Domingo: 0,
};

const buildInitial = (): SchedulesState =>
  DAY_ARRAY.reduce((acc, day) => {
    acc[day] = { enabled: false, ranges: [{ start: null, end: null }] };
    return acc;
  }, {} as SchedulesState);

function toScheduleValues(state: SchedulesState): ScheduleValue[] {
  return DAY_ARRAY.flatMap((day) => {
    if (!state[day].enabled) return [];
    return state[day].ranges
      .filter((r) => r.start && r.end)
      .map((r) => ({
        day: DAY_TO_NUMBER[day],
        startTime: r.start!,
        endTime: r.end!,
        capacity: 1,
      }));
  });
}

// ─── SchedulesStep ────────────────────────────────────────────────────────────

export function SchedulesStep() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<CreateServiceFormValues>();
  const [schedules, setSchedules] = useState<SchedulesState>(buildInitial);

  const update = (next: SchedulesState) => {
    setSchedules(next);
    setValue('schedules', toScheduleValues(next), { shouldValidate: true });
  };

  const toggleDay = (day: Day, enabled: boolean) =>
    update({ ...schedules, [day]: { ...schedules[day], enabled } });

  const updateRange = (day: Day, index: number, field: 'start' | 'end', value: string | null) => {
    const ranges = [...schedules[day].ranges];
    ranges[index] = { ...ranges[index], [field]: value };
    update({ ...schedules, [day]: { ...schedules[day], ranges } });
  };

  const addRange = (day: Day) =>
    update({
      ...schedules,
      [day]: { ...schedules[day], ranges: [...schedules[day].ranges, { start: null, end: null }] },
    });

  const removeRange = (day: Day, index: number) => {
    const ranges = schedules[day].ranges.filter((_, i) => i !== index);
    update({
      ...schedules,
      [day]: { ...schedules[day], ranges: ranges.length ? ranges : [{ start: null, end: null }] },
    });
  };

  return (
    <Stack gap="sm">
      {DAY_ARRAY.map((day) => {
        const schedule = schedules[day];
        const firstRange = schedule.ranges[0];
        const extraRanges = schedule.ranges.slice(1);

        return (
          <Stack key={day}>
            <Group align="flex-start" wrap="nowrap">
              <Box miw={120}>
                <Switch
                  label={day}
                  checked={schedule.enabled}
                  onChange={(e) => toggleDay(day, e.currentTarget.checked)}
                />
              </Box>

              {schedule.enabled && (
                <Stack gap={8} flex={1}>
                  <Group align="flex-start" wrap="wrap">
                    <SelectDayTimePicker
                      startValue={firstRange.start}
                      endValue={firstRange.end}
                      onStartChange={(v) => updateRange(day, 0, 'start', v)}
                      onEndChange={(v) => updateRange(day, 0, 'end', v)}
                    />
                    <ActionIcon
                      variant="light"
                      color="brand"
                      size="lg"
                      onClick={() => addRange(day)}
                      aria-label="Agregar franja"
                    >
                      +
                    </ActionIcon>
                  </Group>

                  {extraRanges.map((range, i) => (
                    <SelectDayTimePicker
                      key={`${day}-${i + 1}`}
                      startValue={range.start}
                      endValue={range.end}
                      onStartChange={(v) => updateRange(day, i + 1, 'start', v)}
                      onEndChange={(v) => updateRange(day, i + 1, 'end', v)}
                      onRemove={() => removeRange(day, i + 1)}
                    />
                  ))}
                </Stack>
              )}
            </Group>
          </Stack>
        );
      })}

      {typeof errors.schedules?.message === 'string' && (
        <Text size="xs" c="red">
          {errors.schedules.message}
        </Text>
      )}
    </Stack>
  );
}
