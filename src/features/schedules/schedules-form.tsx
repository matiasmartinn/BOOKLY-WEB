import { Button, Group, Stack, Switch, Box } from '@mantine/core';
import { useState } from 'react';
import { SelectDayTimePicker } from 'shared/ui/components';

const dayArray = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
] as const;

type Day = (typeof dayArray)[number];
type Range = { start: string | null; end: string | null };
type DaySchedule = { enabled: boolean; ranges: Range[] };

const initialSchedules = dayArray.reduce(
  (acc, day) => {
    acc[day] = { enabled: false, ranges: [{ start: null, end: null }] };
    return acc;
  },
  {} as Record<Day, DaySchedule>,
);

export function SchedulesForm() {
  const [schedules, setSchedules] = useState<Record<Day, DaySchedule>>(initialSchedules);

  const toggleDay = (day: Day, enabled: boolean) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled },
    }));
  };

  const updateRange = (day: Day, index: number, field: 'start' | 'end', value: string | null) => {
    setSchedules((prev) => {
      const nextRanges = [...prev[day].ranges];
      nextRanges[index] = { ...nextRanges[index], [field]: value };

      return {
        ...prev,
        [day]: { ...prev[day], ranges: nextRanges },
      };
    });
  };

  const addRange = (day: Day) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: [...prev[day].ranges, { start: null, end: null }],
      },
    }));
  };

  const removeRange = (day: Day, index: number) => {
    setSchedules((prev) => {
      const nextRanges = prev[day].ranges.filter((_, i) => i !== index);

      return {
        ...prev,
        [day]: {
          ...prev[day],
          ranges: nextRanges.length ? nextRanges : [{ start: null, end: null }],
        },
      };
    });
  };

  return (
    <Stack gap="sm">
      {dayArray.map((day) => {
        const schedule = schedules[day];
        const firstRange = schedule.ranges[0];
        const extraRanges = schedule.ranges.slice(1);

        return (
          <Stack key={day} gap={8}>
            <Group align="flex-start" wrap="nowrap">
              <Box miw={140}>
                <Switch
                  label={day}
                  checked={schedule.enabled}
                  onChange={(event) => toggleDay(day, event.currentTarget.checked)}
                />
              </Box>
              {schedule.enabled && (
                <Stack gap={8} flex={1}>
                  <Group wrap="nowrap" align="center">
                    <SelectDayTimePicker
                      startValue={firstRange.start}
                      endValue={firstRange.end}
                      onStartChange={(value) => updateRange(day, 0, 'start', value)}
                      onEndChange={(value) => updateRange(day, 0, 'end', value)}
                    />

                    <Button variant="light" size="xs" onClick={() => addRange(day)}>
                      + Agregar franja horaria
                    </Button>
                  </Group>

                  {extraRanges.length > 0 && (
                    <Stack gap={8}>
                      {extraRanges.map((range, extraIndex) => {
                        const realIndex = extraIndex + 1;

                        return (
                          <SelectDayTimePicker
                            key={`${day}-${realIndex}`}
                            startValue={range.start}
                            endValue={range.end}
                            onStartChange={(value) => updateRange(day, realIndex, 'start', value)}
                            onEndChange={(value) => updateRange(day, realIndex, 'end', value)}
                            onRemove={() => removeRange(day, realIndex)}
                          />
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              )}
            </Group>
          </Stack>
        );
      })}
    </Stack>
  );
}
