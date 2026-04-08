import { Badge, Stack, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import { formatLocalDateTime } from 'shared/utils';
import { getAppointmentStatusColor, getAppointmentStatusLabel } from '../utils';
import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

export const activityColumns: TableColumn<ActivityEventViewModel>[] = [
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
    key: 'actorLabel',
    title: 'Actor',
    accessor: 'actorLabel',
    sortable: true,
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {row.actorLabel}
        </Text>
        {row.actorUserId != null ? (
          <Text size="xs" c="dimmed">
            userId: {row.actorUserId}
          </Text>
        ) : null}
      </Stack>
    ),
  },
  {
    key: 'eventDateTime',
    title: 'Fecha del evento',
    accessor: 'eventDateTime',
    sortable: true,
    render: (row) => formatLocalDateTime(row.eventDateTime),
  },
  {
    key: 'status',
    title: 'Estado',
    accessor: 'status',
    sortable: true,
    render: (row) => (
      <Badge color={getAppointmentStatusColor(row.status)} variant="light">
        {getAppointmentStatusLabel(row.status)}
      </Badge>
    ),
  },
  {
    key: 'appointmentDateLabel',
    title: 'Turno asociado',
    accessor: 'appointmentDateLabel',
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm">{row.appointmentDateLabel}</Text>
        <Text size="xs" c="dimmed">
          {row.appointmentTimeLabel}
        </Text>
      </Stack>
    ),
  },
];
