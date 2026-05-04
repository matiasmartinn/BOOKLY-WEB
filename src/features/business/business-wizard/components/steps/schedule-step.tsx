import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Box, Button, Divider, Group, NumberInput, Stack, Switch, Text } from '@mantine/core';
import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { SelectDayTimePicker } from 'shared/ui/components';

import type { CreateBusinessFormValues, ScheduleValue } from '../../schema';

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
type Range = { start: string | null; end: string | null; capacity: number };
type DaySchedule = { enabled: boolean; ranges: Range[] };
type SchedulesState = Record<Day, DaySchedule>;

const DAY_TO_NUMBER: Record<Day, number> = {
  Lunes: 1,
  Martes: 2,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sabado: 6,
  Domingo: 0,
};

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];
const DEFAULT_RANGE: Range = { start: '09:00', end: '18:00', capacity: 1 };
const EMPTY_RANGE: Range = { start: null, end: null, capacity: 1 };
const MAX_RANGES_PER_DAY = 3;

const buildInitial = (): SchedulesState =>
  DAY_ARRAY.reduce((acc, day) => {
    acc[day] = { enabled: false, ranges: [EMPTY_RANGE] };
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
        capacity: r.capacity,
      }));
  });
}

const createNextRange = (ranges: Range[]): Range => {
  const previousRange = ranges.at(-1);

  return {
    start: previousRange?.end ?? null,
    end: null,
    capacity: previousRange?.capacity ?? DEFAULT_RANGE.capacity,
  };
};

export function SchedulesStep() {
  const {
    setValue,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext<CreateBusinessFormValues>();
  const [schedules, setSchedules] = useState<SchedulesState>(buildInitial);

  const duration = watch('durationMinutes');

  const update = (next: SchedulesState) => {
    setSchedules(next);
    clearErrors('schedules');
    setValue('schedules', toScheduleValues(next), { shouldValidate: true });
  };

  const toggleDay = (day: Day, enabled: boolean) =>
    update({
      ...schedules,
      [day]: {
        ...schedules[day],
        enabled,
        ranges: enabled ? [{ ...DEFAULT_RANGE }] : [EMPTY_RANGE],
      },
    });

  const updateRange = (day: Day, index: number, field: 'start' | 'end', value: string | null) => {
    const ranges = [...schedules[day].ranges];
    ranges[index] = { ...ranges[index], [field]: value };
    update({ ...schedules, [day]: { ...schedules[day], ranges } });
  };

  const updateCapacity = (day: Day, index: number, capacity: number) => {
    const ranges = [...schedules[day].ranges];
    ranges[index] = { ...ranges[index], capacity };
    update({ ...schedules, [day]: { ...schedules[day], ranges } });
  };

  const addRange = (day: Day) => {
    const ranges = schedules[day].ranges;

    if (ranges.length >= MAX_RANGES_PER_DAY) {
      return;
    }

    update({
      ...schedules,
      [day]: { ...schedules[day], ranges: [...ranges, createNextRange(ranges)] },
    });
  };

  const removeRange = (day: Day, index: number) => {
    const ranges = schedules[day].ranges.filter((_, i) => i !== index);
    update({
      ...schedules,
      [day]: { ...schedules[day], ranges: ranges.length ? ranges : [EMPTY_RANGE] },
    });
  };

  return (
    <Stack gap="xl">
      {/* ── Duración ───────────────────────────────────────────────────────── */}
      <Stack gap="sm">
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            Duración del turno
          </Text>
          <Text size="xs" c="dimmed">
            ¿Cuánto dura cada turno? Esto define los slots disponibles en tu agenda.
          </Text>
        </Stack>

        <Group gap="xs" wrap="wrap">
          {DURATION_PRESETS.map((min) => (
            <Box
              key={min}
              px="sm"
              py={6}
              onClick={() => setValue('durationMinutes', min, { shouldValidate: true })}
              style={{
                borderRadius: 'var(--mantine-radius-md)',
                border: `1px solid ${duration === min ? 'var(--mantine-color-brand-5)' : 'var(--mantine-color-default-border)'}`,
                backgroundColor:
                  duration === min
                    ? 'var(--mantine-color-brand-0)'
                    : 'var(--mantine-color-default)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                userSelect: 'none',
              }}
            >
              <Text
                size="xs"
                fw={duration === min ? 600 : 400}
                c={duration === min ? 'brand.6' : 'dimmed'}
              >
                {min >= 60
                  ? `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}min` : ''}`
                  : `${min}min`}
              </Text>
            </Box>
          ))}
        </Group>

        <Controller
          name="durationMinutes"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              placeholder="Ej: 45"
              label="Manual (minutos)"
              min={5}
              max={480}
              step={5}
              suffix=" min"
              w={200}
              error={errors.durationMinutes?.message}
              onChange={(val) => field.onChange(typeof val === 'number' ? val : undefined)}
            />
          )}
        />
      </Stack>

      <Divider />

      <Stack gap="sm">
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            Días y horarios de atención
          </Text>
          <Text size="xs" c="dimmed">
            Activá los días que atendés y configurá los rangos horarios.
          </Text>
        </Stack>

        <Stack gap="sm">
          {DAY_ARRAY.map((day) => {
            const schedule = schedules[day];
            const canAddRange = schedule.ranges.length < MAX_RANGES_PER_DAY;

            return (
              <Stack key={day}>
                <Group align="flex-start" wrap="nowrap" gap="md">
                  <Box w={156} style={{ flex: '0 0 156px' }}>
                    <Switch
                      label={day}
                      checked={schedule.enabled}
                      onChange={(e) => toggleDay(day, e.currentTarget.checked)}
                    />
                  </Box>

                  {schedule.enabled && (
                    <Stack gap={8} flex={1}>
                      <Text size="xs" c="dimmed">
                        Cupo: reservas permitidas en ese horario.
                      </Text>

                      {schedule.ranges.map((range, i) => (
                        <Group key={`${day}-${i}`} align="flex-start" wrap="wrap" gap="sm">
                          <SelectDayTimePicker
                            startValue={range.start}
                            endValue={range.end}
                            onStartChange={(v) => updateRange(day, i, 'start', v)}
                            onEndChange={(v) => updateRange(day, i, 'end', v)}
                          />
                          <NumberInput
                            aria-label={`Cupo para ${day}`}
                            placeholder="Cupo"
                            min={1}
                            value={range.capacity}
                            onChange={(value) =>
                              updateCapacity(day, i, typeof value === 'number' && value > 0 ? value : 1)
                            }
                            w={90}
                          />
                          {i > 0 && (
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="lg"
                              onClick={() => removeRange(day, i)}
                              aria-label="Eliminar franja"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </ActionIcon>
                          )}
                        </Group>
                      ))}

                      <Group>
                        <Button
                          variant="subtle"
                          color="brand"
                          size="xs"
                          leftSection={<FontAwesomeIcon icon={faPlus} />}
                          onClick={() => addRange(day)}
                          disabled={!canAddRange}
                        >
                          {canAddRange ? 'Agregar horario' : 'Maximo 3 horarios'}
                        </Button>
                      </Group>
                    </Stack>
                  )}
                </Group>
              </Stack>
            );
          })}
        </Stack>

        {typeof errors.schedules?.message === 'string' && (
          <Text size="xs" c="red">
            {errors.schedules.message}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
