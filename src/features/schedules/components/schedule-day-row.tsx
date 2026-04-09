import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Box, Group, Stack, Switch } from '@mantine/core';
import { memo } from 'react';
import { SelectDayTimePicker } from 'shared/ui/components';

import { DAY_LABELS, type Day, type Schedule } from '../types/schedules.types';

type Props = {
  day: Day;
  schedule: Schedule;
  onToggle: (day: Day, enabled: boolean) => void;
  onUpdateRange: (day: Day, index: number, field: 'start' | 'end', value: string | null) => void;
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
          label={DAY_LABELS[day]}
          checked={enabled}
          onChange={(e) => onToggle(day, e.currentTarget.checked)}
        />
      </Box>

      {enabled && (
        <Stack gap={8} flex={1}>
          {ranges.map((range, i) => (
            <Group key={range.id} align="center" wrap="nowrap">
              <SelectDayTimePicker
                startValue={range.start}
                endValue={range.end}
                onStartChange={(value) => onUpdateRange(day, i, 'start', value)}
                onEndChange={(value) => onUpdateRange(day, i, 'end', value)}
                onRemove={i > 0 ? () => onRemoveRange(day, i) : undefined}
              />

              {i === 0 && (
                <ActionIcon
                  variant="light"
                  color="brand"
                  size="lg"
                  onClick={() => onAddRange(day)}
                  aria-label={`Agregar franja para ${DAY_LABELS[day]}`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </ActionIcon>
              )}
            </Group>
          ))}
        </Stack>
      )}
    </Group>
  );
});
