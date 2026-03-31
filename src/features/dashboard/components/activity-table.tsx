import { Badge, Stack, Text } from '@mantine/core';
import { GenericTable, type SortState, type TableColumn } from 'shared/components';
import { formatDateTime, formatTime } from 'shared/utils';
import { getAppointmentStatusColor, getAppointmentStatusLabel } from '../utils';
import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

interface ActivityTableProps {
  data: ActivityEventViewModel[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
}

const columns: TableColumn<ActivityEventViewModel>[] = [
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
        <Text size="xs" c="dimmed">
          {row.actorUserId != null && `userId: ${row.actorUserId}`}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'eventDateTime',
    title: 'Fecha del evento',
    accessor: 'eventDateTime',
    sortable: true,
    render: (row) => `${formatDateTime(row.eventDateTime)} ${formatTime(row.eventDateTime)}`,
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

const activitySortFn = (a: ActivityEventViewModel, b: ActivityEventViewModel, sort: SortState) => {
  if (!sort.columnKey) return 0;

  let comparison = 0;

  switch (sort.columnKey) {
    case 'eventDateTime':
      comparison = new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime();
      break;
    case 'clientName':
      comparison = a.clientName.localeCompare(b.clientName, 'es-AR');
      break;
    case 'status':
      comparison = a.status.localeCompare(b.status, 'es-AR');
      break;
    case 'eventType':
      comparison = a.eventType.localeCompare(b.eventType, 'es-AR');
      break;
    case 'actorLabel':
      comparison = a.actorLabel.localeCompare(b.actorLabel, 'es-AR');
      break;
    default:
      comparison = 0;
  }

  return sort.direction === 'asc' ? comparison : -comparison;
};

export function ActivityTable({
  data,
  loading = false,
  fetching = false,
  isError = false,
  onRefetch,
}: ActivityTableProps) {
  return (
    <GenericTable
      data={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      fetching={fetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudieron cargar los eventos del servicio."
      defaultSort={{ columnKey: 'eventDateTime', direction: 'desc' }}
      sortFn={activitySortFn}
      showSearch
      showPaginator
      pageSize={10}
      minWidth={980}
      emptyMessage="Todavia no hay eventos para mostrar."
      searchPlaceholder="Buscar por evento, cliente, actor o estado"
      searchFn={(row, query) => {
        const value = query.toLowerCase();
        return [
          row.eventType,
          row.clientName,
          row.clientEmail ?? '',
          row.actorLabel,
          row.status,
          row.appointmentDateLabel,
        ].some((field) => field.toLowerCase().includes(value));
      }}
    />
  );
}
