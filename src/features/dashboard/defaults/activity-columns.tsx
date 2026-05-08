import { Badge, Stack, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import { formatDateOnly, formatTime } from 'shared/utils';

import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

export const activityColumns: TableColumn<ActivityEventViewModel>[] = [
  {
    key: 'appointmentDateLabel',
    title: 'Fecha',
    accessor: 'appointmentDateLabel',
    noWrap: true,
  },

  {
    key: 'clientName',
    title: 'Cliente',
    accessor: 'clientName',
    sortable: true,
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {row.clientName}
        </Text>
        <Text size="xs" c="dimmed">
          {row.clientEmail || 'Sin email cargado'}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'eventType',
    title: 'Tipo de evento',
    accessor: 'eventType',
    sortable: true,
    render: (row) => (
      <Badge color={row.eventTypeColor} variant="light">
        {row.eventType}
      </Badge>
    ),
  },
  {
    key: 'actorLabel',
    title: 'Actor',
    accessor: 'actorLabel',
    sortable: true,
    render: (row) => (
      <Text size="sm" fw={500}>
        {row.actorLabel}
      </Text>
    ),
  },
  {
    key: 'eventDateTime',
    title: 'Realizado',
    accessor: 'eventDateTime',
    sortable: true,
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {formatTime(row.eventDateTime)}
        </Text>
        <Text size="xs" c="dimmed">
          {formatDateOnly(row.eventDateTime)}
        </Text>
      </Stack>
    ),
  },
];
