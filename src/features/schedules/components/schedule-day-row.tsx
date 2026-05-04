import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Box, Button, Group, NumberInput, Stack, Switch, Text } from '@mantine/core';
import { memo } from 'react';
import { SelectDayTimePicker } from 'shared/ui/components';

import {
  DAY_LABELS,
  MAX_SCHEDULE_RANGES_PER_DAY,
  type Day,
  type Schedule,
} from '../types/schedules.types';

type Props = {
  day: Day;
  schedule: Schedule;
  onToggle: (day: Day, enabled: boolean) => void;
  onUpdateRange: (day: Day, index: number, field: 'start' | 'end', value: string | null) => void;
  onUpdateCapacity: (day: Day, index: number, capacity: number) => void;
  onAddRange: (day: Day) => void;
  onRemoveRange: (day: Day, index: number) => void;
};

export const ScheduleDayRow = memo(function ScheduleDayRow({
  day,
  schedule,
  onToggle,
  onUpdateRange,
  onUpdateCapacity,
  onAddRange,
  onRemoveRange,
}: Props) {
  const { enabled, ranges } = schedule;
  const canAddRange = ranges.length < MAX_SCHEDULE_RANGES_PER_DAY;

  return (
    <Group align="flex-start" wrap="nowrap" gap="md">
      <Box w={156} style={{ flex: '0 0 156px' }}>
        <Switch
          label={DAY_LABELS[day]}
          checked={enabled}
          onChange={(e) => onToggle(day, e.currentTarget.checked)}
        />
      </Box>

      {enabled && (
        <Stack gap={8} flex={1}>
          <Text size="xs" c="dimmed">
            Cupo: reservas permitidas en ese horario.
          </Text>

          {ranges.map((range, i) => (
            <Group key={range.id} align="flex-start" wrap="wrap" gap="sm">
              <SelectDayTimePicker
                startValue={range.start}
                endValue={range.end}
                onStartChange={(value) => onUpdateRange(day, i, 'start', value)}
                onEndChange={(value) => onUpdateRange(day, i, 'end', value)}
              />

              <NumberInput
                aria-label={`Cupo para ${DAY_LABELS[day]}`}
                placeholder="Cupo"
                min={1}
                value={range.capacity}
                onChange={(value) =>
                  onUpdateCapacity(day, i, typeof value === 'number' && value > 0 ? value : 1)
                }
                w={90}
              />

              {i > 0 && (
                <ActionIcon
                  variant="light"
                  color="red"
                  size="lg"
                  onClick={() => onRemoveRange(day, i)}
                  aria-label={`Eliminar franja para ${DAY_LABELS[day]}`}
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
              onClick={() => onAddRange(day)}
              disabled={!canAddRange}
            >
              {canAddRange ? 'Agregar horario' : 'Maximo 3 horarios'}
            </Button>
          </Group>
        </Stack>
      )}
    </Group>
  );
});
