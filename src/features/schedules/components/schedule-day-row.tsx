import { memo } from 'react';
import { Stack, Group, Switch, Box, ActionIcon } from '@mantine/core';
import { SelectDayTimePicker } from 'shared/ui/components';

type Day = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
type Range = { start: string; end: string };
type Schedule = { enabled: boolean; ranges: Range[] };

type Props = {
  day: Day;
  schedule: Schedule;
  onToggle: (day: Day, enabled: boolean) => void;
  onUpdateRange: (day: Day, index: number, field: keyof Range, value: string) => void;
  onAddRange: (day: Day) => void;
  onRemoveRange: (day: Day, index: number) => void;
};

export const ScheduleDayRow = memo(function ScheduleDayRow({
  day,
  schedule,
  onToggle,
  onUpdateRange,
  onAddRange,
  onRemoveRange,
}: Props) {
  const { enabled, ranges } = schedule;

  return (
    <Group align="flex-start" wrap="nowrap">
      <Box miw={120}>
        <Switch
          label={day}
          checked={enabled}
          onChange={(e) => onToggle(day, e.currentTarget.checked)}
        />
      </Box>

      {enabled && (
        <Stack gap={8} flex={1}>
          {ranges.map((range, i) => (
            <Group key={i} align="flex-start" wrap="nowrap">
              <SelectDayTimePicker
                startValue={range.start}
                endValue={range.end}
                onStartChange={(v) => onUpdateRange(day, i, 'start', v ?? '')}
                onEndChange={(v) => onUpdateRange(day, i, 'end', v ?? '')}
                onRemove={i > 0 ? () => onRemoveRange(day, i) : undefined}
              />

              {i === 0 && (
                <ActionIcon variant="light" color="brand" size="lg" onClick={() => onAddRange(day)}>
                  +
                </ActionIcon>
              )}
            </Group>
          ))}
        </Stack>
      )}
    </Group>
  );
});
