import { Stack, Group, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useSelectedServiceSchedules, useSaveSchedules } from '../hooks';
import { ScheduleDayRow } from './schedule-day-row';
import type { ScheduleDto } from 'shared/models';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
type Day = (typeof DAYS)[number];
type Range = { start: string; end: string };
type Schedule = { enabled: boolean; ranges: Range[] };
type FormState = Record<Day, Schedule>;

const DAY_VALUE: Record<Day, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
};

const buildFromApi = (data: ScheduleDto[]): FormState => {
  const state = buildEmpty();
  for (const s of data) {
    const day = DAYS.find((d) => DAY_VALUE[d] === s.dayValue);
    if (!day) continue;
    if (!state[day].enabled) {
      state[day] = { enabled: true, ranges: [] };
    }
    state[day].ranges.push({ start: s.startTime.slice(0, 5), end: s.endTime.slice(0, 5) });
  }
  return state;
};
const createDefaultRange = (): Range => ({ start: '09:00', end: '18:00' });

const buildEmpty = (): FormState =>
  Object.fromEntries(
    DAYS.map((d) => [d, { enabled: false, ranges: [createDefaultRange()] }]),
  ) as FormState;

export function SchedulesForm() {
  const { data: schedulesData } = useSelectedServiceSchedules();
  const { mutate: setSchedule, isPending } = useSaveSchedules();
  const [form, setForm] = useState<FormState>(buildEmpty);

  useEffect(() => {
    if (schedulesData) setForm(buildFromApi(schedulesData));
  }, [schedulesData]);

  const toggle = (day: Day, enabled: boolean) =>
    setForm((p) => ({
      ...p,
      [day]: {
        ...p[day],
        enabled,
        ranges: enabled
          ? p[day].ranges.length > 0
            ? p[day].ranges
            : [createDefaultRange()]
          : p[day].ranges,
      },
    }));

  const updateRange = (day: Day, i: number, field: keyof Range, value: string) =>
    setForm((p) => {
      const ranges = p[day].ranges.map((r, idx) => (idx === i ? { ...r, [field]: value } : r));
      return { ...p, [day]: { ...p[day], ranges } };
    });

  const addRange = (day: Day) =>
    setForm((p) => ({
      ...p,
      [day]: { ...p[day], ranges: [...p[day].ranges, createDefaultRange()] },
    }));

  const removeRange = (day: Day, i: number) =>
    setForm((p) => ({
      ...p,
      [day]: { ...p[day], ranges: p[day].ranges.filter((_, idx) => idx !== i) },
    }));

  const handleSave = () => {
    const dto = DAYS.filter((d) => form[d].enabled).flatMap((d) =>
      form[d].ranges.map((r) => ({
        startTime: r.start,
        endTime: r.end,
        capacity: 1,
        day: DAY_VALUE[d],
      })),
    );
    setSchedule(dto);
  };

  return (
    <Stack gap="sm">
      {DAYS.map((day) => (
        <ScheduleDayRow
          key={day}
          day={day}
          schedule={form[day]}
          onToggle={toggle}
          onUpdateRange={updateRange}
          onAddRange={addRange}
          onRemoveRange={removeRange}
        />
      ))}

      <Group justify="flex-end" mt="md">
        <Button onClick={handleSave} loading={isPending}>
          Guardar cambios
        </Button>
      </Group>
    </Stack>
  );
}
