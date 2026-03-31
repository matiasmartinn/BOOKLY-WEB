import { Badge, Group, Paper, Stack, Text } from '@mantine/core';
import type { AppointmentStatusHistoryDto } from 'shared/models';
import { formatDateTime, formatTime } from 'shared/utils';
import { getAppointmentStatusColor, getAppointmentStatusLabel } from '../utils';

interface ActivityFeedProps {
  items: AppointmentStatusHistoryDto[];
  loading?: boolean;
  emptyMessage?: string;
}

export function ActivityFeed({
  items,
  loading = false,
  emptyMessage = 'Todavía no se registraron eventos para el servicio seleccionado.',
}: ActivityFeedProps) {
  if (loading) {
    return (
      <Text size="sm" c="dimmed">
        Cargando actividad reciente del servicio...
      </Text>
    );
  }

  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {emptyMessage}
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {items.map((item) => (
        <Paper key={item.id} withBorder radius="lg" p="md">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
            <Stack gap={6}>
              <Group gap="xs" wrap="wrap">
                <Badge color={getAppointmentStatusColor(item.newStatus)} variant="light">
                  {getAppointmentStatusLabel(item.newStatus)}
                </Badge>

                {item.oldStatus && (
                  <Text size="xs" c="dimmed">
                    desde {getAppointmentStatusLabel(item.oldStatus)}
                  </Text>
                )}
              </Group>

              <Text size="sm">
                {item.reason?.trim() || 'Evento registrado sin observaciones adicionales.'}
              </Text>
            </Stack>

            <Text size="xs" c="dimmed">
              {formatDateTime(item.occurredOn)} {formatTime(item.occurredOn)}
            </Text>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
