import { Badge, Stack, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import { formatDateTime } from 'shared/utils';

import { getAppointmentStatusColor, getAppointmentStatusLabel } from '../utils';
import type { HistoryAppointmentViewModel } from '../viewmodel/history-appointment-view-model';

export const historyColumns: TableColumn<HistoryAppointmentViewModel>[] = [
  {
    key: 'startDateTime',
    title: 'Fecha',
    accessor: 'startDateTime',
    sortable: true,
    noWrap: true,
    render: (row) => formatDateTime(row.startDateTime),
  },

  {
    key: 'clientName',
    title: 'Cliente',
    accessor: 'clientName',
    sortable: true,
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm">{row.clientName}</Text>
        <Text size="xs" c="dimmed">
          {row.clientPhone}
          {row.clientEmail ? ` | ${row.clientEmail}` : ''}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'serviceName',
    title: 'Servicio',
    accessor: 'serviceName',
    sortable: true,
  },
  {
    key: 'createdByLabel',
    title: 'Creado por',
    accessor: 'createdByLabel',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Estado',
    accessor: 'status',
    sortable: true,
    noWrap: true,
    render: (row) => (
      <Badge color={getAppointmentStatusColor(row.status)} variant="light">
        {getAppointmentStatusLabel(row.status)}
      </Badge>
    ),
  },
  {
    key: 'detail',
    title: 'Detalle',
    accessor: 'detail',
    render: (row) => row.detail,
  },
];
